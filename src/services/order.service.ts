import { pool } from '../database/dbConfig';
import { IOrder } from '../types/order.type';

export const orderService = {
  createOrder: async (order: IOrder): Promise<number> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { user_id, items } = order;

      const orderResult = await client.query('INSERT INTO "Order" (user_id) VALUES ($1) RETURNING id', [user_id]);
      const orderId = orderResult.rows[0].id;

      const orderItemsQuery = `
                INSERT INTO OrderItem (order_id, item_id, quantity)
                VALUES ${items.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')}
            `;

      const orderItemsValues = items.flatMap(({ item_id, quantity }) => [orderId, item_id, quantity]);
      await client.query(orderItemsQuery, orderItemsValues);

      await client.query('COMMIT');

      return orderId;
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
      const items: any = orderItemsResult.rows.map((row: any) => ({
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

      const existingOrder = await client.query('SELECT assigned_store_id FROM "Order" WHERE id = $1', [orderId]);
      const currentStoreId = existingOrder.rows[0]?.assigned_store_id;

      if (newStatus !== 'rejected' && newStatus !== 'delivered') {
        if (newStoreId === undefined) {
          throw new Error('Se requiere proporcionar un nuevo ID de tienda para cambiar el estado del pedido.');
        }

        if (newStoreId !== currentStoreId && currentStoreId !== null) {
          throw new Error('Ya hay una tienda asignada para este pedido.');
        }

        await client.query('UPDATE "Order" SET status = $1, assigned_store_id = $2 WHERE id = $3', [newStatus, newStoreId, orderId]);
      } else {
        await client.query('UPDATE "Order" SET status = $1, assigned_store_id = $2 WHERE id = $3', [newStatus,newStoreId,  orderId]);
      }

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
          json_build_object(
            'user_name', us.user_name,
            'email', us.email,
            'phone_number', us.phone_number,
            'address', us.address
          ) as user,
          json_build_object(
            'id', st.id,
            'store_name', st.store_name,
            'address', st.address,
            'phone', st.phone,
            'description', st.description,
            'opening_hour', st.opening_hour,
            'closing_hour', st.closing_hour
          ) as store,
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
        LEFT JOIN Store st ON o.assigned_store_id = st.id
        GROUP BY o.id, us.user_name, us.email, us.phone_number, us.address, st.id, st.store_name, st.address, st.phone, st.description, st.opening_hour, st.closing_hour;
      `;
      const result = await client.query(ordersQuery);

      // Mapear los resultados a un array de objetos de pedido
      const orders: IOrder[] = result.rows.map((row: any) => {
        const { items, user, store, ...orderData } = row;
        return { ...orderData, user, store, items };
      });

      return orders;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },
};
