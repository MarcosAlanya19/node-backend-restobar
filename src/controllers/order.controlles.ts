import { Request, Response } from 'express';
import { orderService } from '../services/order.service';

export const orderController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const orderId = await orderService.createOrder(req.body);
      res.status(201).json({ orderId });
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ message: 'Error al crear el pedido' });
    }
  },

  getOrderDetails: async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const orderDetails = await orderService.getOrderDetails(orderId);
      res.status(200).json(orderDetails);
    } catch (error) {
      console.error('Error al obtener los detalles del pedido:', error);
      res.status(500).json({ message: 'Error al obtener los detalles del pedido' });
    }
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const { newStatus, newStoreId } = req.body;

      const storeId = typeof newStoreId === 'string' ? parseInt(newStoreId, 10) : newStoreId;

      const validStatuses = ['pending', 'in_process', 'delivered', 'rejected'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('El estado proporcionado no es válido');
      }

      if (isNaN(orderId)) {
        throw new Error('El ID del pedido no es válido');
      }

      await orderService.updateOrderStatus(orderId, newStatus, storeId);

      res.status(200).json({ message: 'Estado del pedido actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
    }
  },

  deleteOrder: async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      await orderService.deleteOrder(orderId);
      res.status(200).json({ message: 'Pedido eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
      res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
  },

  getOrders: async (req: Request, res: Response) => {
    try {
      const orders = await orderService.getOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
      res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
  },
};
