import { Router } from 'express';
import * as burgerCtrl from '../controllers/burger.controllers';

export const router = Router();

router.get('/burgers', burgerCtrl.getBurgers);
router.get('/burgers/:id', burgerCtrl.getBurgerById);
router.post('/burgers', burgerCtrl.createBurger);
router.put('/burgers/:id', burgerCtrl.updateBurger);
router.delete('/burgers/:id', burgerCtrl.deleteBurger);
