// client/src/components/Donor/WishBrowser.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import WishCard from './WishCard'; // Component to display individual wish

const WishBrowser = () => {
    const [wishes, setWishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishes = async () => {
            try {
                // Uses the interceptor to automatically add the Bearer token
                const response = await api.get('/wishes/live');
                setWishes(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load available wishes. Please ensure you are logged in as a Donor.');
            } finally {
                setLoading(false);
            }
        };

        fetchWishes();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading wishes...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }
    
    // 

    return (
        <div className="p-4">
            <h1 className="text-4xl font-extrabold mb-8 text-indigo-700">Wishes Ready for Fulfillment</h1>
            
            {/* Future: Filter and Search Bar */}
            <div className="mb-8 p-4 bg-gray-50 border rounded-lg">
                <p className="text-gray-600">Filter options (Category, Price Range) will be added here.</p>
            </div>

            {wishes.length === 0 ? (
                <p className="text-center text-xl text-gray-500">No wishes are currently live. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishes.map(wish => (
                        <WishCard key={wish.wish_id} wish={wish} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishBrowser;