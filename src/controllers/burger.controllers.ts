import { Request, Response } from 'express';
import * as burgerService from '../services/burger.service';
import { IBurger } from '../types/burger.type';
import fileUpload from 'express-fileupload';

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
  const burgerData = req.body as IBurger;
  const file = req.files?.image;

  if (!file || Array.isArray(file)) {
    return res.status(400).send('No image file uploaded or multiple files uploaded');
  }

  try {
    const imagePath = (file as fileUpload.UploadedFile).tempFilePath;
    const newBurger = await burgerService.createBurger(burgerData, imagePath);
    res.status(201).json(newBurger);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBurger = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const burgerData = req.body as IBurger;
  const file = req.files?.image;

  if (!file || Array.isArray(file)) {
    return res.status(400).send('No image file uploaded or multiple files uploaded');
  }

  try {
    const imagePath = (file as fileUpload.UploadedFile).tempFilePath;
    await burgerService.updateBurger(id, burgerData, imagePath);
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
