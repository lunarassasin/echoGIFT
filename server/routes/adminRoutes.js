// server/routes/adminRoutes.js (New File)
const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { getPendingWishes, approveWish } = require('../controllers/adminController');

const router = express.Router();

// All admin routes are protected and restricted to 'Admin' user_type
router.use(protect, restrictTo(['Admin']));

// Admin Dashboard: View pending items
router.get('/wishes/pending', getPendingWishes);

// Admin Action: Approve a wish (e.g., after successful verification)
router.put('/wishes/:id/approve', approveWish);

module.exports = router;