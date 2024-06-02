import pg from 'pg';

export const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'root',
  database: 'tostado',
  port: 5432,
});
