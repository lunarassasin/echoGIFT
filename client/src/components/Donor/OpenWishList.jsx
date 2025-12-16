// client/src/components/Donor/OpenWishList.jsx

import React from 'react';

const OpenWishList = ({ wishes }) => {
    if (!wishes || wishes.length === 0) {
        return <p className="text-gray-500 italic">No open wishes are currently available for fulfillment. Check back soon!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishes.map((wish) => (
                <div key={wish.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{wish.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Wisher: **{wish.wisher}**</p>
                    
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-green-600">
                            ${wish.amount.toFixed(2)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            wish.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                            {wish.status}
                        </span>
                    </div>

                    {/* Placeholder for the fulfillment button */}
                    <button 
                        // TODO: Implement fulfillment logic and navigation to checkout/payment page
                        onClick={() => alert(`Initiating fulfillment for: ${wish.title}`)}
                        className="w-full mt-2 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Fulfill Wish
                    </button>
                </div>
            ))}
        </div>
    );
};

export default OpenWishList;