import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const SecretAdminRegister = () => {
  const [formData, setFormData] = useState({ email: '', password: '', display_name: 'Admin' });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Creating...');
    try {
      // We force the user_type to Admin here
      await api.post('/auth/register', { ...formData, user_type: 'Admin' });
      setStatus('Success! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus('Error: ' + (err.response?.data?.message || 'Check console'));
    }
  };

  return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Secret Admin Setup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
        <input type="email" placeholder="Admin Email" className="border p-2"
          onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Admin Password" className="border p-2"
          onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="bg-red-500 text-white p-2 rounded">Create Admin</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default SecretAdminRegister;