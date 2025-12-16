// server/routes/wishRoutes.js
const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { createWish, getLiveWishes, getMyWishes } = require('../controllers/wishController');
const { 
    initiateFunding, // NEW CONTROLLER FUNCTION
    // ... other imports ... 
} = require('../controllers/wishController');
const router = express.Router();

// Route for Wishers to submit a new wish (Protected and restricted to Wishers)
router.post('/', protect, restrictTo(['Wisher']), createWish);

router.post('/:id/fund', protect, restrictTo(['Donor']), initiateFunding); // NEW ROUTE

// Route for Donors to browse live wishes (Protected and restricted to Donors)
router.get('/live', protect, restrictTo(['Donor']), getLiveWishes);

// Route for a Wisher to see their own posted wishes (Protected and restricted to Wishers)
router.get('/me', protect, restrictTo(['Wisher']), getMyWishes);

module.exports = router;