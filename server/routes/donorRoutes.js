// server/routes/donorRoutes.js

import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js'; 
import { getOpenWishes, getFulfillmentHistory } from '../controllers/donorController.js'; 

const router = express.Router();

router.get('/wishes/open', protect, restrictTo(['Donor']), getOpenWishes);
router.get('/history', protect, restrictTo(['Donor']), getFulfillmentHistory);

export default router;