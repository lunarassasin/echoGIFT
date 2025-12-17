import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <div className="logo">
          <Link to="/" style={logoStyle}>echoGIFT</Link>
        </div>
        <ul style={ulStyle}>
          <li><Link to="/wishes">Browse Wishes</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </header>
  );
};

// Basic inline styles for layout
const headerStyle = {
  background: '#333',
  color: '#fff',
  padding: '1rem 2rem',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#fff',
  textDecoration: 'none',
};

const ulStyle = {
  display: 'flex',
  listStyle: 'none',
  gap: '1.5rem',
  margin: 0,
};

export default Header;