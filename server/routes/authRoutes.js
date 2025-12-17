// server/routes/authRoutes.js (Updated)
const express = require('express');
import { registerUser, loginUser, validateToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, RegisterSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes for user registration and login
// Input validation is now the first step!
router.post('/register', validate(RegisterSchema), registerUser); 
router.post('/login', loginUser);

// Route for JWT check
router.get('/validate', protect, validateToken);

export default router;