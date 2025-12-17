// server/routes/webhookRoutes.js
import express from 'express';
import { handleStripeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// The raw body parsing is handled at the app level in server.js
router.post('/stripe', handleStripeWebhook);

export default router;