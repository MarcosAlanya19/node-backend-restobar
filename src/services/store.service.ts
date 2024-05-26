import { db } from '../database/dbConfig';

interface Store {
  id: number;
  store_name: string;
  address: string;
  phone: string;
  opening_hour: string;
  closing_hour: string;
}

export const getStores = async (): Promise<Store[]> => {
  return db.any('SELECT * FROM Store');
};

export const getStoreById = async (id: number): Promise<Store | null> => {
  return db.oneOrNone('SELECT * FROM Store WHERE id = $1', [id]);
};

export const createStore = async (storeData: Store): Promise<Store> => {
  const { store_name, address, phone, opening_hour, closing_hour } = storeData;
  return db.one('INSERT INTO Store(store_name, address, phone, opening_hour, closing_hour) VALUES($1, $2, $3, $4, $5) RETURNING *', [
    store_name,
    address,
    phone,
    opening_hour,
    closing_hour,
  ]);
};

export const updateStore = async (id: number, storeData: Store): Promise<void> => {
  const { store_name, address, phone, opening_hour, closing_hour } = storeData;
  await db.none('UPDATE Store SET store_name = $1, address = $2, phone = $3, opening_hour = $4, closing_hour = $5 WHERE id = $6', [
    store_name,
    address,
    phone,
    opening_hour,
    closing_hour,
    id,
  ]);
};

export const deleteStore = async (id: number): Promise<void> => {
  await db.none('DELETE FROM Store WHERE id = $1', [id]);
};
