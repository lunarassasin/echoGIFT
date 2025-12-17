// client/src/components/Donor/OpenWishList.jsx
import React, { useState } from 'react';
import api from '../../api/api';

const OpenWishList = ({ wishes }) => {
    const [processingId, setProcessingId] = useState(null);

    const handleFulfillment = async (wish) => {
        setProcessingId(wish.id);
        try {
            // 1. Call your backend to create a Stripe Checkout Session
            // We pass the wishId so the server knows which wish to update later
            const response = await api.post('/payments/create-checkout-session', {
                wishId: wish.id,
                amount: wish.amount, // Or wish.cost_estimate
                wishTitle: wish.title
            });

            // 2. Redirect the user to the Stripe Checkout URL provided by your backend
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Could not initiate payment. Please try again later.");
        } finally {
            setProcessingId(null);
        }
    };

    if (!wishes || wishes.length === 0) {
        return <p className="text-gray-500 italic">No open wishes are currently available for fulfillment. Check back soon!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishes.map((wish) => (
                <div key={wish.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{wish.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Wisher: **{wish.display_name || 'Anonymous'}**</p>
                    
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-green-600">
                            {/* Note: Ensure the field name matches your database (cost_estimate or amount) */}
                            ${(wish.cost_estimate || wish.amount || 0).toFixed(2)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            wish.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                            {wish.status}
                        </span>
                    </div>

                    <button 
                        onClick={() => handleFulfillment(wish)}
                        disabled={processingId === wish.id}
                        className={`w-full mt-2 py-2 text-white font-semibold rounded-lg transition duration-300 ${
                            processingId === wish.id 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {processingId === wish.id ? 'Connecting to Stripe...' : 'Fulfill Wish'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default OpenWishList;