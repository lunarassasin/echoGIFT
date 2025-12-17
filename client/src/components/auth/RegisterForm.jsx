// client/src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'Wisher', // Default to Wisher
    display_name: '',
    real_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const { email, password, confirmPassword, user_type, display_name, real_name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Client-side Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    
    try {
      // 2. Prepare payload to satisfy Database NOT NULL constraints
      // If a donor leaves real_name blank, we send a placeholder string
      const payload = {
        email,
        password,
        user_type,
        display_name,
        real_name: real_name.trim() === '' ? `${user_type} Account` : real_name,
      };

      // 3. Data sent to the backend API
      const response = await api.post('/auth/register', payload);
      
      // 4. Update global auth state
      login(response.data); 
      
      // 5. Role-based Redirection
      if (user_type === 'Wisher') {
        navigate('/wisher/dashboard');
      } else if (user_type === 'Donor') {
        navigate('/donor/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-8 border border-gray-200 rounded-lg shadow-xl bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Join echoGIFT</h2>
      
      {error && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded">{error}</p>}
      
      {/* Role Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">I want to register as:</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="user_type"
              value="Wisher"
              checked={user_type === 'Wisher'}
              onChange={onChange}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Wisher (Recipient)</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="user_type"
              value="Donor"
              checked={user_type === 'Donor'}
              onChange={onChange}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Donor (Giver)</span>
          </label>
        </div>
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">Email</label>
        <input type="email" name="email" value={email} onChange={onChange} required
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Display Name Input */}
      <div className="mb-4">
        <label htmlFor="display_name" className="block text-gray-700 mb-1 font-medium">Display Name (Visible to others)</label>
        <input type="text" name="display_name" value={display_name} onChange={onChange} required
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Real Name Input (Dynamic Requirement) */}
      <div className="mb-4">
        <label htmlFor="real_name" className="block text-gray-700 mb-1 font-medium">
          Legal Name {user_type === 'Wisher' ? '(Required for delivery)' : '(Optional)'}
        </label>
        <input 
          type="text" 
          name="real_name" 
          value={real_name} 
          onChange={onChange} 
          required={user_type === 'Wisher'} 
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder={user_type === 'Wisher' ? "As it appears on your ID" : "Optional for Donors"}
        />
      </div>

      {/* Password Inputs */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 mb-1 font-medium">Password</label>
        <input type="password" name="password" value={password} onChange={onChange} required minLength="6"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-gray-700 mb-1 font-medium">Confirm Password</label>
        <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} required
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-150 font-bold disabled:bg-gray-400"
      >
        {loading ? 'Creating Account...' : 'Register'}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Login here</a>
      </p>
    </form>
  );
};

export default RegisterForm;