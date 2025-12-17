// server/routes/wishRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { 
    createWish, 
    getLiveWishes, 
    getMyWishes, 
    initiateFunding 
} from '../controllers/wishController.js';

const router = express.Router();

// Route for Wishers to submit a new wish
router.post('/', protect, restrictTo(['Wisher']), createWish);

// Route for Donors to fund a specific wish
router.post('/:id/fund', protect, restrictTo(['Donor']), initiateFunding);

// Route for Donors to browse live wishes
router.get('/live', protect, restrictTo(['Donor']), getLiveWishes);

// Route for a Wisher to see their own posted wishes
router.get('/me', protect, restrictTo(['Wisher']), getMyWishes);

export default router;