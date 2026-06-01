import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion as Motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      alert('Invalid email or password. Please try again!');
    }
  };

  return (
    <div className="page-wrap">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          placeItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Motion.div
          className="glass auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="hero-title" style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '1rem' }}>
            Welcome Back
          </h1>
          <div style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#fefcbf', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--accent)' }}>Demo Accounts:</strong><br />
            • User: <code style={{ color: 'white' }}>maryam@gmail.com</code> (pw: <code style={{ color: 'white' }}>userpassword</code>)<br />
            • Admin: <code style={{ color: 'white' }}>admin@recipe.com</code> (pw: <code style={{ color: 'white' }}>adminpassword</code>)
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-on-dark)' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="maryam@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-on-dark)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              Sign in
            </button>
          </form>
          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don’t have an account? <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one</Link>
          </p>
        </Motion.div>
      </div>
    </div>
  );
};

export default Login;
