// server/routes/webhookRoutes.js (New File)
const express = require('express');
const { handleStripeWebhook } = require('../controllers/webhookController');

const router = express.Router();

// Crucial: This endpoint needs the raw body, so we use a different parser middleware.
// We will set this up in server.js, and pass the raw body to the controller.
router.post('/stripe', handleStripeWebhook);

module.exports = router;