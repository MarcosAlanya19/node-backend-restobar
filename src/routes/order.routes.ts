import { Router } from 'express';
import { orderController } from '../controllers/order.controlles';

export const orderRouter = Router();

orderRouter.post('/orders', orderController.createOrder);
orderRouter.get('/orders/:orderId', orderController.getOrderDetails);
orderRouter.patch('/orders/:orderId', orderController.updateOrderStatus);
orderRouter.delete('/orders/:orderId', orderController.deleteOrder);
orderRouter.get('/orders', orderController.getOrders);
