import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ensure this path is correct

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <div className="logo">
          <Link to="/" style={logoStyle}>echoGIFT</Link>
        </div>
        <ul style={ulStyle}>
          <li><Link to="/wishes" style={linkStyle}>Browse Wishes</Link></li>
          
          {/* If NO user is logged in, show Login/Register */}
          {!user ? (
            <>
              <li><Link to="/login" style={linkStyle}>Login</Link></li>
              <li><Link to="/register" style={linkStyle}>Register</Link></li>
            </>
          ) : (
            /* If a user IS logged in, show Logout */
            <li>
              <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout ({user.display_name || 'User'})
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

// --- Styles ---
const headerStyle = { background: '#333', color: '#fff', padding: '1rem 2rem' };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', textDecoration: 'none' };
const ulStyle = { display: 'flex', listStyle: 'none', gap: '1.5rem', margin: 0, alignItems: 'center' };
const linkStyle = { color: '#fff', textDecoration: 'none' };
const logoutButtonStyle = {
  background: '#ff4d4d',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Header;