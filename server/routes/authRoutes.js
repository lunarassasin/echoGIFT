// server/routes/authRoutes.js (Updated)
const express = require('express');
const { registerUser, loginUser, validateToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, RegisterSchema } = require('../middleware/validation'); // NEW IMPORT

const router = express.Router();

// Public routes for user registration and login
// Input validation is now the first step!
router.post('/register', validate(RegisterSchema), registerUser); 
router.post('/login', loginUser);

// Route for JWT check
router.get('/validate', protect, validateToken);

module.exports = router;