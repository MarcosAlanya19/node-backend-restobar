import { Router } from 'express';
import { createOrderCtrl, deleteOrderCtrl, getOrderDetailsCtrl, updateOrderStatusCtrl } from '../controllers/order.controlles';

export const orderRouter = Router();

orderRouter.post('/orders', createOrderCtrl);

// Ruta para obtener detalles de un pedido por su ID
orderRouter.get('/orders/:id', getOrderDetailsCtrl);

// Ruta para actualizar el estado de un pedido por su ID
orderRouter.put('/orders/:id/status', updateOrderStatusCtrl);

// Ruta para eliminar un pedido por su ID
orderRouter.delete('/orders/:id', deleteOrderCtrl);
