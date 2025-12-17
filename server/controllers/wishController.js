// server/controllers/wishController.js
import Stripe from 'stripe';
import { db } from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createWish = async (req, res) => {
    const wisher_id = req.user.user_id; 
    if (req.user.user_type === 'Wisher' && req.user.is_verified === 0) {
        return res.status(403).json({ message: 'Verification required to post.' });
    }

    const { category_id, title, story, cost_estimate, item_url } = req.body;
    const sql = `INSERT INTO wishes (wisher_id, category_id, title, story, cost_estimate, item_url) VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        await db.query(sql, [wisher_id, category_id, title, story, cost_estimate, item_url || null]);
        res.status(201).json({ message: 'Wish submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating wish.' });
    }
};

export const getLiveWishes = async (req, res) => {
    const sql = `
        SELECT w.wish_id, w.title, w.story, w.cost_estimate, w.created_at, c.category_name, u.display_name AS wisher_display_name
        FROM wishes w
        JOIN users u ON w.wisher_id = u.user_id
        JOIN categories c ON w.category_id = c.category_id
        WHERE w.status = 'Live'
        ORDER BY w.created_at DESC
    `;
    try {
        const [wishes] = await db.query(sql);
        const safeWishes = wishes.map(wish => ({ ...wish, story: wish.story.substring(0, 150) + '...' }));
        res.status(200).json(safeWishes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishes.' });
    }
};

export const getMyWishes = async (req, res) => {
    const wisher_id = req.user.user_id;
    const sql = `
        SELECT w.wish_id, w.title, w.story, w.cost_estimate, w.status, w.created_at, c.category_name
        FROM wishes w
        JOIN categories c ON w.category_id = c.category_id
        WHERE w.wisher_id = ?
    `;
    try {
        const [wishes] = await db.query(sql, [wisher_id]);
        res.status(200).json(wishes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your wishes.' });
    }
};

export const initiateFunding = async (req, res) => {
    const { id } = req.params;
    const donor_id = req.user.user_id;

    try {
        const [wishRows] = await db.query('SELECT title, cost_estimate FROM wishes WHERE wish_id = ? AND status = "Live"', [id]);
        const wish = wishRows[0];
        if (!wish) return res.status(404).json({ message: 'Wish not available.' });

        const [txnResult] = await db.query(
            "INSERT INTO transactions (wish_id, donor_id, amount, status, created_at) VALUES (?, ?, ?, ?, ?)",
            [id, donor_id, wish.cost_estimate, 'Pending', new Date()]
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: `Fulfillment of: ${wish.title}` },
                    unit_amount: Math.round(wish.cost_estimate * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/donor/success?session_id={CHECKOUT_SESSION_ID}&txn_id=${txnResult.insertId}&wish_id=${id}`,
            cancel_url: `${req.protocol}://${req.get('host')}/donor/wish/${id}`,
            metadata: { wish_id: id, donor_id: donor_id, transaction_id: txnResult.insertId },
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ message: 'Payment initiation failed.' });
    }
};