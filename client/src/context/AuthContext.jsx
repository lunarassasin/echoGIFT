// client/src/context/AuthContext.jsx (Deployment Ready Version)
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store user object (contains user_type, display_name, etc.)
  const [user, setUser] = useState(null); 
  // Flag to prevent rendering components until auth check is done
  const [loading, setLoading] = useState(true); 

  // Sets user data and stores the token
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData); 
  };

  // Clears state and token
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Deployment-Ready Initializer: Checks for token and validates it on the server
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // The api interceptor will automatically attach this token to the request
        try {
          // Call the new backend endpoint to validate the token and get user data
          const response = await api.get('/auth/validate');
          setUser(response.data); // Set the retrieved, verified user data
        } catch (error) {
          // If the token is expired or invalid, the interceptor or controller
          // will reject, and we must clear the token.
          console.log('Token validation failed, clearing token.');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false); // Authentication check complete
    };

    checkAuthStatus();
  }, []); // Runs only once on component mount

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* Only render children (the rest of the app) after the loading check is complete */}
      {!loading ? children : <div className="text-center p-8">Initializing application...</div>} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);