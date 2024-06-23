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
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const userData = req.body;
  const { email } = userData;

  try {
    const emailExists = await userService.checkEmailExists(email);
    if (emailExists) {
      res.status(400).json({ error: 'El correo electrónico ya está en uso' });
      return;
    }

    const userCreated = await userService.createUser(userData);
    if (userCreated) {
      res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Error interno del servidor' });
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

export const loginUser = async (req: Request, res: Response) => {
  const { email, user_password } = req.body;
  try {
    const user = await userService.loginUser(email, user_password);
    if (user) {
      res.status(200).json({ message: 'Inicio de sesión correcto', user });
    } else {
      res.status(401).json({ error: 'Correo o contraseña no válidos' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
