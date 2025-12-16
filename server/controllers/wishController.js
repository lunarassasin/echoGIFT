// server/controllers/wishController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../config/db');

// @desc    Wisher submits a new wish
// @route   POST /api/wishes
// @access  Private/Wisher
const createWish = async (req, res) => {
    // req.user is available because of the 'protect' middleware
    const wisher_id = req.user.user_id; 
    
    // Additional security check: Wisher must be verified to post a wish (Phase 8 logic)
    if (req.user.user_type === 'Wisher' && req.user.is_verified === 0) {
        return res.status(403).json({ message: 'Forbidden. You must complete the verification process before posting a wish.' });
    }

    const { category_id, title, story, cost_estimate, item_url } = req.body;
    
    // Minimal validation
    if (!category_id || !title || !story || !cost_estimate) {
        return res.status(400).json({ message: 'Please include all required wish details.' });
    }

    const sql = `
        INSERT INTO wishes 
        (wisher_id, category_id, title, story, cost_estimate, item_url) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        await db.query(sql, [
            wisher_id, 
            category_id, 
            title, 
            story, 
            cost_estimate, 
            item_url || null
        ]);
        
        res.status(201).json({ message: 'Wish submitted successfully. It is now Pending Review.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating wish.' });
    }
};

// @desc    Get all live wishes available for funding
// @route   GET /api/wishes/live
// @access  Private/Donor
const getLiveWishes = async (req, res) => {
    // SQL joins the wishes table with the users (Wisher) table and categories table
    const sql = `
        SELECT
            w.wish_id,
            w.title,
            w.story,
            w.cost_estimate,
            w.created_at,
            c.category_name,
            u.display_name AS wisher_display_name
        FROM wishes w
        JOIN users u ON w.wisher_id = u.user_id
        JOIN categories c ON w.category_id = c.category_id
        WHERE w.status = 'Live'
        ORDER BY w.created_at DESC
    `;

    try {
        const [wishes] = await db.query(sql);
        
        // Ensure no sensitive data (like real_name or address) is accidentally leaked
        const safeWishes = wishes.map(wish => ({
            ...wish,
            story: wish.story.substring(0, 150) + '...', // Truncate story for card view
        }));
        
        res.status(200).json(safeWishes);

    } catch (error) {
        console.error('Error fetching live wishes:', error);
        res.status(500).json({ message: 'Server error while fetching wishes.' });
    }
};

// @desc    Get all wishes posted by the authenticated Wisher
// @route   GET /api/wishes/me
// @access  Private/Wisher
const getMyWishes = async (req, res) => {
    // req.user is available and contains the user_id of the authenticated Wisher
    const wisher_id = req.user.user_id;

    const sql = `
        SELECT
            w.wish_id,
            w.title,
            w.story,
            w.cost_estimate,
            w.status,
            w.created_at,
            w.fulfilled_at,
            c.category_name
        FROM wishes w
        JOIN categories c ON w.category_id = c.category_id
        WHERE w.wisher_id = ?
        ORDER BY w.created_at DESC
    `;

    try {
        const [wishes] = await db.query(sql, [wisher_id]);

        res.status(200).json(wishes);

    } catch (error) {
        console.error('Error fetching wisher\'s wishes:', error);
        res.status(500).json({ message: 'Server error while fetching your wishes.' });
    }
};
// @desc    Initiate payment/funding for a wish and create a Stripe Checkout Session
// @route   POST /api/wishes/:id/fund
// @access  Private/Donor
const initiateFunding = async (req, res) => {
    const { id } = req.params; // wish_id
    const donor_id = req.user.user_id;

    if (!id) {
        return res.status(400).json({ message: 'Wish ID is required.' });
    }

    try {
        // 1. Fetch Wish Details
        const [wishRows] = await db.query(
            'SELECT title, cost_estimate, status, wisher_id FROM wishes WHERE wish_id = ? AND status = ?',
            [id, 'Live']
        );
        const wish = wishRows[0];

        if (!wish) {
            return res.status(404).json({ message: 'Wish not found or not available for funding.' });
        }

        const amountInCents = Math.round(wish.cost_estimate * 100);

        // 2. Create Transaction Record (Status: Pending)
        // Note: created_at must be manually inserted (as per strict MySQL constraints)
        const [txnResult] = await db.query(
            `INSERT INTO transactions 
             (wish_id, donor_id, amount, status, created_at) 
             VALUES (?, ?, ?, ?, ?)`,
            [id, donor_id, wish.cost_estimate, 'Pending', new Date()]
        );
        const transaction_id = txnResult.insertId;


        // 3. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Fulfillment of: ${wish.title}`,
                        // Optional: description: `Gift for ${wish.wisher_display_name}`
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            }],
            mode: 'payment',
            // Success URL uses the transaction ID and wish ID for lookup after payment
            success_url: `${req.protocol}://${req.get('host')}/donor/success?session_id={CHECKOUT_SESSION_ID}&txn_id=${transaction_id}&wish_id=${id}`,
            // Cancel URL returns the donor to the funding page
            cancel_url: `${req.protocol}://${req.get('host')}/donor/wish/${id}`,
            // Pass custom data to the webhook via metadata (CRUCIAL for anonymity)
            metadata: {
                wish_id: id,
                donor_id: donor_id,
                transaction_id: transaction_id,
            },
        });

        // 4. Return Session ID to Frontend
        res.status(200).json({ sessionId: session.id });

    } catch (error) {
        console.error('Stripe funding initiation error:', error);
        res.status(500).json({ message: 'Failed to initiate payment. Please try again.' });
    }
};

// ... (Other wish controller functions will go here)

module.exports = {
    createWish,
    getLiveWishes,
    getMyWishes,
    initiateFunding, // EXPORT NEW FUNCTION
};



