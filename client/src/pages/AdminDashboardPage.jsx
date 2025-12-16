// client/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AdminDashboardPage = () => {
    const [pendingWishes, setPendingWishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingWishes = async () => {
        setLoading(true);
        try {
            // This relies on the Admin user being logged in and token being sent
            const response = await api.get('/admin/wishes/pending');
            setPendingWishes(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load pending wishes. Ensure you are logged in as Admin.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingWishes();
    }, []);

    const handleApprove = async (wishId, wisherId) => {
        // NOTE: In a real scenario, you'd confirm identity/address externally first.
        const confirmed = window.confirm(`Are you sure you want to APPROVE Wish #${wishId}? This confirms Wisher #${wisherId} is verified.`);
        if (!confirmed) return;

        try {
            await api.put(`/admin/wishes/${wishId}/approve`, { isWisherVerified: true });
            alert(`Wish #${wishId} approved and set to LIVE!`);
            fetchPendingWishes(); // Refresh the list
        } catch (err) {
            alert(`Approval failed: ${err.response?.data?.message || 'Server error.'}`);
        }
    };

    if (loading) return <div className="text-center p-8">Loading Admin Data...</div>;
    if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-extrabold mb-8 text-red-700">Administrator Vetting Dashboard</h1>
            
            <h2 className="text-2xl font-bold mb-4">Wishes Pending Review ({pendingWishes.length})</h2>

            {pendingWishes.length === 0 ? (
                <p className="p-4 bg-green-100 rounded-md text-green-800">No wishes are currently pending review. Great work!</p>
            ) : (
                <div className="space-y-4">
                    {pendingWishes.map(wish => (
                        <div key={wish.wish_id} className="p-5 border rounded-lg shadow-sm bg-white">
                            <h3 className="text-xl font-bold text-gray-800">Wish: {wish.title} (ID: {wish.wish_id})</h3>
                            <p className="text-sm text-gray-500 mb-3">Category: {wish.category_name} | Cost: ${wish.cost_estimate}</p>
                            
                            <div className="mt-4 p-3 border-l-4 border-yellow-500 bg-yellow-50 mb-4">
                                <p className="font-semibold text-gray-700">Wisher Details (Decrypted for Fulfillment):</p>
                                <p className="text-sm">Real Name: {wish.real_name}</p>
                                <p className="text-sm">Address: {wish.shipping_address}</p>
                                <p className="text-sm">Status: {wish.is_verified ? 'Verified' : '🔴 PENDING VERIFICATION'}</p>
                            </div>

                            <button
                                onClick={() => handleApprove(wish.wish_id, wish.wisher_id)}
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-bold"
                            >
                                ✅ Approve & Set LIVE
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;