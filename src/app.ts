import express from 'express';
import { storeRouter } from './routes/store.routes';
import { userRouter } from './routes/user.routes';

const app = express();

app.use(storeRouter)
app.use(userRouter)

app.listen(3000);
