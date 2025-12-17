// server/routes/authRoutes.js
import express from 'express';
// Note: We use .js extension for local files in ES Modules
import { registerUser, loginUser, validateToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, RegisterSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes for user registration and login
router.post('/register', validate(RegisterSchema), registerUser); 
router.post('/login', loginUser);

// Route for JWT check
router.get('/validate', protect, validateToken);

export default router;