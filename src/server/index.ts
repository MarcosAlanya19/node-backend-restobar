import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import { ServerConfig } from '../app';
import { router as burgerRouter } from '../routes/burger.routes';
import { router as storeRouter } from '../routes/store.routes';
import { router as userRouter } from '../routes/user.routes';

export class Server {
  private app: express.Application;

  constructor(private config: typeof ServerConfig) {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  private middlewares = (): void => {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(fileUpload());
  };

  private routes = (): void => {
    this.app.use('/api', storeRouter);
    this.app.use(this.config.userPath, burgerRouter);
    this.app.use(this.config.userPath, userRouter);
  };

  public listen = (): void => {
    this.app.listen(this.config.port, () => {
      console.log(`Server listening on port ${this.config.port}`);
    });
  };
}
