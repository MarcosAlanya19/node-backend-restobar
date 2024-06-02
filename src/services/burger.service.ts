import { deleteImg, uploadImg } from '../config/cloudinary';
import { pool } from '../database/dbConfig';
import { IBurger } from '../types/burger.type';

export const getBurgers = async () => {
  const { rows } = await pool.query('SELECT * FROM Burger');
  return rows;
};

export const getBurgerById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM Burger WHERE id = $1', [id]);
  return rows;
};

export async function createBurger(burgerData: IBurger, imagePath: string) {
  const { burger_name, description, price, store_id } = burgerData;

  const result = await uploadImg(imagePath);
  const imageUrl = {
    public_id: result.public_id,
    secure_url: result.secure_url,
  };

  const { rows } = await pool.query('INSERT INTO Burger(burger_name, public_id, secure_url, description, price, store_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [
    burger_name,
    imageUrl.public_id,
    imageUrl.secure_url,
    description,
    price,
    store_id,
  ]);

  return rows[0];
}

export async function updateBurger(id: number, burgerData: IBurger, imagePath: string) {
  const { burger_name, description, price, store_id } = burgerData;
  const { rows: currentRows } = await pool.query('SELECT public_id FROM Burger WHERE id = $1', [id]);

  const currentBurger = currentRows[0];

  if (currentBurger.public_id) {
    await deleteImg(currentBurger.public_id);
  }

  const result = await uploadImg(imagePath);
  const imageUrl = {
    public_id: result.public_id,
    secure_url: result.secure_url,
  };

  const { rows } = await pool.query('UPDATE Burger SET burger_name = $1, description = $2, price = $3, store_id = $4, public_id = $5, secure_url = $6 WHERE id = $7 RETURNING *', [
    burger_name,
    description,
    price,
    store_id,
    imageUrl.public_id,
    imageUrl.secure_url,
    id,
  ]);

  return rows[0];
}

export async function deleteBurger(id: number): Promise<void> {
  const { rows: currentRows } = await pool.query('SELECT public_id FROM Burger WHERE id = $1', [id]);
  const currentBurger = currentRows[0];

  if (currentBurger.public_id) {
    await deleteImg(currentBurger.public_id);
  }

  await pool.query('DELETE FROM Burger WHERE id = $1', [id]);
}
