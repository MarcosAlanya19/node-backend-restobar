import sharp from 'sharp';
import { deleteImg, uploadImg } from '../config/cloudinary';
import { pool } from '../database/dbConfig';
import { IBurger } from '../types/burger.type';

export const getBurgers = async () => {
  const { rows } = await pool.query(`
    SELECT
      b.*,
      COALESCE(json_agg(json_build_object('id', s.id, 'name', s.store_name)) FILTER (WHERE s.id IS NOT NULL), '[]') as stores
    FROM
      MenuItem b
    LEFT JOIN
      StoreMenuItem sb ON b.id = sb.item_id
    LEFT JOIN
      Store s ON sb.store_id = s.id
    GROUP BY
      b.id
  `);
  return rows;
};

export const getBurgerById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM MenuItem WHERE id = $1', [id]);
  return rows;
};

async function optimizeImage(imagePath: string): Promise<string> {
  await sharp(imagePath).resize({ width: 1000 }).jpeg({ quality: 80 }).toFile('optimizedImage.jpg');

  return 'optimizedImage.jpg';
}

export async function createBurger(burgerData: IBurger, imagePath: string) {
  const { item_name, description, price, store_ids } = burgerData;

  const storeIdsArray = typeof store_ids === 'string' ? store_ids.split(',').map((id) => id.trim()) : store_ids;

  const optimizedImagePath = await optimizeImage(imagePath);

  const result = await uploadImg(optimizedImagePath);
  const imageUrl = {
    public_id: result.public_id,
    secure_url: result.secure_url,
  };

  const { rows } = await pool.query('INSERT INTO MenuItem(item_name, public_id, secure_url, description, price) VALUES($1, $2, $3, $4, $5) RETURNING *', [
    item_name,
    imageUrl.public_id,
    imageUrl.secure_url,
    description,
    price,
  ]);

  const newBurger = rows[0];

  if (storeIdsArray && storeIdsArray.length > 0) {
    const storeBurgerValues = storeIdsArray.map((store_id: number) => `(${newBurger.id}, ${store_id})`).join(', ');
    await pool.query(`INSERT INTO StoreMenuItem (item_id, store_id) VALUES ${storeBurgerValues}`);
  }

  return newBurger;
}

export async function updateBurger(id: number, burgerData: IBurger, imagePath?: string) {
  const { item_name, description, price, store_ids, type } = burgerData;

  const storeIdsArray = typeof store_ids === 'string' ? store_ids.split(',').map((id) => id.trim()) : store_ids;

  const { rows: currentRows } = await pool.query('SELECT public_id, secure_url, type FROM MenuItem WHERE id = $1', [id]);
  const currentBurger = currentRows[0];

  let imageUrl = {
    public_id: currentBurger.public_id,
    secure_url: currentBurger.secure_url,
  };

  if (imagePath && imagePath.trim() !== '') {
    if (currentBurger.public_id) {
      await deleteImg(currentBurger.public_id);
    }

    const optimizedImagePath = await optimizeImage(imagePath);

    const result = await uploadImg(optimizedImagePath);
    imageUrl = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const updatedImageUrl = imageUrl;

  const { rows } = await pool.query(
    'UPDATE MenuItem SET item_name = $1, description = $2, price = $3, public_id = $4, secure_url = $5, type = $6 WHERE id = $7 RETURNING *',
    [
      item_name,
      description,
      price,
      updatedImageUrl.public_id,
      updatedImageUrl.secure_url,
      type,
      id,
    ]
  );

  return rows[0];
}
export async function deleteBurger(id: number): Promise<void> {
  await pool.query('DELETE FROM StoreMenuItem WHERE item_id = $1', [id]);

  const { rows } = await pool.query('SELECT public_id FROM MenuItem WHERE id = $1', [id]);
  const currentBurger = rows[0];

  if (currentBurger && currentBurger.public_id) {
    await deleteImg(currentBurger.public_id);
  }

  await pool.query('DELETE FROM MenuItem WHERE id = $1', [id]);
}
