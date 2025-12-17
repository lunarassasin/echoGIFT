// server/controllers/donorController.js

// FIXED: Use import instead of require for ES Modules
import { db } from '../config/db.js'; 

/**
 * @desc    Get all open wishes available for funding by a Donor
 * @route   GET /api/donor/wishes/open
 * @access  Private/Donor
 */
export const getOpenWishes = async (req, res) => {

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


        const openWishes = results.map(wish => ({
            id: wish.wish_id,
            title: wish.title,
            wisher: wish.wisher_name, 
            amount: wish.cost_estimate - wish.amount_funded, 
            status: wish.status,

        }));
        

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
    // req.user is populated by your protect middleware
    const donor_id = req.user.user_id;


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


        const historyData = results.map(txn => ({
            id: txn.transaction_id,
            wishTitle: txn.wishTitle,
            wisher: txn.wisher,
            date: txn.completed_at,
            amount: txn.amount,
        }));
        
        
        res.status(200).json({ 
            message: 'Fulfillment history fetched successfully.',
            data: historyData 
        });

    } catch (error) {
        console.error('Error fetching donor history from DB:', error);
        res.status(500).json({ message: 'Server error retrieving history.', error: error.message });
    }
};