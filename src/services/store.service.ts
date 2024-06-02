import { deleteImg, uploadImg } from '../config/cloudinary';
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

export const createStore = async (storeData: Store, imagePath: string) => {
  const { store_name, address, phone, opening_hour, closing_hour } = storeData;

  try {
    const result = await uploadImg(imagePath);

    const imageUrl = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

    const newStore = await db.one(
      'INSERT INTO Store(store_name, public_id, secure_url, address, phone, opening_hour, closing_hour) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [store_name, imageUrl.public_id, imageUrl.secure_url, address, phone, opening_hour, closing_hour]
    );

    return newStore;
  } catch (error: any) {
    console.log('Failed to create store with image: ' + error.message);
  }
};

export const updateStore = async (id: number, storeData: Store, image: any): Promise<void> => {
  const { store_name, address, phone, opening_hour, closing_hour } = storeData;

  const cloudinaryResponse = await cloudinary.uploader.upload(image.path);

  await db.none('UPDATE Store SET store_name = $1, address = $2, phone = $3, opening_hour = $4, closing_hour = $5, image_url = $6 WHERE id = $7', [
    store_name,
    address,
    phone,
    opening_hour,
    closing_hour,
    cloudinaryResponse.secure_url,
    id,
  ]);
};

export const deleteStore = async (id: number, publicId: string): Promise<void> => {
  await deleteImg(publicId);

  await db.none('DELETE FROM Store WHERE id = $1', [id]);
};
