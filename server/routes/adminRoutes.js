// server/routes/adminRoutes.js (New File)
// server/routes/adminRoutes.js
import express from 'express';
// FIXED: Use named imports and include the .js extension
import { protect, restrictTo } from '../middleware/authMiddleware.js';
// FIXED: Use named imports for your controller functions
import { getPendingWishes, approveWish } from '../controllers/adminController.js'

const router = express.Router();

// All admin routes are protected and restricted to 'Admin' user_type
router.use(protect, restrictTo(['Admin']));

// Admin Dashboard: View pending items
router.get('/wishes/pending', getPendingWishes);

// Admin Action: Approve a wish (changes status from 'Pending' to 'Live')
router.put('/wishes/:id/approve', approveWish);

export default router;

