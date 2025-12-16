// client/src/components/Wisher/WishSubmissionForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const WishSubmissionForm = ({ onWishSubmitted }) => {
    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        story: '',
        cost_estimate: '',
        item_url: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch categories for the dropdown menu
        const fetchCategories = async () => {
            try {
                // Assuming we add a public endpoint: GET /api/categories
                const response = await api.get('/categories'); 
                setCategories(response.data);
                // Set default category to the first one fetched
                if (response.data.length > 0) {
                    setFormData(f => ({ ...f, category_id: response.data[0].category_id }));
                }
            } catch (err) {
                console.error("Could not fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/wishes', formData);
            
            setSuccess(response.data.message);
            // Reset form fields
            setFormData({
                category_id: categories[0]?.category_id || '',
                title: '',
                story: '',
                cost_estimate: '',
                item_url: '',
            });
            
            // Notify the parent component (dashboard) to refresh the wish list
            if (onWishSubmitted) {
                onWishSubmitted();
            }

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to submit wish. Check verification status.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };
    
    // 

    return (
        <form onSubmit={onSubmit} className="p-6 bg-white border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Submit Your Wish</h2>

            {error && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded">{error}</p>}
            {success && <p className="text-green-600 mb-4 bg-green-100 p-3 rounded">{success}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Dropdown */}
                <div className="mb-4">
                    <label htmlFor="category_id" className="block text-gray-700 font-semibold mb-1">Category</label>
                    <select name="category_id" value={formData.category_id} onChange={onChange} required
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {categories.map(cat => (
                            <option key={cat.category_id} value={cat.category_id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-semibold mb-1">Wish Title (e.g., New Laptop for Studies)</label>
                    <input type="text" name="title" value={formData.title} onChange={onChange} required maxLength="255"
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Cost Estimate */}
                <div className="mb-4">
                    <label htmlFor="cost_estimate" className="block text-gray-700 font-semibold mb-1">Estimated Cost (USD)</label>
                    <input type="number" name="cost_estimate" value={formData.cost_estimate} onChange={onChange} required min="1.00" step="0.01"
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Item URL */}
                <div className="mb-4">
                    <label htmlFor="item_url" className="block text-gray-700 font-semibold mb-1">Direct Link (Amazon, retailer, etc.)</label>
                    <input type="url" name="item_url" value={formData.item_url} onChange={onChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            
            {/* Story/Reason */}
            <div className="mb-6">
                <label htmlFor="story" className="block text-gray-700 font-semibold mb-1">Your Story / Reason for the Wish (Be authentic)</label>
                <textarea name="story" value={formData.story} onChange={onChange} required rows="6"
                    className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
            </div>

            <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-150 font-bold disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Post Wish for Review'}
            </button>
        </form>
    );
};

export default WishSubmissionForm;