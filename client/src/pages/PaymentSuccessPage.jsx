// client/src/pages/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';

const PaymentSuccessPage = () => {
    // Get query parameters (session_id, txn_id, wish_id) from the URL
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const transactionId = searchParams.get('txn_id');
    const wishId = searchParams.get('wish_id');

    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Confirming payment success with Stripe...');

    useEffect(() => {
        // This client-side call is optional but provides immediate feedback.
        // The *real* database update happens securely via the webhook (Phase 21).
        const verifyPayment = async () => {
            if (!sessionId || !transactionId || !wishId) {
                setStatus('error');
                setMessage('Error: Missing required payment verification details.');
                return;
            }

            // Optional: Call a dedicated endpoint to check transaction status 
            // to provide faster user feedback than waiting for the webhook.
            // For now, we'll rely on the webhook and just display the success message.
            
            setStatus('success');
            setMessage('Your anonymous gift has been successfully processed! The wish status is being updated.');
        };

        verifyPayment();
    }, [sessionId, transactionId, wishId]);
    
    // 

    return (
        <div className="container mx-auto p-8 text-center bg-white rounded-xl shadow-2xl mt-10">
            {status === 'verifying' && (
                <>
                    <div className="text-3xl text-yellow-600 mb-4">⏳</div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Processing...</h1>
                </>
            )}
            {status === 'success' && (
                <>
                    <div className="text-7xl text-green-600 mb-4">✅</div>
                    <h1 className="text-4xl font-extrabold mb-4 text-green-700">Thank You, Anonymous Donor!</h1>
                </>
            )}
            {status === 'error' && (
                <>
                    <div className="text-7xl text-red-600 mb-4">❌</div>
                    <h1 className="text-4xl font-extrabold mb-4 text-red-700">Payment Issue</h1>
                </>
            )}
            
            <p className="text-xl text-gray-600 mb-6">{message}</p>
            
            <p className="text-gray-500 mb-6">
                Your contribution ensures that the recipient of Wish #{wishId} receives what they need. You will remain anonymous to the Wisher.
            </p>

            <a href="/donor/dashboard" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-150">
                Back to Dashboard
            </a>
        </div>
    );
};

export default PaymentSuccessPage;