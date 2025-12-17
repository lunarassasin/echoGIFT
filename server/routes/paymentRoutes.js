import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js'; // Ensure user is logged in

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);

export default router;