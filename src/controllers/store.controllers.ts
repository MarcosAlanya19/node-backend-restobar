import { Request, Response } from 'express';
import * as storeService from '../services/store.service';
import fileUpload from 'express-fileupload';

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await storeService.getStores();
    console.log({ stores });
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
  const file = req.files?.image;

  if (!file || Array.isArray(file)) {
    return res.status(400).send('No image file uploaded or multiple files uploaded');
  }

  try {
    const imagePath = (file as fileUpload.UploadedFile).tempFilePath;
    const newStore = await storeService.createStore(storeData, imagePath);
    res.status(201).json(newStore);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('Invalid store ID');
  }

  const storeData = req.body;
  const file = req.files?.image;

  try {
    if (file && !Array.isArray(file)) {
      const imagePath = (file as fileUpload.UploadedFile).tempFilePath;
      const updatedStore = await storeService.updateStore(id, storeData, imagePath);
      res.status(200).json(updatedStore);
    } else {
      const updatedStore = await storeService.updateStore(id, storeData);
      res.status(200).json(updatedStore);
    }
  } catch (error: any) {
    console.error("Error updating store:", error);
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
