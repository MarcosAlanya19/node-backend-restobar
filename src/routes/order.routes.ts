import { Router } from 'express';
import { orderController } from '../controllers/order.controlles';

export const orderRouter = Router();

orderRouter.post('/orders', orderController.createOrder);

// Ruta para obtener los detalles de un pedido específico
orderRouter.get('/orders/:orderId', orderController.getOrderDetails);

// Ruta para actualizar el estado de un pedido
orderRouter.patch('/orders/:orderId', orderController.updateOrderStatus);

// Ruta para eliminar un pedido
orderRouter.delete('/orders/:orderId', orderController.deleteOrder);

// Ruta para obtener todos los pedidos
orderRouter.get('/orders', orderController.getOrders);
