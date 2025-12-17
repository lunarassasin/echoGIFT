// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Route Imports (Must include .js)
import authRoutes from './routes/authRoutes.js';
import wishRoutes from './routes/wishRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { getConnection } from './config/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DEBUG: Verify environment
console.log("DEBUG: ENCRYPTION_KEY is present:", !!process.env.ENCRYPTION_KEY);

// --- Database Connection Check ---
getConnection()
  .then(() => console.log('✅ MySQL Database Connected'))
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.stack);
    process.exit(1);
  });

// --- Middleware ---
app.use(cors({
    origin: 'https://echo-gift.vercel.app', // Your specific Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// 1. STRIPE WEBHOOK (Must stay above express.json())
// We apply express.raw only to this specific path
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

// 2. STANDARD JSON PARSER
// Applied to all other routes
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/wishes', wishRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donor', donorRoutes);
app.use('api/payments', paymentRoutes);

// Status check
app.get('/', (req, res) => {
  res.send('echoGIFT API is Running');
});



app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));