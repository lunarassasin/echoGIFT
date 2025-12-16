// client/src/components/Donor/WishCard.jsx
import React from 'react';

const WishCard = ({ wish }) => {
    const formattedCost = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(wish.cost_estimate);

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
                <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-3">
                    {wish.category_name}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{wish.title}</h3>
                
                <p className="text-3xl font-extrabold text-green-600 mb-4">{formattedCost}</p>

                <p className="text-gray-600 text-sm italic">
                    Posted by: <span className="font-medium text-gray-800">{wish.wisher_display_name}</span>
                </p>

                <p className="text-gray-700 mt-4 text-sm leading-relaxed">{wish.story}</p>
                {/* Story is truncated by the controller, so we don't need to truncate here */}
            </div>

            <div className="p-6 bg-gray-50 border-t">
                <FulfillmentButton wishId={wish.wish_id} cost={wish.cost_estimate} />
            </div>
        </div>
    );
};

export default WishCard;