import { Router } from 'express';
import * as storeCtrl from '../controllers/store.controllers';

export const router = Router();

router.get('/stores', storeCtrl.getStores);
router.get('/stores/:id', storeCtrl.getStoreById);
router.post('/stores', storeCtrl.createStore);
router.put('/stores/:id', storeCtrl.updateStore);
router.delete('/stores/:id', storeCtrl.deleteStore);
