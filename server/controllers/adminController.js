// server/controllers/adminController.js (New File)
const { db } = require('../config/db');
const { decrypt } = require('../utils/encryptionService'); // NEW IMPORT

// @desc    Get all wishes pending review
// @route   GET /api/admin/wishes/pending
// @access  Private/Admin
const getPendingWishes = async (req, res) => {
    // Fetch all details needed for review, including the Wisher's real name and ID
    const sql = `
        SELECT 
            w.wish_id, 
            w.title, 
            w.story, 
            w.cost_estimate, 
            w.item_url, 
            w.created_at,
            u.user_id AS wisher_id,
            u.display_name,
            u.real_name,
            u.shipping_address,
            u.is_verified,
            c.category_name
        FROM wishes w
        JOIN users u ON w.wisher_id = u.user_id
        JOIN categories c ON w.category_id = c.category_id
        WHERE w.status = 'Pending Review'
        ORDER BY w.created_at ASC
    `;
    try {
        const [wishes] = await db.query(sql);
        
        // --- DECRYPTION STEP ---
        const decryptedWishes = wishes.map(wish => ({
            ...wish,
            // Decrypt the sensitive field before sending it to the Admin UI
            shipping_address: decrypt(wish.shipping_address) 
        }));
        // -----------------------

        res.status(200).json(decryptedWishes); // Send decrypted data
    } catch (error) {
        console.error('Error fetching pending wishes:', error);
        res.status(500).json({ message: 'Server error fetching admin list.' });
    }
};

// @desc    Approve a wish, moving it from 'Pending Review' to 'Live'
// @route   PUT /api/admin/wishes/:id/approve
// @access  Private/Admin
const approveWish = async (req, res) => {
    const { id } = req.params; // wish_id
    
    // Admin review must confirm the Wisher is verified before setting to Live
    const { isWisherVerified } = req.body; 

    if (!isWisherVerified) {
        return res.status(400).json({ message: 'Wisher must be manually verified (address/identity) before approval.' });
    }

    try {
        const [result] = await db.query(
            "UPDATE wishes SET status = 'Live' WHERE wish_id = ? AND status = 'Pending Review'",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Wish not found or already approved.' });
        }

        // Optional: Send a notification to the Wisher that their wish is Live

        res.status(200).json({ message: 'Wish approved and set to Live successfully.' });

    } catch (error) {
        console.error('Error approving wish:', error);
        res.status(500).json({ message: 'Server error during wish approval.' });
    }
};

module.exports = {
    getPendingWishes,
    approveWish,
    // Future: rejectWish, verifyWisher, etc.
};