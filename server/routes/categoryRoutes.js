// server/routes/categoryRoutes.js (New File)
const express = require('express');
const { db } = require('../config/db');

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

module.exports = router;
// (Don't forget to add app.use('/api/categories', require('./routes/categoryRoutes')); to server.js)