import { Router } from 'express';
import * as storeCtrl from '../controllers/store.controllers';

export const storeRouter = Router();

storeRouter.get('/stores', storeCtrl.getStores);
storeRouter.get('/stores/:id', storeCtrl.getStoreById);
storeRouter.post('/stores', storeCtrl.createStore);
storeRouter.put('/stores/:id', storeCtrl.updateStore);
storeRouter.delete('/stores/:id', storeCtrl.deleteStore);
