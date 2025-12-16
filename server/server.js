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

// --- Routes (To be added later) ---
// app.use('/api/auth', require('./routes/authRoutes')); 
// app.use('/api/wishes', require('./routes/wishRoutes'));

// Basic status check route
app.get('/', (req, res) => {
  res.send('echoGIFT API is Running');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));