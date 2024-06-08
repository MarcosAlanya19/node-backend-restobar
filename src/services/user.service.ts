import { pool } from '../database/dbConfig';

interface User {
  id: number;
  user_name: string;
  user_password: string;
  email: string;
}

export const getUsers = async () => {
  const { rows } = await pool.query('SELECT * FROM User_Store');
  return rows;
};

export const getUserById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM User_Store WHERE id = $1', [id]);
  return rows;
};

export const createUser = async (userData: User) => {
  const { user_name, user_password, email } = userData;
  const { rows } = await pool.query('INSERT INTO User_Store(user_name, user_password, email) VALUES($1, $2, $3) RETURNING *', [user_name, user_password, email]);
  return rows;
};

export const updateUser = async (id: number, userData: User) => {
  const { user_name, user_password, email } = userData;
  const { rows } = await pool.query('UPDATE User_Store SET user_name = $1, user_password = $2, email = $3 WHERE id = $4', [user_name, user_password, email, id]);
  return rows;
};

export const deleteUser = async (id: number) => {
  await pool.query('DELETE FROM User_Store WHERE id = $1', [id]);
};

export const loginUser = async (email: string, password: string) => {
  const { rows } = await pool.query('SELECT * FROM User_Store WHERE email = $1 AND user_password = $2', [email, password]);
  return rows[0];
};
