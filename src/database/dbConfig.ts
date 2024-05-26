import pgPromise from 'pg-promise';

const pgp = pgPromise();

const sysDb = pgp({
  host: `localhost`,
  port: 5432,
  database: 'monday',
  user: 'postgres',
  password: 'root',
});

const mainDbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'monday',
  user: 'postgres',
  password: 'root',
};

export const createDatabaseIfNotExists = async () => {
  const dbName = mainDbConfig.database;

  const dbExistsQuery = `
    SELECT 1
    FROM pg_database
    WHERE datname = $1
  `;

  const dbExists = await sysDb.oneOrNone(dbExistsQuery, dbName);

  if (!dbExists) {
    const createDbQuery = `CREATE DATABASE ${dbName}`;
    await sysDb.none(createDbQuery);
    console.log(`Database ${dbName} created`);
  } else {
    console.log(`Database ${dbName} already exists`);
  }

  pgp.end();
};

export const db = pgp(mainDbConfig);
