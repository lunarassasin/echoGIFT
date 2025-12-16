// client/src/components/Wisher/WisherWishList.jsx
import React from 'react';

const getStatusColor = (status) => {
    switch (status) {
        case 'Live':
            return 'bg-green-100 text-green-800';
        case 'Funding':
            return 'bg-blue-100 text-blue-800'; // Currently being fulfilled
        case 'Fulfilled':
            return 'bg-purple-100 text-purple-800';
        case 'Pending Review':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const WisherWishList = ({ wishes }) => {
    if (wishes.length === 0) {
        return <p className="p-4 bg-gray-50 rounded-lg text-gray-600">You have not submitted any wishes yet. Post one using the form on the left!</p>;
    }

    return (
        <div className="space-y-4">
            {wishes.map((wish) => (
                <div key={wish.wish_id} className="p-5 border border-gray-200 rounded-lg shadow-md bg-white">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{wish.title}</h3>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(wish.status)}`}>
                            {wish.status}
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">
                        Posted: {new Date(wish.created_at).toLocaleDateString()}
                        <span className="ml-4">Category: {wish.category_name}</span>
                    </p>

                    <p className="text-2xl font-bold text-indigo-600 mb-4">
                        Cost Estimate: ${wish.cost_estimate}
                    </p>

                    <p className="text-gray-700 text-sm">
                        {wish.story.substring(0, 150)}{wish.story.length > 150 ? '...' : ''}
                    </p>

                    {wish.status === 'Fulfilled' && (
                        <p className="mt-3 text-sm text-purple-600 font-medium">
                            🎉 Your wish has been successfully delivered!
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default WisherWishList;