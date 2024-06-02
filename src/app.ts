import express from 'express';
import { storeRouter } from './routes/store.routes';
import { userRouter } from './routes/user.routes';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { pool } from './database/dbConfig';

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

app.use('/api', storeRouter);
app.use('/api', userRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
