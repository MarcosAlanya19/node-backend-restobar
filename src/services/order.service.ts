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
                SELECT * FROM OrderItem WHERE order_id = $1;
            `;
            const orderItemsResult = await client.query(orderItemsQuery, [orderId]);
            const items = orderItemsResult.rows;

            return { ...order, items };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    updateOrderStatus: async (orderId: number, newStatus: string): Promise<void> => {
        const client = await pool.connect();
        try {
            const updateQuery = `
                UPDATE "Order" SET status = $1 WHERE id = $2;
            `;
            await client.query(updateQuery, [newStatus, orderId]);
        } catch (error) {
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
    }
};
