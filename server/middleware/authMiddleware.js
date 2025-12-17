// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js'; // Ensure the .js extension is present

/**
 * @desc Protects routes by validating the JWT and fetching user data.
 * 
 */
export const protect = async (req, res, next) => {
    let token;

    // 1. Check if token is present in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer token")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Fetch user from the database using the ID from the token
            // Note: Changed decoded.id to decoded.user_id to match common naming, 
            // check your login logic to see what key you used in jwt.sign()
            const sql = 'SELECT user_id, email, user_type, display_name, is_verified FROM users WHERE user_id = ?';
            const [rows] = await db.query(sql, [decoded.id || decoded.user_id]);
            const user = rows[0];

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            // 4. Attach user to the request object
            req.user = user;
            
            next();

        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
} else {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

/**
 * @desc Middleware to restrict access based on user type
 * @param {string[]} requiredTypes - Array of user types allowed (e.g., ['Wisher', 'Donor'])
 */
export const restrictTo = (requiredTypes) => (req, res, next) => {
    if (!req.user || !requiredTypes.includes(req.user.user_type)) {
        return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }
    next();
};

