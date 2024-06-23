import { pool } from '../database/dbConfig';
import { User } from '../types/user.type';

export const getUsers = async () => {
  const { rows } = await pool.query('SELECT * FROM User_Store');
  return rows;
};

export const getUserById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM User_Store WHERE id = $1', [id]);
  return rows;
};

export const checkEmailExists = async (email: string) => {
  const { rows } = await pool.query('SELECT * FROM User_Store WHERE email = $1', [email]);
  return rows.length > 0;
};

export const createUser = async (userData: User) => {
  const { user_name, user_password, email, role = 'customer', address, phone_number } = userData;
  const { rows } = await pool.query(
    'INSERT INTO User_Store (user_name, user_password, email, role, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_name, user_password, email, role, address, phone_number]
  );
  return rows[0];
};

export const updateUser = async (id: number, userData: User) => {
  const { user_name, user_password, email, role, address, phone_number } = userData;
  const { rows } = await pool.query('UPDATE User_Store SET user_name = $1, user_password = $2, email = $3, role = $4, address = $5, phone_number = $6 WHERE id = $7 RETURNING *', [
    user_name,
    user_password,
    email,
    role,
    address,
    phone_number,
    id,
  ]);
  return rows[0];
};

export const deleteUser = async (id: number) => {
  await pool.query('DELETE FROM User_Store WHERE id = $1', [id]);
};

export const loginUser = async (email: string, password: string) => {
  const { rows } = await pool.query('SELECT * FROM User_Store WHERE email = $1 AND user_password = $2', [email, password]);
  return rows[0];
};
