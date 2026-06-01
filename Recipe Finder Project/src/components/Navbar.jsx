import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../data/pakistaniFood';
import { FaHeart, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/cuisine', label: 'Cuisine' },
  { to: '/regions', label: 'Regions' },
  { to: '/traditions', label: 'Traditions' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [Open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  return (
    <nav className="pk-nav">
      <div className="pk-nav__inner">
        <Link to="/" className="pk-nav__brand" style={{ textDecoration: 'none' }}>
           <span className="pk-nav__brand-text">
            {BRAND.name}
          </span>
        </Link>

        <div className="pk-nav__links">
          {navLinks.map((l) => (
            <Link 
              key={l.to} 
              to={l.to} 
              style={{ 
                color: location.pathname === l.to ? 'var(--accent)' : 'var(--text-main)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/favorites" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 700 }}>
                Favorites
              </Link>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} 
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1.25rem' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
