import { db } from '../database/dbConfig';

interface User {
  id: number;
  user_name: string;
  user_password: string;
  email: string;
}

export const getUsers = async (): Promise<User[]> => {
  return db.any('SELECT * FROM User_Store');
};

export const getUserById = async (id: number): Promise<User | null> => {
  return db.oneOrNone('SELECT * FROM User_Store WHERE id = $1', [id]);
};

export const createUser = async (userData: User): Promise<User> => {
  const { user_name, user_password, email } = userData;
  return db.one('INSERT INTO User_Store(user_name, user_password, email) VALUES($1, $2, $3) RETURNING *', [user_name, user_password, email]);
};

export const updateUser = async (id: number, userData: User): Promise<void> => {
  const { user_name, user_password, email } = userData;
  await db.none('UPDATE User_Store SET user_name = $1, user_password = $2, email = $3 WHERE id = $4', [user_name, user_password, email, id]);
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.none('DELETE FROM User_Store WHERE id = $1', [id]);
};
