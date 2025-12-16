// server/controllers/webhookController.js (New File)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../config/db');

// @desc    Handles incoming Stripe events (payment successful, etc.)
// @route   POST /api/webhooks/stripe
// @access  Public (Stripe's server)
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    // 1. Verify Event Signature (Security Check)
    try {
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET // Set this in your .env file
        );
    } catch (err) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 2. Handle the specific event type
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Extract crucial metadata passed during initiation
        const { wish_id, transaction_id } = session.metadata;

        // Ensure the payment was successful and the status is 'paid'
        if (session.payment_status === 'paid') {
            console.log(`✅ Payment successful for Wish ID: ${wish_id}`);

            try {
                // A. Update the Transaction Record
                await db.query(
                    `UPDATE transactions 
                     SET status = 'Paid', payment_gateway_id = ? 
                     WHERE transaction_id = ? AND status = 'Pending'`,
                    [session.id, transaction_id]
                );

                // B. Update the Wish Status
                // Move the wish from 'Live' to 'Funding' to prevent double-funding
                await db.query(
                    `UPDATE wishes 
                     SET status = 'Funding', donor_id = ? 
                     WHERE wish_id = ? AND status = 'Live'`,
                    [session.metadata.donor_id, wish_id]
                );

                // C. Log Action and Trigger Fulfillment System
                // --- THIS IS WHERE THE ADMIN/PLATFORM ALERT GOES ---
                console.log(`🔔 WISH ${wish_id} IS NOW FUNDED. ADMIN ACTION REQUIRED FOR PURCHASE AND DELIVERY.`);
                // In a real app, this would queue a task or send an admin email.

            } catch (dbError) {
                console.error('Database update failed after successful payment:', dbError);
                // Important: Return 500 to tell Stripe to retry the webhook later
                return res.status(500).send('Database Update Failed');
            }
        }
    } 
    
    // 3. Acknowledge Receipt
    res.json({ received: true });
};

module.exports = { handleStripeWebhook };