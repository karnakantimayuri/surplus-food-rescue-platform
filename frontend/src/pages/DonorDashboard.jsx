import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const DonorDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('donations');
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New / Edit Donation Modal
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [submittingDonation, setSubmittingDonation] = useState(false);

  const [donationForm, setDonationForm] = useState({
    categoryId: '',
    foodName: '',
    description: '',
    quantity: '',
    unit: 'SERVINGS',
    pickupDeadline: '',
    pickupAddress: '',
    city: 'Metro City',
    area: '',
    specialInformation: '',
    vegetarian: true,
    allergenInformation: '',
    storageInstructions: '',
  });

  // Request Action Modal (Approve / Reject)
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('APPROVE');
  const [donorResponseNote, setDonorResponseNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [donationsRes, requestsRes, catsRes] = await Promise.all([
        apiClient.get('/donations/my'),
        apiClient.get('/requests/donor'),
        apiClient.get('/categories/active'),
      ]);

      if (donationsRes.data) setDonations(donationsRes.data);
      if (requestsRes.data) setRequests(requestsRes.data);
      if (catsRes.data) {
        setCategories(catsRes.data);
        if (catsRes.data.length > 0 && !donationForm.categoryId) {
          setDonationForm((prev) => ({ ...prev, categoryId: catsRes.data[0].id }));
        }
      }
    } catch (err) {
      showToast('Error loading donor dashboard: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openNewDonationModal = () => {
    setEditingDonation(null);
    setDonationForm({
      categoryId: categories[0]?.id || '',
      foodName: '',
      description: '',
      quantity: '',
      unit: 'SERVINGS',
      pickupDeadline: new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 16),
      pickupAddress: user?.address || 'Banquet Kitchen Service Gate 2',
      city: 'Bengaluru',
      area: 'Indiranagar / Domlur',
      specialInformation: 'Packed in food-grade insulated catering degchis. Keep covered.',
      vegetarian: true,
      allergenInformation: '',
      storageInstructions: 'Serve or refrigerate within 2 hours',
    });
    setShowDonationModal(true);
  };

  const openEditModal = (donation) => {
    setEditingDonation(donation);
    setDonationForm({
      categoryId: donation.categoryId,
      foodName: donation.foodName,
      description: donation.description || '',
      quantity: donation.quantity,
      unit: donation.unit,
      pickupDeadline: donation.pickupDeadline?.slice(0, 16) || '',
      pickupAddress: donation.pickupAddress,
      city: donation.city,
      area: donation.area || '',
      specialInformation: donation.specialInformation || '',
      vegetarian: donation.vegetarian,
      allergenInformation: donation.allergenInformation || '',
      storageInstructions: donation.storageInstructions || '',
    });
    setShowDonationModal(true);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setSubmittingDonation(true);

    try {
      const payload = {
        ...donationForm,
        categoryId: parseInt(donationForm.categoryId),
        quantity: parseFloat(donationForm.quantity),
      };

      if (editingDonation) {
        await apiClient.put(`/donations/${editingDonation.id}`, payload);
        showToast('Donation listing updated successfully', 'success');
      } else {
        await apiClient.post('/donations', payload);
        showToast('New surplus food batch listed successfully!', 'success');
      }

      setShowDonationModal(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save donation', 'error');
    } finally {
      setSubmittingDonation(false);
    }
  };

  const handleCancelDonation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this donation listing?')) return;
    try {
      await apiClient.post(`/donations/${id}/cancel`);
      showToast('Donation cancelled successfully', 'info');
      loadData();
    } catch (err) {
      showToast(err.message || 'Could not cancel donation', 'error');
    }
  };

  const openRequestAction = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setDonorResponseNote(type === 'APPROVE' ? 'Approved! Ready for pickup at indicated loading dock.' : 'Unfortunately we cannot fulfill this batch.');
  };

  const submitRequestAction = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setSubmittingAction(true);

    try {
      if (actionType === 'APPROVE') {
        await apiClient.post(`/requests/${selectedRequest.id}/approve`, {
          donorResponse: donorResponseNote,
        });
        showToast('Request approved! Stock reserved.', 'success');
      } else {
        await apiClient.post(`/requests/${selectedRequest.id}/reject`, {
          donorResponse: donorResponseNote,
        });
        showToast('Request rejected.', 'info');
      }
      setSelectedRequest(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Metrics
  const activeDonationsCount = donations.filter((d) => d.status === 'AVAILABLE' || d.status === 'PARTIALLY_RESERVED').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;
  const completedDonationsCount = donations.filter((d) => d.status === 'COMPLETED').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Donor Management Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            List surplus batches, review NGO requests, and track food pickups.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openNewDonationModal}>
          + List New Surplus Food
        </button>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard title="Active Listings" value={activeDonationsCount} icon="📦" color="#10b981" subtitle="Available / Partially Reserved" />
        <StatCard title="Pending Requests" value={pendingRequestsCount} icon="📩" color="#f59e0b" subtitle="Requires donor review" />
        <StatCard title="Completed Rescues" value={completedDonationsCount} icon="✅" color="#0284c7" subtitle="Safely delivered batches" />
        <StatCard title="Total Donations Created" value={donations.length} icon="🍲" color="#8b5cf6" subtitle="All-time listings" />
      </div>

      {/* Dashboard Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          My Food Donations ({donations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Incoming NGO Requests ({requests.length})
          {pendingRequestsCount > 0 && (
            <span style={{ marginLeft: '6px', background: '#ef4444', color: 'white', borderRadius: '999px', padding: '1px 7px', fontSize: '0.75rem' }}>
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading donor data...
        </div>
      ) : activeTab === 'donations' ? (
        /* My Donations Tab */
        donations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍲</div>
            <h3>No food donations created yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              List your hotel, restaurant, or catering surplus to feed local communities.
            </p>
            <button className="btn btn-primary btn-sm" onClick={openNewDonationModal}>
              List Your First Batch
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Food Batch</th>
                    <th>Category</th>
                    <th>Quantity / Remaining</th>
                    <th>Pickup Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <strong>{d.foodName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {d.vegetarian ? '🌿 Vegetarian' : 'Non-Veg'} • {d.pickupAddress}
                        </div>
                      </td>
                      <td>{d.categoryName || 'General'}</td>
                      <td>
                        <strong>{d.remainingQuantity}</strong> / {d.quantity} {d.unit}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(d.pickupDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td>
                        <Badge status={d.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {(d.status === 'AVAILABLE' || d.status === 'PARTIALLY_RESERVED') && (
                            <>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => openEditModal(d)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancelDonation(d.id)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Incoming NGO Requests Tab */
        requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📩</div>
            <h3>No requests received yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              When verified NGOs request portions of your food donations, they will appear here for your approval.
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Requested Batch</th>
                    <th>Requesting NGO</th>
                    <th>Quantity</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Dispatch Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.foodName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <strong>{r.organizationName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {r.organizationContact} • {r.organizationPhone}
                        </div>
                      </td>
                      <td>
                        <strong>{r.requestedQuantity}</strong> {r.unit}
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '0.85rem' }}>
                        "{r.requestMessage || 'No custom message'}"
                        {r.donorResponse && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', marginTop: '0.2rem' }}>
                            <strong>Reply:</strong> {r.donorResponse}
                          </div>
                        )}
                      </td>
                      <td>
                        <Badge status={r.status} />
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {r.volunteerName ? (
                          <div>
                            <div>🚴 {r.volunteerName}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Pickup: {r.pickupStatus}
                            </span>
                          </div>
                        ) : r.status === 'APPROVED' ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Awaiting Volunteer</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        {r.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openRequestAction(r, 'APPROVE')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => openRequestAction(r, 'REJECT')}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* New / Edit Food Donation Modal */}
      <Modal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        title={editingDonation ? `Edit Donation: ${editingDonation.foodName}` : 'List New Surplus Food Batch'}
      >
        <form onSubmit={handleDonationSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Food Batch Name *</label>
              <input
                type="text"
                name="foodName"
                className="form-input"
                value={donationForm.foodName}
                onChange={handleFormChange}
                placeholder="e.g. Vegetable Biryani & Paneer Curry"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="categoryId"
                className="form-select"
                value={donationForm.categoryId}
                onChange={handleFormChange}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="quantity"
                className="form-input"
                value={donationForm.quantity}
                onChange={handleFormChange}
                placeholder="50"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit of Measure *</label>
              <select
                name="unit"
                className="form-select"
                value={donationForm.unit}
                onChange={handleFormChange}
              >
                <option value="SERVINGS">SERVINGS (Prepared meals)</option>
                <option value="KG">KG (Kilograms)</option>
                <option value="PACKETS">PACKETS</option>
                <option value="BOXES">BOXES</option>
                <option value="TRAYS">TRAYS</option>
                <option value="LITERS">LITERS</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pickup Deadline *</label>
              <input
                type="datetime-local"
                name="pickupDeadline"
                className="form-input"
                value={donationForm.pickupDeadline}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  name="vegetarian"
                  checked={donationForm.vegetarian}
                  onChange={handleFormChange}
                />
                🌿 Vegetarian Food Batch
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pickup Address *</label>
              <input
                type="text"
                name="pickupAddress"
                className="form-input"
                value={donationForm.pickupAddress}
                onChange={handleFormChange}
                placeholder="Kitchen Bay / Receiving Dock"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={donationForm.city}
                onChange={handleFormChange}
                placeholder="Metro City"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Food Description</label>
            <textarea
              name="description"
              rows={2}
              className="form-textarea"
              value={donationForm.description}
              onChange={handleFormChange}
              placeholder="Freshly cooked today for banquet lunch..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Allergen Information</label>
              <input
                type="text"
                name="allergenInformation"
                className="form-input"
                value={donationForm.allergenInformation}
                onChange={handleFormChange}
                placeholder="e.g. Contains dairy, nuts, wheat"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Storage / Reheating Instructions</label>
              <input
                type="text"
                name="storageInstructions"
                className="form-input"
                value={donationForm.storageInstructions}
                onChange={handleFormChange}
                placeholder="e.g. Keep hot at 65C or refrigerate"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDonationModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingDonation}
            >
              {submittingDonation ? 'Saving...' : editingDonation ? 'Update Listing' : 'Publish Donation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Action Modal (Approve / Reject) */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`${actionType === 'APPROVE' ? 'Approve' : 'Reject'} NGO Request`}
      >
        {selectedRequest && (
          <form onSubmit={submitRequestAction}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div><strong>NGO:</strong> {selectedRequest.organizationName}</div>
              <div><strong>Food:</strong> {selectedRequest.foodName}</div>
              <div><strong>Quantity:</strong> {selectedRequest.requestedQuantity} {selectedRequest.unit}</div>
              <div style={{ marginTop: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <em>"{selectedRequest.requestMessage}"</em>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Response Note to NGO</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={donorResponseNote}
                onChange={(e) => setDonorResponseNote(e.target.value)}
                placeholder="Provide pickup instructions or comments..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn ${actionType === 'APPROVE' ? 'btn-primary' : 'btn-danger'}`}
                disabled={submittingAction}
              >
                {submittingAction ? 'Processing...' : actionType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
