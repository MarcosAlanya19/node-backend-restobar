import { db } from '../database/dbConfig';

export const getBurgers = async () => {
  return db.any('SELECT * FROM Burger');
};

export const getBurgerById = async (id: number) => {
  return db.oneOrNone('SELECT * FROM Burger WHERE id = $1', [id]);
};

export const createBurger = async (name: string, description: string, price: number, imageUrl: string, storeId: number) => {
  return db.one('INSERT INTO Burger(burger_name, description, price, burger_img, store_id) VALUES($1, $2, $3, $4, $5) RETURNING *', [name, description, price, imageUrl, storeId]);
};

export const updateBurger = async (id: number, name: string, description: string, price: number, imageUrl: string, storeId: number) => {
  return db.none('UPDATE Burger SET burger_name = $1, description = $2, price = $3, burger_img = $4, store_id = $5 WHERE id = $6', [name, description, price, imageUrl, storeId, id]);
};

export const deleteBurger = async (id: number) => {
  return db.none('DELETE FROM Burger WHERE id = $1', [id]);
};
