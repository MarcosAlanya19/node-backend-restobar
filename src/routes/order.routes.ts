import { Router } from 'express';
import { createOrderCtrl } from '../controllers/order.controlles';

const orderRouter = Router();

orderRouter.post('/orders', createOrderCtrl);

export default orderRouter;
