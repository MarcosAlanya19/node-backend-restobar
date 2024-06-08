import { Router } from 'express';
import * as burgerCtrl from '../controllers/burger.controllers';

export const burgerRouter = Router();

burgerRouter.get('/burgers', burgerCtrl.getBurgers);
burgerRouter.get('/burgers/:id', burgerCtrl.getBurgerById);
burgerRouter.post('/burgers', burgerCtrl.createBurger);
burgerRouter.put('/burgers/:id', burgerCtrl.updateBurger);
burgerRouter.delete('/burgers/:id', burgerCtrl.deleteBurger);
