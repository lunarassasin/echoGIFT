// server/controllers/donorController.js

// Using the same database connection structure as WishController.js
const { db } = require('../config/db'); 

/**
 * @desc    Get all open wishes available for funding by a Donor
 * @route   GET /api/donor/wishes/open
 * @access  Private/Donor
 */
export const getOpenWishes = async (req, res) => {
    // 1. Define the SQL Query: Fetches wishes that are 'Live' or 'Open'
    // Joins wishes with the wisher's name and category name.
    const sql = `
        SELECT
            w.wish_id,
            w.title,
            w.cost_estimate,
            w.amount_funded,
            w.created_at,
            w.status,
            c.category_name,
            u.display_name AS wisher_name
        FROM wishes w
        JOIN users u ON w.wisher_id = u.user_id
        JOIN categories c ON w.category_id = c.category_id
        WHERE w.status = 'Live' OR w.status = 'Open'
        ORDER BY w.created_at DESC
    `;

    try {
        const [results] = await db.query(sql);
        
        // Map the results to the format expected by the frontend's DonorDashboardPage
        const openWishes = results.map(wish => ({
            id: wish.wish_id,
            title: wish.title,
            wisher: wish.wisher_name, // Matches the 'wisher' field in the frontend code
            amount: wish.cost_estimate - wish.amount_funded, // Show remaining amount needed
            status: wish.status,
            // Include other data as needed
        }));
        
        // Sends data in the expected format { data: [...] }
        res.status(200).json({ 
            message: 'Open wishes fetched successfully.',
            data: openWishes 
        });

    } catch (error) {
        console.error('Error fetching open wishes from DB:', error);
        res.status(500).json({ message: 'Server error retrieving wishes.', error: error.message });
    }
};

/**
 * @desc    Get the authenticated Donor's fulfillment history (past transactions)
 * @route   GET /api/donor/history
 * @access  Private/Donor
 */
export const getFulfillmentHistory = async (req, res) => {
    // Get the donor's ID from the authenticated user token
    const donor_id = req.user.user_id;

    // Joins transactions with the wish and the wisher's display name.
    const sql = `
        SELECT
            t.transaction_id,
            t.amount,
            t.completed_at,
            w.title AS wishTitle,
            u.display_name AS wisher
        FROM transactions t
        JOIN wishes w ON t.wish_id = w.wish_id
        JOIN users u ON w.wisher_id = u.user_id
        WHERE t.donor_id = ? AND t.status = 'Complete'
        ORDER BY t.completed_at DESC;
    `;

    try {
        const [results] = await db.query(sql, [donor_id]);

        // Map the results to the format expected by the frontend's DonorDashboardPage
        const historyData = results.map(txn => ({
            id: txn.transaction_id,
            wishTitle: txn.wishTitle,
            wisher: txn.wisher,
            date: txn.completed_at,
            amount: txn.amount,
        }));
        
        // Sends data in the expected format { data: [...] }
        res.status(200).json({ 
            message: 'Fulfillment history fetched successfully.',
            data: historyData 
        });

    } catch (error) {
        console.error('Error fetching donor history from DB:', error);
        res.status(500).json({ message: 'Server error retrieving history.', error: error.message });
    }
};