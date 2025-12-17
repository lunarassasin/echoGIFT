// client/src/pages/SecretAdminRegister.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const SecretAdminRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', display_name: 'Admin' });

    useEffect(() => {
        // Clear old sessions immediately when this page loads
        localStorage.removeItem('token');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { ...formData, user_type: 'Admin' });
            alert("Admin Created!");
            navigate('/login');
        } catch (err) {
            alert("Error creating admin");
        }
    };

    return (
        <div className="p-10">
            <h2>Create Admin Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required className="border p-2 m-2" />
                <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required className="border p-2 m-2" />
                <button type="submit" className="bg-blue-500 text-white p-2">Register Admin</button>
            </form>
        </div>
    );
};

export default SecretAdminRegister;