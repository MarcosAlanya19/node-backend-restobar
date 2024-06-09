import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { IOrder } from '../types/order.type';

// Controlador para crear un nuevo pedido
export const createOrderCtrl = async (req: Request, res: Response) => {
  try {
    const order: IOrder = req.body;

    // Crear un nuevo pedido
    const orderId = await orderService.createOrder(order);

    // Devolver el ID del pedido creado en la respuesta
    res.status(201).json({ id: orderId, message: 'Pedido creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
  }
};

// Controlador para obtener detalles de un pedido por su ID
export const getOrderDetailsCtrl = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id, 10);

    // Obtener detalles del pedido por su ID
    const orderDetails = await orderService.getOrderDetails(orderId);

    // Devolver los detalles del pedido en la respuesta
    res.status(200).json(orderDetails);
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
  }
};

// Controlador para actualizar el estado de un pedido
export const updateOrderStatusCtrl = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id, 10);
    const { newStatus }: { newStatus: string } = req.body;

    // Actualizar el estado del pedido
    await orderService.updateOrderStatus(orderId, newStatus);

    // Devolver un mensaje de éxito en la respuesta
    res.status(200).json({ message: 'Estado del pedido actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
  }
};

// Controlador para eliminar un pedido por su ID
export const deleteOrderCtrl = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id, 10);

    // Eliminar el pedido por su ID
    await orderService.deleteOrder(orderId);

    // Devolver un mensaje de éxito en la respuesta
    res.status(200).json({ message: 'Pedido eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
  }
};
