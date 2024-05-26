import { Request, Response } from 'express';
import * as storeService from '../services/store.service';

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await storeService.getStores();
    res.json(stores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const store = await storeService.getStoreById(id);
    if (store) {
      res.json(store);
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createStore = async (req: Request, res: Response) => {
  const storeData = req.body;
  try {
    const newStore = await storeService.createStore(storeData);
    res.status(201).json(newStore);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const storeData = req.body;
  try {
    await storeService.updateStore(id, storeData);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await storeService.deleteStore(id);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
