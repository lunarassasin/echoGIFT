// server/routes/categoryRoutes.js
import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT category_id, category_name FROM categories ORDER BY category_name');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching categories.' });
    }
});

export default router;