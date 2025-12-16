// server/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { encrypt } = require('../utils/encryptionService'); // NEW IMPORT

// --- Helper function to generate JWT ---
const generateToken = (id) => {
    // Uses the JWT_SECRET from the .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user (Wisher or Donor)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { email, password, user_type, display_name, real_name, shipping_address } = req.body; // Add shipping_address
    // ... (validation and hashing) ...

    // --- ENCRYPTION STEP ---
    const encryptedAddress = shipping_address ? encrypt(shipping_address) : null;
    // -----------------------

    const sql = `
        INSERT INTO users 
        (email, password_hash, user_type, display_name, real_name, shipping_address, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const now = new Date();

    try {
        const [result] = await db.query(sql, [
            email, 
            password_hash, 
            user_type, 
            display_name, 
            real_name || null,
            encryptedAddress, // USE ENCRYPTED ADDRESS
            now 
        ]);

        const newUser = {
            id: result.insertId,
            email,
            user_type,
            token: generateToken(result.insertId),
        };
        
        res.status(201).json(newUser);

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user by email
    const sql = 'SELECT user_id, email, password_hash, user_type, is_verified FROM users WHERE email = ?';
    try {
        const [rows] = await db.query(sql, [email]);
        const user = rows[0];

        // 2. Check if user exists and password matches
        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                id: user.user_id,
                email: user.email,
                user_type: user.user_type,
                is_verified: user.is_verified,
                token: generateToken(user.user_id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
const validateToken = async (req, res) => {
    // The 'protect' middleware already verified the token and added req.user
    const user_id = req.user.user_id;

    try {
        const [users] = await db.query(
            `SELECT 
                user_id, 
                email, 
                user_type, 
                display_name, 
                real_name, 
                is_verified, 
                created_at 
             FROM users 
             WHERE user_id = ?`, 
             [user_id]
        );

        if (users.length === 0) {
            // This should not happen if the token is valid, but good for safety
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user data needed for the frontend state
        res.status(200).json(users[0]);

    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({ message: 'Server error during validation.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    validateToken, // EXPORT NEW FUNCTION
};
