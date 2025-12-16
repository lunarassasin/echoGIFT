// client/src/components/Donor/FulfillmentButton.jsx
import React, { useState } from 'react';
import api from '../../api/api';
// Stripe.js library is loaded client-side for redirection
import { loadStripe } from '@stripe/stripe-js';

// IMPORTANT: Use your public key here (fetch from .env in a real React app)
const stripePromise = loadStripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY'); 
// For this example, replace the string above with a placeholder to be secured later.

const FulfillmentButton = ({ wishId, cost }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFulfill = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Call your backend to create the Stripe Checkout Session
            const response = await api.post(`/wishes/${wishId}/fund`);
            const { sessionId } = response.data;
            
            if (!sessionId) {
                throw new Error("Failed to get payment session ID from server.");
            }

            // 2. Load Stripe instance
            const stripe = await stripePromise;
            
            // 3. Redirect the user to the Stripe Checkout page
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                // This happens if the user's browser fails to redirect
                setError(result.error.message);
            }
        } catch (err) {
            console.error('Funding error:', err);
            setError(err.response?.data?.message || 'Error initiating payment. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            {error && <p className="text-sm text-red-600 mb-2">Error: {error}</p>}
            <button 
                onClick={handleFulfill}
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
            >
                {loading ? 'Redirecting to Checkout...' : `Fulfill This Wish for $${cost.toFixed(2)}`}
            </button>
        </div>
    );
};

export default FulfillmentButton;