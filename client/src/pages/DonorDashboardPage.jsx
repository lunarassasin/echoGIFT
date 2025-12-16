// client/src/pages/DonorDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// Assuming you have an API service for fetching data
import { getOpenWishes, getDonorFulfillmentHistory } from '../api/donorApi'; 

// Components to display the lists (you would create these next)
import OpenWishList from '../components/Donor/OpenWishList'; 
import FulfillmentHistory from '../components/Donor/FulfillmentHistory'; 

const DonorDashboardPage = () => {
    const { user } = useAuth(); // Access the current donor user object
    
    // State for managing the fetched data
    const [openWishes, setOpenWishes] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to toggle between the two main views
    const [currentView, setCurrentView] = useState('openWishes'); // 'openWishes' or 'history'

    useEffect(() => {
        const fetchDonorData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch data for the Donor Dashboard
                const [wishesResponse, historyResponse] = await Promise.all([
                    getOpenWishes(), // Fetches wishes available for donation/fulfillment
                    getDonorFulfillmentHistory(user.user_id), // Fetches what this donor has fulfilled
                ]);

                setOpenWishes(wishesResponse.data || []);
                setHistory(historyResponse.data || []);

            } catch (err) {
                console.error("Failed to fetch donor data:", err);
                setError("Could not load dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        // Only fetch data if the user object is available (i.e., not loading)
        if (user) {
            fetchDonorData();
        }
    }, [user]); // Re-run effect if the user object changes (though it shouldn't once set)

    if (loading) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl text-gray-600">Loading Donor Dashboard...</h2>
                {/* Add a loading spinner here */}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 text-red-600 border border-red-300 bg-red-50 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    // --- RENDER COMPONENT ---
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-2">
                Donor Dashboard
            </h1>

            {/* View Toggler / Navigation */}
            <div className="flex space-x-4 mb-8 border-b-2">
                <button
                    onClick={() => setCurrentView('openWishes')}
                    className={`px-4 py-2 text-lg font-semibold transition duration-200 ${
                        currentView === 'openWishes' 
                            ? 'text-blue-600 border-b-4 border-blue-600' 
                            : 'text-gray-600 hover:text-blue-500'
                    }`}
                >
                    Open Wishes ({openWishes.length})
                </button>
                <button
                    onClick={() => setCurrentView('history')}
                    className={`px-4 py-2 text-lg font-semibold transition duration-200 ${
                        currentView === 'history' 
                            ? 'text-blue-600 border-b-4 border-blue-600' 
                            : 'text-gray-600 hover:text-blue-500'
                    }`}
                >
                    Fulfillment History ({history.length})
                </button>
            </div>

            {/* Conditional Rendering of the Main Content */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {currentView === 'openWishes' && (
                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Wishes to Fulfill</h2>
                        {openWishes.length > 0 ? (
                            <OpenWishList wishes={openWishes} />
                        ) : (
                            <p className="text-gray-500">No open wishes are available for fulfillment right now. Check back later!</p>
                        )}
                    </section>
                )}

                {currentView === 'history' && (
                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Your Fulfillment History</h2>
                        {history.length > 0 ? (
                            <FulfillmentHistory history={history} />
                        ) : (
                            <p className="text-gray-500">You haven't fulfilled any wishes yet!</p>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};

export default DonorDashboardPage;