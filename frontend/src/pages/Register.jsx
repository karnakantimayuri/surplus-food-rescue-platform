import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Register = ({ onNavigate }) => {
  const { register } = useAuth();
  const { showToast } = useNotification();
  const [role, setRole] = useState('DONOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    // Donor / NGO fields
    organizationName: '',
    contactPerson: '',
    address: '',
    city: 'Bengaluru',
    area: '',
    serviceArea: '',
    organizationType: 'Hunger Relief Trust / Non-Profit',
    capacity: 200,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        role,
        capacity: formData.capacity ? parseInt(formData.capacity) : 100,
      };

      const newUser = await register(payload);
      showToast(`Account created successfully! Welcome, ${newUser.fullName}.`, 'success');
      switch (role) {
        case 'DONOR': onNavigate('donor-dashboard'); break;
        case 'NGO': onNavigate('ngo-dashboard'); break;
        case 'VOLUNTEER': onNavigate('volunteer-dashboard'); break;
        default: onNavigate('home');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌱</div>
          <h2>Join FoodRescue Network</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Register as a Donor, NGO Partner, or Volunteer Dispatcher
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Role Selection Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`btn ${role === 'DONOR' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setRole('DONOR')}
          >
            🏢 Food Donor
          </button>
          <button
            type="button"
            className={`btn ${role === 'NGO' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setRole('NGO')}
          >
            🤝 Relief NGO
          </button>
          <button
            type="button"
            className={`btn ${role === 'VOLUNTEER' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setRole('VOLUNTEER')}
          >
            🚴 Volunteer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Account Credentials */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Sarah Jenkins"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1-555-019-2831"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@organization.org"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password * (Min 6 chars)</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          {role === 'DONOR' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Donor Business / Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    className="form-input"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="e.g. Grand Horizon Hotel & Catering"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    className="form-input"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="e.g. Executive Chef Michael"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="100 Commercial Way"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Metro City"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Donor Description</label>
                <textarea
                  name="description"
                  rows={2}
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Hotel buffet dining, banquet surplus, organic bakery."
                />
              </div>
            </>
          )}

          {role === 'NGO' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">NGO / Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    className="form-input"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="e.g. Community Meals Foundation"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization Type</label>
                  <input
                    type="text"
                    name="organizationType"
                    className="form-input"
                    value={formData.organizationType}
                    onChange={handleChange}
                    placeholder="e.g. Homeless Shelter, Food Bank"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Distribution Center Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="55 Elm Street"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Metro City"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Service Area</label>
                  <input
                    type="text"
                    name="serviceArea"
                    className="form-input"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    placeholder="e.g. East District & Downtown"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Daily Serving Capacity (People)</label>
                  <input
                    type="number"
                    name="capacity"
                    className="form-input"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="150"
                  />
                </div>
              </div>
            </>
          )}

          {role === 'VOLUNTEER' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Metro City"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Service Area</label>
                  <input
                    type="text"
                    name="serviceArea"
                    className="form-input"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    placeholder="e.g. Central City & West End"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Register as ${role}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
            Sign In here
          </a>
        </div>
      </div>
    </div>
  );
};
