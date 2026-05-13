import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    signup(email, password, name);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass auth-card">
        <h2 className="hero-title" style={{ textAlign: 'center', marginBottom: '1.75rem', fontSize: '1.75rem' }}>
          Create account
        </h2>
        {error && (
          <div
            style={{
              background: 'rgba(220, 38, 38, 0.25)',
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              color: 'var(--text-on-dark)',
              fontSize: '0.9rem',
              border: '1px solid rgba(248, 113, 113, 0.4)',
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.1rem' }}>
            <label htmlFor="signup-name" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Name
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '0.55rem 0.85rem' }}>
              <FaUser style={{ color: '#6366f1', marginRight: '0.5rem', flexShrink: 0 }} aria-hidden />
              <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }} />
            </div>
          </div>
          <div style={{ marginBottom: '1.1rem' }}>
            <label htmlFor="signup-email" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Email
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '0.55rem 0.85rem' }}>
              <FaEnvelope style={{ color: '#6366f1', marginRight: '0.5rem', flexShrink: 0 }} aria-hidden />
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }} />
            </div>
          </div>
          <div style={{ marginBottom: '1.35rem' }}>
            <label htmlFor="signup-password" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '0.55rem 0.85rem' }}>
              <FaLock style={{ color: '#6366f1', marginRight: '0.5rem', flexShrink: 0 }} aria-hidden />
              <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign up
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.35rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
