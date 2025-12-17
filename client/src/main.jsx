// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Your main App component
import './index.css';         // Global CSS/Tailwind imports
import { AuthProvider } from './context/AuthContext'; // Auth context
import { BrowserRouter } from 'react-router-dom'; // Router for navigation

// Find the root element defined in index.html
const rootElement = document.getElementById('root');

// Ensure the root element exists before rendering
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
                {/* Wrap the entire application in the authentication context */}
                <AuthProvider>
                    <App />
                </AuthProvider>
        </React.StrictMode>
    );
} else {
    console.error('Failed to find the root element with ID "root"');
}

