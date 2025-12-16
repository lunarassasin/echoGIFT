// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from the React client
app.use(express.json()); // Allows parsing of JSON request bodies

// --- Database Connection (will be defined in config/db.js) ---
const db = require('./config/db'); 
db.getConnection()
  .then(() => console.log('✅ MySQL Database Connected'))
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.stack);
    process.exit(1);
  });

app.use((req, res, next) => {
    // Check if the request is NOT for the webhook path
    if (req.originalUrl === '/api/webhooks/stripe') {
        next();
    } else {
        // Use standard JSON parser for all other API routes
        express.json()(req, res, next);
    }
});

// --- Routes (To be added later) ---
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/wishes', require('./routes/wishRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // NEW ADMIN ROUTE

const webhookRouter = require('./routes/webhookRoutes');
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRouter); 
// We use express.raw() here to get the raw body needed for Stripe verification

// Basic status check route
app.get('/', (req, res) => {
  res.send('echoGIFT API is Running');
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));