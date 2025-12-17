// server/controllers/webhookController.js
import Stripe from 'stripe';
import { db } from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // req.body is raw here due to server.js configuration
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { wish_id, transaction_id, donor_id } = session.metadata;

        if (session.payment_status === 'paid') {
            try {
                await db.query(
                    "UPDATE transactions SET status = 'Paid', payment_gateway_id = ? WHERE transaction_id = ?",
                    [session.id, transaction_id]
                );

                await db.query(
                    "UPDATE wishes SET status = 'Funding', donor_id = ? WHERE wish_id = ? AND status = 'Live'",
                    [donor_id, wish_id]
                );
            } catch (dbError) {
                console.error('Database update failed:', dbError);
                return res.status(500).send('Database Update Failed');
            }
        }
    } 
    res.json({ received: true });
};