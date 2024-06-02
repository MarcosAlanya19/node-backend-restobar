import { deleteImg, uploadImg } from '../config/cloudinary';
import { pool } from '../database/dbConfig';

interface Store {
  id: number;
  store_name: string;
  address: string;
  phone: string;
  opening_hour: string;
  closing_hour: string;
}

export const getStores = async () => {
  const { rows } = await pool.query('SELECT * FROM Store');
  return rows;
};

export const getStoreById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM Store WHERE id = $1', [id]);
  return rows;
};

export const createStore = async (storeData: Store, imagePath: string) => {
  const { store_name, address, phone, opening_hour, closing_hour } = storeData;

  const result = await uploadImg(imagePath);
  const imageUrl = {
    public_id: result.public_id,
    secure_url: result.secure_url,
  };

  const { rows } = await pool.query(
    'INSERT INTO Store(store_name, public_id, secure_url, address, phone, opening_hour, closing_hour) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [store_name, imageUrl.public_id, imageUrl.secure_url, address, phone, opening_hour, closing_hour]
  );

  return rows[0];
};

export async function updateStore(id: number, storeData: Store, imagePath: string) {
  const { store_name, address, phone, opening_hour, closing_hour } = storeData;

  const { rows: currentRows } = await pool.query('SELECT public_id FROM Store WHERE id = $1', [id]);
  const currentStore = currentRows[0];

  if (currentStore.public_id) {
    await deleteImg(currentStore.public_id);
  }

  const result = await uploadImg(imagePath);
  const imageUrl = {
    public_id: result.public_id,
    secure_url: result.secure_url,
  };

  const { rows } = await pool.query(
    'UPDATE Store SET store_name = $1, address = $2, phone = $3, opening_hour = $4, closing_hour = $5, public_id = $6, secure_url = $7 WHERE id = $8 RETURNING *',
    [store_name, address, phone, opening_hour, closing_hour, imageUrl.public_id, imageUrl.secure_url, id]
  );

  return rows[0];
}

export async function deleteStore(id: number): Promise<void> {
  const { rows: currentRows } = await pool.query('SELECT public_id FROM Store WHERE id = $1', [id]);
  const currentStore = currentRows[0];

  if (currentStore.public_id) {
    await deleteImg(currentStore.public_id);
  }

  await pool.query('DELETE FROM Store WHERE id = $1', [id]);
}
