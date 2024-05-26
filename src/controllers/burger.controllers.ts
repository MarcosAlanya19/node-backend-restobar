import { Request, Response } from 'express';
import * as burgerService from '../services/burger.service';

export const getBurgers = async (req: Request, res: Response) => {
  try {
    const burgers = await burgerService.getBurgers();
    res.json(burgers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBurgerById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const burger = await burgerService.getBurgerById(id);
    if (burger) {
      res.json(burger);
    } else {
      res.status(404).json({ error: 'Burger not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBurger = async (req: Request, res: Response) => {
  const { burger_name, description, price, burger_img, store_id } = req.body;
  try {
    const newBurger = await burgerService.createBurger(burger_name, description, price, burger_img, store_id);
    res.status(201).json(newBurger);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBurger = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { burger_name, description, price, burger_img, store_id } = req.body;
  try {
    await burgerService.updateBurger(id, burger_name, description, price, burger_img, store_id);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBurger = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await burgerService.deleteBurger(id);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
