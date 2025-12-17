// server/controllers/webhookController.js
import Stripe from 'stripe';
import { db } from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Metadata coming from our Payment Controller
        const { wish_id, donor_id } = session.metadata;

        if (session.payment_status === 'paid') {
            try {
                // 1. INSERT a new record into transactions
                // This records the specific payment event
                await db.query(
                    `INSERT INTO transactions 
                    (donor_id, wish_id, amount, status, payment_gateway_id, completed_at) 
                    VALUES (?, ?, ?, 'Paid', ?, NOW())`,
                    [donor_id, wish_id, session.amount_total / 100, session.id]
                );

                // 2. UPDATE the wish status
                // We change it to 'Fulfilled' (or 'Funding' based on your logic)
                await db.query(
                    "UPDATE wishes SET status = 'Fulfilled', donor_id = ? WHERE wish_id = ?",
                    [donor_id, wish_id]
                );

                console.log(`✅ Wish ${wish_id} successfully fulfilled by Donor ${donor_id}`);

            } catch (dbError) {
                console.error('❌ Database update failed:', dbError);
                return res.status(500).send('Database Update Failed');
            }
        }
    } 
    res.json({ received: true });
};