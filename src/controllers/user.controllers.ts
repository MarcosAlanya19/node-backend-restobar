import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const userData = req.body;


  try {
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userData = req.body;
  try {
    await userService.updateUser(id, userData);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await userService.deleteUser(id);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
