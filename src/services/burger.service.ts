import { deleteImg, uploadImg } from '../config/cloudinary';
import { pool } from '../database/dbConfig';
import { IBurger } from '../types/burger.type';

export const getBurgers = async () => {
  const { rows } = await pool.query(`
    SELECT
      b.*,
      COALESCE(json_agg(json_build_object('id', s.id, 'name', s.store_name)) FILTER (WHERE s.id IS NOT NULL), '[]') as stores
    FROM
      Burger b
    LEFT JOIN
      Store_Burger sb ON b.id = sb.burger_id
    LEFT JOIN
      Store s ON sb.store_id = s.id
    GROUP BY
      b.id
  `);
  return rows;
};

export const getBurgerById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM Burger WHERE id = $1', [id]);
  return rows;
};

export async function createBurger(burgerData: IBurger, imagePath: string) {
  const { burger_name, description, price, store_ids } = burgerData;

  const storeIdsArray = typeof store_ids === 'string' ? store_ids.split(',').map((id) => id.trim()) : store_ids;

  const result = await uploadImg(imagePath);
  const imageUrl = {
    public_id: result.public_id,
    secure_url: result.secure_url,
  };

  const { rows } = await pool.query('INSERT INTO Burger(burger_name, public_id, secure_url, description, price) VALUES($1, $2, $3, $4, $5) RETURNING *', [
    burger_name,
    imageUrl.public_id,
    imageUrl.secure_url,
    description,
    price,
  ]);

  const newBurger = rows[0];

  if (storeIdsArray && storeIdsArray.length > 0) {
    const storeBurgerValues = storeIdsArray.map((store_id: number) => `(${newBurger.id}, ${store_id})`).join(', ');
    await pool.query(`INSERT INTO Store_Burger (burger_id, store_id) VALUES ${storeBurgerValues}`);
  }

  return newBurger;
}

export async function updateBurger(id: number, burgerData: IBurger, imagePath?: string) {
  const { burger_name, description, price, store_ids } = burgerData;

  const storeIdsArray = typeof store_ids === 'string' ? store_ids.split(',').map((id) => id.trim()) : store_ids;

  const { rows: currentRows } = await pool.query('SELECT public_id FROM Burger WHERE id = $1', [id]);
  const currentBurger = currentRows[0];

  let imageUrl = {
    public_id: currentBurger.public_id,
    secure_url: currentBurger.secure_url,
  };

  // Verificar si se proporciona una nueva imagen
  if (imagePath) {
    // Eliminar la imagen actual si existe
    if (currentBurger.public_id) {
      await deleteImg(currentBurger.public_id);
    }

    // Subir la nueva imagen
    const result = await uploadImg(imagePath);
    imageUrl = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const { rows } = await pool.query('UPDATE Burger SET burger_name = $1, description = $2, price = $3, public_id = $4, secure_url = $5 WHERE id = $6 RETURNING *', [
    burger_name,
    description,
    price,
    imageUrl.public_id,
    imageUrl.secure_url,
    id,
  ]);

  const updatedBurger = rows[0];

  if (storeIdsArray && storeIdsArray.length > 0) {
    // Eliminar las asociaciones antiguas
    await pool.query('DELETE FROM Store_Burger WHERE burger_id = $1', [id]);

    // Insertar nuevas asociaciones
    const storeBurgerValues = storeIdsArray.map((store_id: number) => `(${id}, ${store_id})`).join(', ');
    await pool.query(`INSERT INTO Store_Burger (burger_id, store_id) VALUES ${storeBurgerValues}`);
  }

  return updatedBurger;
}

export async function deleteBurger(id: number): Promise<void> {
  // Elimina las relaciones en la tabla Store_Burger
  await pool.query('DELETE FROM Store_Burger WHERE burger_id = $1', [id]);

  // Recupera el public_id de la imagen asociada a la hamburguesa si existe
  const { rows } = await pool.query('SELECT public_id FROM Burger WHERE id = $1', [id]);
  const currentBurger = rows[0];

  // Verifica si hay un public_id válido y elimina la imagen de Cloudinary si existe
  if (currentBurger && currentBurger.public_id) {
    await deleteImg(currentBurger.public_id);
  }

  // Elimina la hamburguesa de la base de datos
  await pool.query('DELETE FROM Burger WHERE id = $1', [id]);
}
