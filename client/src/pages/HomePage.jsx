// client/src/pages/HomePage.jsx

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const HomePage = () => {
    const { user, loading } = useAuth(); // Get user state and loading status
    const navigate = useNavigate();

    // Helper to determine the dashboard path based on user role
    const getDashboardPath = () => {
        if (!user || !user.user_type) return '/'; // Should not happen if logged in
        
        switch (user.user_type) {
            case 'Wisher':
                return '/wisher/dashboard';
            case 'Donor':
                return '/donor/dashboard';
            case 'Admin':
                return '/admin/dashboard';
            default:
                return '/'; 
        }
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-xl text-gray-500">Loading application...</p>
                {/* A spinner component should go here */}
            </div>
        );
    }

    // --- RENDER LOGIC ---

    // 1. Logged In User
    if (user) {
        const dashboardPath = getDashboardPath();
        const role = user.user_type || 'User';

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-gray-50 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-green-600 mb-4">
                    Welcome Back, {user.first_name || role}!
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                    You are logged in as a **{role}**.
                </p>
                
                <Link
                    to={dashboardPath}
                    className="px-10 py-3 text-xl font-semibold text-white bg-green-500 rounded-lg shadow-xl hover:bg-green-600 transition duration-300 transform hover:scale-105"
                >
                    Go to Your Dashboard
                </Link>
            </div>
        );
    }

    // 2. Unauthenticated User (Shows Login/Register Buttons)
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
                Welcome to echoGIFT!
            </h1>
            <p className="text-xl text-gray-600 mb-10 text-center max-w-2xl">
                Create and manage wish lists, share them with friends and family, and make gift-giving effortless.
            </p>

            <div className="flex space-x-6">
                {/* Login Button: Navigates to the /login path */}
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    Login
                </button>

                {/* Register Button: Navigates to the /register path */}
                <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-3 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default HomePage;