import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const BrowseDonations = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('AVAILABLE');

  // Request Modal State
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories/active');
      if (res.data) setCategories(res.data);
    } catch (err) {
      console.warn('Could not load categories:', err);
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus && selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedCity) params.append('city', selectedCity);
      if (vegetarianOnly) params.append('vegetarian', 'true');
      if (searchTerm) params.append('search', searchTerm);

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await apiClient.get(`/donations${queryStr}`);
      if (res.data) {
        setDonations(res.data);
      }
    } catch (err) {
      showToast('Failed to load food listings: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [selectedCategory, selectedCity, vegetarianOnly, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  const openRequestModal = (donation) => {
    if (!user) {
      showToast('Please sign in as an NGO to request food batches', 'info');
      onNavigate('login');
      return;
    }
    if (user.role !== 'NGO') {
      showToast('Only registered NGOs can submit food requests', 'error');
      return;
    }
    setSelectedDonation(donation);
    setRequestQuantity(donation.remainingQuantity);
    setRequestMessage(`Requesting ${donation.remainingQuantity} ${donation.unit} for community distribution.`);
  };

  const submitFoodRequest = async (e) => {
    e.preventDefault();
    if (!selectedDonation) return;

    const qty = parseFloat(requestQuantity);
    if (isNaN(qty) || qty <= 0) {
      showToast('Requested quantity must be greater than zero', 'error');
      return;
    }

    if (qty > selectedDonation.remainingQuantity) {
      showToast(`Cannot request more than remaining quantity (${selectedDonation.remainingQuantity} ${selectedDonation.unit})`, 'error');
      return;
    }

    setSubmittingRequest(true);
    try {
      await apiClient.post('/requests', {
        donationId: selectedDonation.id,
        requestedQuantity: qty,
        requestMessage,
      });

      showToast('Food request submitted to donor successfully!', 'success');
      setSelectedDonation(null);
      fetchDonations(); // refresh available quantities
    } catch (err) {
      showToast(err.message || 'Failed to submit food request', 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-success">
            <span className="badge-dot" /> Live Registry
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Updated in real-time
          </span>
        </div>
        <h1>Browse Surplus Food Donations</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', marginTop: '0.35rem' }}>
          Discover available wholesome meals, bakery items, fresh produce, and pantry staples pledged by commercial kitchens and banquets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper" style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by keywords, dishes, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '180px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Metro Hubs</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi NCR">Delhi NCR</option>
          <option value="Chennai">Chennai</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '160px' }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="AVAILABLE">Available Only</option>
          <option value="PARTIALLY_RESERVED">Partially Reserved</option>
          <option value="ALL">All Batches</option>
        </select>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '600', padding: '0.45rem 0.85rem', background: vegetarianOnly ? 'var(--primary-light)' : 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', transition: 'var(--transition)' }}>
          <input
            type="checkbox"
            checked={vegetarianOnly}
            onChange={(e) => setVegetarianOnly(e.target.checked)}
          />
          <span>🌿 Veg Only</span>
        </label>
      </div>

      {/* Food Listings */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍲</div>
          Loading food batches...
        </div>
      ) : donations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🍽️</div>
          <h3>No matching food batches found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
            Try clearing filters or check back shortly. New commercial donations are posted continuously after banquet events.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedCity('');
              setVegetarianOnly(false);
              setSelectedStatus('AVAILABLE');
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="donations-grid">
          {donations.map((d) => {
            const pctLeft = Math.round((d.remainingQuantity / d.quantity) * 100);
            return (
              <div key={d.id} className="donation-card">
                <div className="donation-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {d.categoryName || 'General Category'}
                    </span>
                    <Badge status={d.status} />
                  </div>

                  <h3 className="donation-card-title">{d.foodName}</h3>

                  <div className="donation-card-meta">
                    <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      📍 {d.city} {d.area ? `(${d.area})` : ''}
                    </span>
                    {d.vegetarian && (
                      <span style={{ fontSize: '0.8rem', background: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700', border: '1px solid #a7f3d0' }}>
                        🌿 Vegetarian
                      </span>
                    )}
                    {d.allergenInformation && (
                      <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '500' }}>
                        ⚠️ {d.allergenInformation}
                      </span>
                    )}
                  </div>

                  <p className="donation-card-desc">
                    {d.description || 'Surplus nutritious meal batch ready for community redistribution.'}
                  </p>

                  {d.specialInformation && (
                    <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                      <strong>Storage & Handling:</strong> {d.specialInformation}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Remaining Stock:</span>
                      <strong style={{ color: 'var(--primary-dark)' }}>
                        {d.remainingQuantity} / {d.quantity} {d.unit} ({pctLeft}%)
                      </strong>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.65rem' }}>
                      <div style={{ width: `${Math.max(5, pctLeft)}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '999px' }} />
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>⏱️ Pickup Deadline:</span>
                      <strong>{new Date(d.pickupDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong>
                    </div>
                  </div>
                </div>

                <div className="donation-card-footer">
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      🏢 {d.donorOrganization || d.donorName || 'Donor Kitchen'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {d.pickupAddress}
                    </div>
                  </div>

                  {d.remainingQuantity > 0 && d.status !== 'CANCELLED' && d.status !== 'EXPIRED' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openRequestModal(d)}
                    >
                      Request Food
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Request Food Modal for NGOs */}
      <Modal
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        title={`Request Food Batch: ${selectedDonation?.foodName || ''}`}
      >
        {selectedDonation && (
          <form onSubmit={submitFoodRequest}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Donor Facility:</span> <strong>{selectedDonation.donorOrganization}</strong>
              </div>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pickup Location:</span> <strong>{selectedDonation.pickupAddress}, {selectedDonation.city}</strong>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Available Stock:</span> <strong>{selectedDonation.remainingQuantity} {selectedDonation.unit}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Requested Quantity ({selectedDonation.unit}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={selectedDonation.remainingQuantity}
                className="form-input"
                value={requestQuantity}
                onChange={(e) => setRequestQuantity(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Maximum claimable: {selectedDonation.remainingQuantity} {selectedDonation.unit}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Intended Beneficiary Center & Distribution Plan *</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Describe your feeding shelter, meal distribution schedule, and vehicle readiness..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedDonation(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingRequest}
              >
                {submittingRequest ? 'Submitting...' : 'Confirm Allocation Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
