import { pool } from '../database/dbConfig';

interface OrderItem {
  item_id: number;
  quantity: number;
}

export interface Order {
  user_id: number;
  store_id: number;
  items: OrderItem[];
  status: 'pending' | 'in_process' | 'delivered';
}

export const createOrder = async (order: Order) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { user_id, store_id, status, items } = order;

    const orderResult = await client.query('INSERT INTO "Order" (user_id, store_id, status) VALUES ($1, $2, $3) RETURNING *', [user_id, store_id, status]);

    const newOrder = orderResult.rows[0];

    const orderItemsQuery = `
            INSERT INTO "OrderItem" (order_id, item_id, quantity)
            VALUES ${items.map((_, index) => `($1, $${index * 2 + 2}, $${index * 2 + 3})`).join(', ')}
        `;

    const orderItemsValues = items.flatMap(({ item_id, quantity }) => [newOrder.id, item_id, quantity]);

    await client.query(orderItemsQuery, [newOrder.id, ...orderItemsValues]);

    await client.query('COMMIT');

    return newOrder;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
