// server/routes/donorRoutes.js

import express from 'express';
// Use the same middleware imports as wishRoutes.js
import { protect, authorize } from '../middleware/authMiddleware.js'; 
import { getOpenWishes, getFulfillmentHistory } from '../controllers/donorController.js'; 

const router = express.Router();

// All Donor dashboard routes should be protected and restricted to the 'Donor' role

// GET /api/donor/wishes/open
router.get('/wishes/open', protect, authorize('Donor'), getOpenWishes);

// GET /api/donor/history
router.get('/history', protect, authorize('Donor'), getFulfillmentHistory);

export default router;