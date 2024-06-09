import { Request, Response } from 'express';
import { Order, createOrder } from '../services/order.service';

export const createOrderCtrl = async (req: Request, res: Response) => {
  try {
    const { user_id, store_id, items } = req.body as Order;
    const order = {
      user_id,
      store_id,
      items,
      status: 'pending',
    };
    const newOrder = await createOrder(order as Order);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};
