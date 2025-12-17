import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    const { wishId, amount, wishTitle } = req.body;
    const donorId = req.user.user_id; // From your auth middleware

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Fulfilling Wish: ${wishTitle}`,
                            description: `Thank you for making a difference!`,
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            // Redirects after payment
            success_url: `${process.env.CLIENT_URL}/donor/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/donor/dashboard`,
            // Metadata is CRITICAL: It tells your Webhook WHICH wish to update
            metadata: {
                wish_id: wishId.toString(),
                donor_id: donorId.toString(),
                // Note: If you aren't pre-creating a transaction row, 
                // // you might need to adjust the webhook to create one instead of UPDATE
                transaction_id: `TXN_${Date.now()}` 
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ message: "Could not create payment session" });
    }
};