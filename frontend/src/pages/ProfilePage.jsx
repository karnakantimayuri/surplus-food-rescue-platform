import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const endpoint =
          user.role === 'DONOR'
            ? '/profiles/donor'
            : user.role === 'NGO'
            ? '/profiles/ngo'
            : '/profiles/volunteer';
        const res = await apiClient.get(endpoint);
        if (res.data) {
          setProfile(res.data);
          setFormData(res.data);
        }
      } catch (err) {
        showToast('Error loading profile: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint =
        user.role === 'DONOR'
          ? '/profiles/donor'
          : user.role === 'NGO'
          ? '/profiles/ngo'
          : '/profiles/volunteer';

      const res = await apiClient.put(endpoint, formData);
      if (res.data) {
        setProfile(res.data);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '1.5rem auto' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>Manage Profile ({user?.role})</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Keep your contact and operation details up to date.
            </p>
          </div>
          {profile?.verificationStatus && (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                Verification
              </span>
              <Badge status={profile.verificationStatus} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {user?.role === 'DONOR' && (
            <>
              <div className="form-group">
                <label className="form-label">Donor Business Name *</label>
                <input
                  type="text"
                  name="organizationName"
                  className="form-input"
                  value={formData.organizationName || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    className="form-input"
                    value={formData.contactPerson || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={formData.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Facility Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organization Description</label>
                <textarea
                  rows={3}
                  name="description"
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {user?.role === 'NGO' && (
            <>
              <div className="form-group">
                <label className="form-label">NGO Organization Name *</label>
                <input
                  type="text"
                  name="organizationName"
                  className="form-input"
                  value={formData.organizationName || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Organization Type</label>
                  <input
                    type="text"
                    name="organizationType"
                    className="form-input"
                    value={formData.organizationType || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Daily Capacity (Persons)</label>
                  <input
                    type="number"
                    name="capacity"
                    className="form-input"
                    value={formData.capacity || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    value={formData.address || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={formData.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service Area</label>
                <input
                  type="text"
                  name="serviceArea"
                  className="form-input"
                  value={formData.serviceArea || ''}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {user?.role === 'VOLUNTEER' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={formData.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Dispatch Area</label>
                  <input
                    type="text"
                    name="serviceArea"
                    className="form-input"
                    value={formData.serviceArea || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Availability Status</label>
                <select
                  name="availability"
                  className="form-select"
                  value={formData.availability || 'AVAILABLE'}
                  onChange={handleChange}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BUSY">BUSY</option>
                  <option value="OFFLINE">OFFLINE</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
