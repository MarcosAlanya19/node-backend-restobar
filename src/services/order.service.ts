import { pool } from '../database/dbConfig';
import { IOrder } from '../types/order.type';

export const orderService = {
  createOrder: async (order: IOrder): Promise<number> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { user_id, items } = order;

      // Insertar el pedido y obtener su ID generado automáticamente
      const orderResult = await client.query('INSERT INTO "Order" (user_id) VALUES ($1) RETURNING id', [user_id]);
      const orderId = orderResult.rows[0].id;

      // Insertar los elementos del pedido en la tabla OrderItem
      const orderItemsQuery = `
                INSERT INTO OrderItem (order_id, item_id, quantity)
                VALUES ${items.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')}
            `;

      const orderItemsValues = items.flatMap(({ item_id, quantity }) => [orderId, item_id, quantity]);
      await client.query(orderItemsQuery, orderItemsValues);

      await client.query('COMMIT');

      return orderId; // Devolver el ID del pedido creado
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getOrderDetails: async (orderId: number): Promise<IOrder> => {
    const client = await pool.connect();
    try {
      const orderQuery = `
        SELECT * FROM "Order" WHERE id = $1;
      `;
      const orderResult = await client.query(orderQuery, [orderId]);
      const order = orderResult.rows[0];

      const orderItemsQuery = `
        SELECT oi.*, mi.item_name
        FROM OrderItem oi
        JOIN MenuItem mi ON oi.item_id = mi.id
        WHERE oi.order_id = $1;
      `;
      const orderItemsResult = await client.query(orderItemsQuery, [orderId]);
      const items: IOrderItem[] = orderItemsResult.rows.map((row: any) => ({
        id: row.id,
        item_name: row.item_name,
        description: row.description,
        price: row.price,
        quantity: row.quantity,
      }));

      return { ...order, items };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },

  updateOrderStatus: async (orderId: number, newStatus: string, newStoreId?: number): Promise<void> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let updateQuery = `
              UPDATE "Order" SET status = $1
          `;
      const params = [newStatus];

      // Agregar la asignación de tienda si se proporciona el nuevo ID de tienda
      if (newStoreId !== undefined) {
        updateQuery += `, store_id = $2`;
        params.push(newStoreId);
      }

      updateQuery += ` WHERE id = $${params.length + 1};`;

      await client.query(updateQuery, params.concat([orderId]));

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  deleteOrder: async (orderId: number): Promise<void> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Eliminar elementos del pedido
      const deleteItemsQuery = `
                DELETE FROM OrderItem WHERE order_id = $1;
            `;
      await client.query(deleteItemsQuery, [orderId]);

      // Eliminar el pedido
      const deleteOrderQuery = `
                DELETE FROM "Order" WHERE id = $1;
            `;
      await client.query(deleteOrderQuery, [orderId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getOrders: async (): Promise<IOrder[]> => {
    const client = await pool.connect();
    try {
      const ordersQuery = `
            SELECT
    o.id as order_id,
    o.status,
    o.assigned_store_id,
    o.order_date,
    us.user_name as user_name,
    json_agg(json_build_object(
        'id', mi.id,
        'item_name', mi.item_name,
        'description', mi.description,
        'price', mi.price,
        'quantity', oi.quantity
    )) AS items
FROM "Order" o
LEFT JOIN OrderItem oi ON o.id = oi.order_id
LEFT JOIN MenuItem mi ON oi.item_id = mi.id
LEFT JOIN User_Store us ON o.user_id = us.id
GROUP BY o.id, us.user_name;
        `;
      const result = await client.query(ordersQuery);

      // Mapear los resultados a un array de objetos de pedido
      const orders: IOrder[] = result.rows.map((row: any) => {
        const { items, ...orderData } = row;
        return { ...orderData, items };
      });

      return orders;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },
};
