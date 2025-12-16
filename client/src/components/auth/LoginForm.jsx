// client/src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Send login data to the backend API
      const response = await api.post('/auth/login', { email, password });
      
      // If successful, update the global auth state (stores token)
      const userData = response.data;
      login(userData); 
      
      // Redirect based on user role (user_type comes back in the response)
      if (userData.user_type === 'Wisher') {
        navigate('/wisher/dashboard');
      } else if (userData.user_type === 'Donor') {
        navigate('/donor/dashboard');
      }

    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your email and password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-8 border border-gray-200 rounded-lg shadow-xl bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      
      {error && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded">{error}</p>}
      
      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={email} onChange={onChange} required
          className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
        <input type="password" name="password" value={password} onChange={onChange} required
          className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-150 font-bold"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-800">Register here</a>
      </p>
    </form>
  );
};

export default LoginForm;