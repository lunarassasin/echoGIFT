import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} echoGIFT. All rights reserved.</p>
      <div style={linkGroupStyle}>
        <a href="/privacy" style={linkStyle}>Privacy Policy</a>
        <a href="/terms" style={linkStyle}>Terms of Service</a>
      </div>
    </footer>
  );
};

const footerStyle = {
  background: '#f4f4f4',
  color: '#666',
  padding: '2rem',
  textAlign: 'center',
  marginTop: 'auto', // Helps push footer to bottom in flex layouts
};

const linkGroupStyle = {
  marginTop: '1rem',
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
};

const linkStyle = {
  color: '#666',
  textDecoration: 'none',
  fontSize: '0.8rem',
};

export default Footer;