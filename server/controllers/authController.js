// server/controllers/authController.js
import bcrypt from 'bcryptjs'; // Using bcryptjs for better compatibility
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { encrypt } from '../utils/encryptionService.js';

const generateToken = (id) => {
    
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    const { email, password, user_type, display_name, real_name, shipping_address } = req.body;
    
    try {
        const password_hash = await bcrypt.hash(password, 10);
        const encryptedAddress = shipping_address ? encrypt(shipping_address) : null;

        const sql = `
            INSERT INTO users 
            (email, password_hash, user_type, display_name, real_name, shipping_address, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(sql, [
            email, 
            password_hash, 
            user_type, 
            display_name, 
            real_name || null,
            encryptedAddress,
            new Date() 
        ]);

        res.status(201).json({
            id: result.insertId,
            email,
            user_type,
            token: generateToken(result.insertId),
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT user_id, email, password_hash, user_type, is_verified FROM users WHERE email = ?';
    
    try {
        const [rows] = await db.query(sql, [email]);
        const user = rows[0];


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

export const validateToken = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const [users] = await db.query(
            'SELECT user_id, email, user_type, display_name, real_name, is_verified, created_at FROM users WHERE user_id = ?', 
             [user_id]
        );
        if (users.length === 0) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json(users[0]);

    } catch (error) {

        res.status(500).json({ message: 'Server error during validation.' });
    }
};


