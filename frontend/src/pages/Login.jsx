import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Login = ({ onNavigate }) => {
  const { login } = useAuth();
  const { showToast } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      showToast(`Welcome back, ${loggedUser.fullName}!`, 'success');
      switch (loggedUser.role) {
        case 'DONOR': onNavigate('donor-dashboard'); break;
        case 'NGO': onNavigate('ngo-dashboard'); break;
        case 'VOLUNTEER': onNavigate('volunteer-dashboard'); break;
        case 'ADMIN': onNavigate('admin-dashboard'); break;
        default: onNavigate('home');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    setError('');
  };

  return (
    <div style={{ maxWidth: '520px', margin: '3rem auto' }}>
      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#ffffff', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2>Sign In to FoodRescue</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Access your real-time coordination dashboard
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Pre-Fill Selector */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.15rem', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="pulse-dot" />
            <span>Instant Demo Logins</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', padding: '0.55rem 0.75rem' }}
              onClick={() => fillCredentials('admin@foodrescue.org', 'Admin@123456')}
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', padding: '0.55rem 0.75rem' }}
              onClick={() => fillCredentials('grandchola@banquets.in', 'Password@123')}
            >
              👨‍🍳 Donor Chef
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', padding: '0.55rem 0.75rem' }}
              onClick={() => fillCredentials('akshayapatra@relief.org', 'Password@123')}
            >
              🤝 NGO Lead
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', padding: '0.55rem 0.75rem' }}
              onClick={() => fillCredentials('arjun.patel@volunteer.in', 'Password@123')}
            >
              🚴 Volunteer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@organization.org"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Platform'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.885rem', color: 'var(--text-secondary)' }}>
          Don't have an organization account yet?{' '}
          <a href="#register" style={{ fontWeight: '600' }} onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>
            Register Now →
          </a>
        </div>
      </div>
    </div>
  );
};
