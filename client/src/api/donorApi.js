// client/src/api/donorApi.js

// Use the Vercel/Vite environment variable, falling back to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

// Helper function to get the authentication token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function for consistent API error handling
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    return response.json();
};

/**
 * Fetches all open wishes available for a donor to fulfill.
 * This route requires authentication.
 */
export const getOpenWishes = async () => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error("Authentication token missing.");
        }
        
        const response = await fetch(`${API_URL}/donor/wishes/open`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        // Assumes backend returns { data: [...] }
        return handleResponse(response);
    } catch (error) {
        console.error("API Error fetching open wishes:", error);
        throw error;
    }
};

/**
 * Fetches the current donor's fulfillment history.
 * The donorId is not sent here, as the backend should identify the donor via the token.
 * This route requires authentication.
 */
export const getDonorFulfillmentHistory = async () => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error("Authentication token missing.");
        }
        
        const response = await fetch(`${API_URL}/donor/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        // Assumes backend returns { data: [...] }
        return handleResponse(response);
    } catch (error) {
        console.error("API Error fetching history:", error);
        throw error;
    }
};