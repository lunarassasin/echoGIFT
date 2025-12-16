// client/src/pages/WisherDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import WishSubmissionForm from '../components/Wisher/WishSubmissionForm';
import WisherWishList from '../components/Wisher/WisherWishList'; 

const WisherDashboardPage = () => {
    const { user } = useAuth();
    const [wishes, setWishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch the Wisher's wishes (called via GET /api/wishes/me)
    const fetchWishes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/wishes/me');
            setWishes(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load your submitted wishes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWishes();
    }, [fetchWishes]);
    
    // 

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
                Welcome, {user?.display_name || 'Wisher'}
            </h1>

            {/* Verification Alert: Crucial notification for the Wisher */}
            {user && !user.is_verified && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Verification Pending</p>
                    <p>Your account is not yet verified. Your wish status will remain 'Pending Review' until verification is complete.</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Wish Submission Form */}
                <div className="lg:col-span-1">
                    {/* onWishSubmitted refreshes the list after a successful submission */}
                    <WishSubmissionForm onWishSubmitted={fetchWishes} /> 
                </div>
                
                {/* Column 2/3: Status and History */}
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold mb-4 text-indigo-700">Your Wish History</h2>
                    {loading ? (
                        <p>Loading wishes...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <WisherWishList wishes={wishes} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default WisherDashboardPage;