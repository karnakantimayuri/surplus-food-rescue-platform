import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [assignments, setAssignments] = useState([]);
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status Update Modal (Collect / Deliver)
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [statusAction, setStatusAction] = useState('COLLECT'); // COLLECT or DELIVER
  const [notes, setNotes] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assignRes, profileRes] = await Promise.all([
        apiClient.get('/assignments/my'),
        apiClient.get('/profiles/volunteer').catch(() => ({ data: null })),
      ]);
      if (assignRes.data) setAssignments(assignRes.data);
      if (profileRes.data) setVolunteerProfile(profileRes.data);
    } catch (err) {
      showToast('Error loading volunteer tasks: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAvailabilityChange = async (newAvailability) => {
    try {
      const res = await apiClient.put('/profiles/volunteer', {
        city: volunteerProfile?.city || 'Bengaluru',
        serviceArea: volunteerProfile?.serviceArea || 'Central & Indiranagar',
        availability: newAvailability,
      });
      if (res.data) {
        setVolunteerProfile(res.data);
        showToast(`Availability status updated to: ${newAvailability}`, 'success');
      }
    } catch (err) {
      showToast('Could not update availability: ' + err.message, 'error');
    }
  };

  const handleAcceptAssignment = async (assignmentId) => {
    try {
      await apiClient.post(`/assignments/${assignmentId}/status`, {
        action: 'ACCEPT',
        notes: 'Task accepted by volunteer dispatcher.',
      });
      showToast('Assignment accepted! Proceed to pickup location.', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to accept assignment', 'error');
    }
  };

  const openStatusModal = (assignment, action) => {
    setSelectedAssignment(assignment);
    setStatusAction(action);
    setNotes(
      action === 'COLLECT'
        ? 'Inspected food temperature and packaging. Secured into transport bags.'
        : 'Delivered directly to organization kitchen manager. Food verified in good condition.'
    );
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setSubmittingStatus(true);
    try {
      await apiClient.post(`/assignments/${selectedAssignment.id}/status`, {
        action: statusAction,
        notes,
      });

      showToast(
        statusAction === 'COLLECT'
          ? 'Food marked COLLECTED and in transit!'
          : 'Food marked DELIVERED successfully! Great job rescuing food!',
        'success'
      );
      setSelectedAssignment(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update assignment status', 'error');
    } finally {
      setSubmittingStatus(false);
    }
  };

  // Metrics
  const activeTasks = assignments.filter((a) => a.deliveryStatus !== 'DELIVERED' && a.pickupStatus !== 'CANCELLED');
  const completedTasks = assignments.filter((a) => a.deliveryStatus === 'DELIVERED');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Volunteer Dispatcher Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Coordinate surplus food pickups from commercial kitchens and deliver to verified community shelters.
          </p>
        </div>

        {/* Availability Switcher */}
        {volunteerProfile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>My Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              value={volunteerProfile.availability}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
            >
              <option value="AVAILABLE">🟢 Available for Dispatch</option>
              <option value="BUSY">🟡 Busy on Run</option>
              <option value="OFFLINE">⚪ Offline</option>
            </select>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard title="Assigned Runs" value={assignments.length} icon="🚴" color="#3b82f6" subtitle="All-time dispatches" />
        <StatCard title="Active In-Progress" value={activeTasks.length} icon="🚚" color="#f59e0b" subtitle="Pending collection or transit" />
        <StatCard title="Completed Deliveries" value={completedTasks.length} icon="🏆" color="#10b981" subtitle="Rescues fulfilled" />
        <StatCard title="Dispatch Service Area" value={volunteerProfile?.city || 'Bengaluru'} icon="📍" color="#8b5cf6" subtitle={volunteerProfile?.serviceArea || 'Central & Indiranagar'} />
      </div>

      {/* Active Tasks Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Active Pickup & Delivery Tasks ({activeTasks.length})</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading assignments...
          </div>
        ) : activeTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
            <h3>No active delivery tasks pending</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              You are all caught up! When a donor or NGO assigns a delivery to you, it will appear right here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {activeTasks.map((task) => (
              <div key={task.id} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{task.foodName}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: '700' }}>
                      {task.quantity} {task.unit}
                    </div>
                  </div>
                  <Badge status={task.pickupStatus} />
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  {/* Pickup Route */}
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', color: '#065f46', marginBottom: '0.2rem' }}>
                      📍 1. PICKUP FROM: {task.donorOrganization || task.donorName}
                    </div>
                    <div>{task.pickupAddress}</div>
                    {task.donorPhone && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📞 {task.donorPhone}</div>}
                    {task.pickupTime && (
                      <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
                        ✓ Collected at: {new Date(task.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  {/* Delivery Route */}
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', color: '#1e40af', marginBottom: '0.2rem' }}>
                      🎯 2. DELIVER TO: {task.recipientOrganization}
                    </div>
                    <div>{task.recipientAddress}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Contact: {task.recipientContactPerson} {task.recipientPhone ? `(📞 ${task.recipientPhone})` : ''}
                    </div>
                  </div>
                </div>

                {/* Action Buttons based on status */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                  {task.pickupStatus === 'PENDING' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAcceptAssignment(task.id)}
                    >
                      Accept Assignment
                    </button>
                  )}

                  {task.pickupStatus === 'ACCEPTED' && (
                    <button
                      className="btn btn-amber btn-sm"
                      onClick={() => openStatusModal(task, 'COLLECT')}
                    >
                      Mark Food Collected
                    </button>
                  )}

                  {task.pickupStatus === 'COLLECTED' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openStatusModal(task, 'DELIVER')}
                    >
                      Mark Food Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed History Section */}
      <div>
        <h2 style={{ marginBottom: '1rem' }}>Completed Rescue History ({completedTasks.length})</h2>

        {completedTasks.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No completed runs yet.
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Food Batch</th>
                    <th>Donor</th>
                    <th>Recipient NGO</th>
                    <th>Delivered At</th>
                    <th>Field Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <strong>{t.foodName}</strong> ({t.quantity} {t.unit})
                      </td>
                      <td>{t.donorOrganization}</td>
                      <td>{t.recipientOrganization}</td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {t.completedAt ? new Date(t.completedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Confirmed'}
                      </td>
                      <td style={{ fontSize: '0.85rem', maxWidth: '250px' }}>
                        {t.deliveryNotes || t.pickupNotes || 'Successfully delivered'}
                      </td>
                      <td>
                        <Badge status="DELIVERED" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal (Collect / Deliver) */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={statusAction === 'COLLECT' ? 'Confirm Food Collection' : 'Confirm Food Safe Delivery'}
      >
        {selectedAssignment && (
          <form onSubmit={handleStatusSubmit}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div><strong>Item:</strong> {selectedAssignment.foodName} ({selectedAssignment.quantity} {selectedAssignment.unit})</div>
              {statusAction === 'COLLECT' ? (
                <div><strong>Collection Point:</strong> {selectedAssignment.pickupAddress}</div>
              ) : (
                <div><strong>Delivery Target:</strong> {selectedAssignment.recipientOrganization} ({selectedAssignment.recipientAddress})</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {statusAction === 'COLLECT' ? 'Pickup Notes & Packaging Verification *' : 'Delivery Notes & Sign-off Details *'}
              </label>
              <textarea
                rows={3}
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter field condition, handoff details..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedAssignment(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingStatus}
              >
                {submittingStatus ? 'Submitting...' : statusAction === 'COLLECT' ? 'Confirm Collection' : 'Confirm Delivery'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
