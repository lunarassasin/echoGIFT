// server/controllers/adminController.js
import { db } from '../config/db.js';
import { decrypt } from '../utils/encryptionService.js';

export const getPendingWishes = async (req, res) => {
    const sql = `
        SELECT w.*, u.display_name, u.real_name, u.shipping_address, c.category_name
        FROM wishes w
        JOIN users u ON w.wisher_id = u.user_id
        JOIN categories c ON w.category_id = c.category_id
        WHERE w.status = 'Pending Review'
    `;
    try {
        const [wishes] = await db.query(sql);
        const decryptedWishes = wishes.map(wish => ({
            ...wish,
            shipping_address: wish.shipping_address ? decrypt(wish.shipping_address) : null 
        }));
        res.status(200).json(decryptedWishes);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching admin list.' });
    }
};

export const approveWish = async (req, res) => {
    const { id } = req.params;
    const { isWisherVerified } = req.body; 

    if (!isWisherVerified) return res.status(400).json({ message: 'Verification required.' });

    try {
        const [result] = await db.query("UPDATE wishes SET status = 'Live' WHERE wish_id = ? AND status = 'Pending Review'", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Wish not found.' });
        res.status(200).json({ message: 'Wish approved.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during approval.' });
    }
};