import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const NgoDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Volunteer Assignment Modal (NGO assigning volunteer to approved request)
  const [assigningRequest, setAssigningRequest] = useState(null);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const [reqRes, volRes] = await Promise.all([
        apiClient.get('/requests/my'),
        apiClient.get('/assignments/volunteers').catch(() => ({ data: [] })),
      ]);
      if (reqRes.data) setRequests(reqRes.data);
      if (volRes.data) {
        setVolunteers(volRes.data);
        if (volRes.data.length > 0) setSelectedVolunteerId(volRes.data[0].id);
      }
    } catch (err) {
      showToast('Error loading NGO dashboard: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request? Reserved stock will be restored to the donor.')) return;
    try {
      await apiClient.post(`/requests/${id}/cancel`);
      showToast('Request cancelled successfully. Stock restored.', 'info');
      loadRequests();
    } catch (err) {
      showToast(err.message || 'Failed to cancel request', 'error');
    }
  };

  const openAssignVolunteerModal = (req) => {
    setAssigningRequest(req);
    if (volunteers.length > 0) setSelectedVolunteerId(volunteers[0].id);
  };

  const handleAssignVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (!assigningRequest || !selectedVolunteerId) return;

    setSubmittingAssignment(true);
    try {
      await apiClient.post('/assignments', {
        foodRequestId: assigningRequest.id,
        volunteerId: parseInt(selectedVolunteerId),
      });
      showToast('Volunteer successfully assigned to dispatch task!', 'success');
      setAssigningRequest(null);
      loadRequests();
    } catch (err) {
      showToast(err.message || 'Failed to assign volunteer', 'error');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // Metrics
  const approvedCount = requests.filter((r) => r.status === 'APPROVED' || r.status === 'ASSIGNED').length;
  const inTransitCount = requests.filter((r) => r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>NGO Coordination Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage food requests, coordinate pickup dispatchers, and track delivery receipts.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => onNavigate('browse')}>
          🔍 Request More Food Batches
        </button>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard title="Active Requests" value={requests.length} icon="📋" color="#3b82f6" subtitle="All requests filed" />
        <StatCard title="Approved / Ready" value={approvedCount} icon="📦" color="#10b981" subtitle="Awaiting or assigned pickup" />
        <StatCard title="In Transit" value={inTransitCount} icon="🚚" color="#f59e0b" subtitle="Collected by volunteer" />
        <StatCard title="Delivered & Received" value={completedCount} icon="✅" color="#8b5cf6" subtitle="Safely received meals" />
      </div>

      <div className="card" style={{ padding: 0, marginTop: '1.5rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>My Organization's Food Requests ({requests.length})</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadRequests}>
            🔄 Refresh Status
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
            <h3>No requests submitted yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Explore active donor listings and request batches for your community pantry or shelter.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('browse')}>
              Browse Food Donations
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Food Batch</th>
                  <th>Donor Details</th>
                  <th>Quantity</th>
                  <th>Request Status</th>
                  <th>Volunteer Dispatch</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.foodName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Requested: {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                      {r.requestMessage && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          <em>"{r.requestMessage}"</em>
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{r.donorName || 'Donor'}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        📍 {r.pickupAddress}
                      </div>
                      {r.donorPhone && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          📞 {r.donorPhone}
                        </div>
                      )}
                      {r.donorResponse && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', marginTop: '0.2rem' }}>
                          Note: {r.donorResponse}
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{r.requestedQuantity}</strong> {r.unit}
                    </td>
                    <td>
                      <Badge status={r.status} />
                    </td>
                    <td>
                      {r.volunteerName ? (
                        <div>
                          <div>🚴 <strong>{r.volunteerName}</strong></div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            📞 {r.volunteerPhone}
                          </div>
                          <div style={{ marginTop: '0.2rem' }}>
                            <Badge status={r.pickupStatus || 'ASSIGNED'} />
                          </div>
                        </div>
                      ) : r.status === 'APPROVED' ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openAssignVolunteerModal(r)}
                        >
                          + Assign Volunteer
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      {(r.status === 'PENDING' || r.status === 'APPROVED' || r.status === 'ASSIGNED') && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelRequest(r.id)}
                        >
                          Cancel
                        </button>
                      )}
                      {r.status === 'COMPLETED' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
                          ✓ Received
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Volunteer Modal */}
      <Modal
        isOpen={!!assigningRequest}
        onClose={() => setAssigningRequest(null)}
        title="Assign Delivery Volunteer"
      >
        {assigningRequest && (
          <form onSubmit={handleAssignVolunteerSubmit}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div><strong>Food Batch:</strong> {assigningRequest.foodName}</div>
              <div><strong>Pickup Location:</strong> {assigningRequest.pickupAddress}</div>
              <div><strong>Quantity:</strong> {assigningRequest.requestedQuantity} {assigningRequest.unit}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Registered Volunteer *</label>
              <select
                className="form-select"
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                required
              >
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.userFullName} ({v.city} - {v.serviceArea || 'General'} | {v.availability})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAssigningRequest(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingAssignment}
              >
                {submittingAssignment ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
