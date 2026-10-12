import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const AdminDashboard = () => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verification Modal
  const [verifyingProfile, setVerifyingProfile] = useState(null);
  const [verifyType, setVerifyType] = useState('DONOR');
  const [verifyStatus, setVerifyStatus] = useState('VERIFIED');
  const [verifyComment, setVerifyComment] = useState('');
  const [submittingVerify, setSubmittingVerify] = useState(false);

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [submittingCategory, setSubmittingCategory] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        usersRes,
        donorsRes,
        ngosRes,
        volsRes,
        catsRes,
        donationsRes,
        requestsRes,
        assignRes
      ] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/users'),
        apiClient.get('/admin/donors'),
        apiClient.get('/admin/ngos'),
        apiClient.get('/admin/volunteers'),
        apiClient.get('/categories'),
        apiClient.get('/admin/donations'),
        apiClient.get('/admin/requests'),
        apiClient.get('/admin/assignments'),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (donorsRes.data) setDonors(donorsRes.data);
      if (ngosRes.data) setNgos(ngosRes.data);
      if (volsRes.data) setVolunteers(volsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (donationsRes.data) setDonations(donationsRes.data);
      if (requestsRes.data) setRequests(requestsRes.data);
      if (assignRes.data) setAssignments(assignRes.data);
    } catch (err) {
      showToast('Error loading admin control panel: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const toggleUserStatus = async (userObj) => {
    try {
      await apiClient.patch(`/admin/users/${userObj.id}/status`, {
        enabled: !userObj.enabled,
      });
      showToast(`User ${userObj.fullName} account ${userObj.enabled ? 'deactivated' : 'activated'}`, 'success');
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to update user status', 'error');
    }
  };

  const openVerifyModal = (profile, type) => {
    setVerifyingProfile(profile);
    setVerifyType(type);
    setVerifyStatus('VERIFIED');
    setVerifyComment('Verified business credentials and safety documentation.');
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verifyingProfile) return;

    setSubmittingVerify(true);
    try {
      await apiClient.post(`/admin/verify/${verifyType}/${verifyingProfile.id}`, {
        status: verifyStatus,
        comment: verifyComment,
      });
      showToast(`Verification status updated to: ${verifyStatus}`, 'success');
      setVerifyingProfile(null);
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Verification update failed', 'error');
    } finally {
      setSubmittingVerify(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    setSubmittingCategory(true);
    try {
      await apiClient.post('/categories', {
        name: categoryName,
        description: categoryDesc,
        active: true,
      });
      showToast('Food category created successfully', 'success');
      setShowCategoryModal(false);
      setCategoryName('');
      setCategoryDesc('');
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to create category', 'error');
    } finally {
      setSubmittingCategory(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Platform Administration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Supervise users, verify organization credentials, oversee categories, and monitor redistribution operations.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadAdminData}>
          🔄 Refresh Platform Data
        </button>
      </div>

      {/* Aggregate Platform Stats */}
      {stats && (
        <div className="stats-grid">
          <StatCard title="Total Platform Users" value={stats.totalUsers} icon="👥" color="#3b82f6" subtitle={`${stats.totalDonors} Donors, ${stats.totalNgos} NGOs`} />
          <StatCard title="Food Rescued (Delivered)" value={`${stats.totalFoodRescued} Units`} icon="🍲" color="#10b981" subtitle="Diverted from waste" />
          <StatCard title="Pending Verifications" value={stats.pendingDonorVerifications + stats.pendingNgoVerifications + stats.pendingVolunteerVerifications} icon="⏳" color="#f59e0b" subtitle="Awaiting review" />
          <StatCard title="Completed Deliveries" value={stats.completedDeliveries} icon="✅" color="#8b5cf6" subtitle={`Out of ${stats.totalAssignments} dispatches`} />
        </div>
      )}

      {/* Admin Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Verification Queue ({donors.filter(d => d.verificationStatus === 'PENDING').length + ngos.filter(n => n.verificationStatus === 'PENDING').length + volunteers.filter(v => v.verificationStatus === 'PENDING').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          All Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Food Categories ({categories.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'surveillance' ? 'active' : ''}`}
          onClick={() => setActiveTab('surveillance')}
        >
          Surveillance & Audit Trail
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          Loading administrative records...
        </div>
      ) : activeTab === 'overview' ? (
        /* Verification Queue Tab */
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Pending Donors */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h3>Donor Organizations Verification ({donors.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Contact Person</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <strong>{d.organizationName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.userEmail}</div>
                      </td>
                      <td>{d.contactPerson || d.userFullName}</td>
                      <td>{d.address}, {d.city}</td>
                      <td><Badge status={d.verificationStatus} /></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVerifyModal(d, 'DONOR')}
                        >
                          Review & Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending NGOs */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h3>NGOs & Kitchens Verification ({ngos.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>NGO Name</th>
                    <th>Type / Capacity</th>
                    <th>City / Service Area</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ngos.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <strong>{n.organizationName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.userEmail}</div>
                      </td>
                      <td>{n.organizationType} • Cap: {n.capacity}</td>
                      <td>{n.city} ({n.serviceArea || 'General'})</td>
                      <td><Badge status={n.verificationStatus} /></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVerifyModal(n, 'NGO')}
                        >
                          Review & Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Volunteers */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h3>Volunteers Verification ({volunteers.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Volunteer Name</th>
                    <th>City / Area</th>
                    <th>Availability</th>
                    <th>Verification</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <strong>{v.userFullName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.userEmail}</div>
                      </td>
                      <td>{v.city} ({v.serviceArea || 'Any'})</td>
                      <td><Badge status={v.availability} /></td>
                      <td><Badge status={v.verificationStatus} /></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVerifyModal(v, 'VOLUNTEER')}
                        >
                          Review & Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        /* Users Management Tab */
        <div className="card" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Account Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.fullName}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-role">{u.role}</span></td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`badge ${u.enabled ? 'badge-success' : 'badge-danger'}`}>
                        {u.enabled ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'ADMIN' && (
                        <button
                          className={`btn ${u.enabled ? 'btn-danger' : 'btn-primary'} btn-sm`}
                          onClick={() => toggleUserStatus(u)}
                        >
                          {u.enabled ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'categories' ? (
        /* Categories Tab */
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCategoryModal(true)}>
              + Add New Food Category
            </button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Active</th>
                    <th>Donations Listed</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.description || '—'}</td>
                      <td>
                        <span className={`badge ${c.active ? 'badge-success' : 'badge-danger'}`}>
                          {c.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td>{c.donationCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Platform Surveillance & Audit Trail */
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h3>Live Surplus Food Donations ({donations.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Food Batch</th>
                    <th>Donor</th>
                    <th>Qty / Remaining</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.foodName}</strong></td>
                      <td>{d.donorOrganization}</td>
                      <td>{d.remainingQuantity} / {d.quantity} {d.unit}</td>
                      <td><Badge status={d.status} /></td>
                      <td style={{ fontSize: '0.8rem' }}>{new Date(d.pickupDeadline).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h3>Food Requests & Fulfillment Log ({requests.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Requesting NGO</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Volunteer</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.foodName}</td>
                      <td>{r.organizationName}</td>
                      <td>{r.requestedQuantity} {r.unit}</td>
                      <td><Badge status={r.status} /></td>
                      <td>{r.volunteerName || 'Not Assigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Verification Review Modal */}
      <Modal
        isOpen={!!verifyingProfile}
        onClose={() => setVerifyingProfile(null)}
        title={`Verify ${verifyType} Profile`}
      >
        {verifyingProfile && (
          <form onSubmit={handleVerifySubmit}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div><strong>Name:</strong> {verifyingProfile.organizationName || verifyingProfile.userFullName}</div>
              <div><strong>User:</strong> {verifyingProfile.userEmail}</div>
              {verifyingProfile.address && <div><strong>Location:</strong> {verifyingProfile.address}, {verifyingProfile.city}</div>}
              {verifyingProfile.description && <div style={{ marginTop: '0.25rem' }}><em>"{verifyingProfile.description}"</em></div>}
            </div>

            <div className="form-group">
              <label className="form-label">Decision Status *</label>
              <select
                className="form-select"
                value={verifyStatus}
                onChange={(e) => setVerifyStatus(e.target.value)}
              >
                <option value="VERIFIED">✅ VERIFIED (Approved)</option>
                <option value="REJECTED">❌ REJECTED</option>
                <option value="PENDING">⏳ PENDING (Under Review)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Audit Notes / Feedback</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={verifyComment}
                onChange={(e) => setVerifyComment(e.target.value)}
                placeholder="License verified, hygiene check passed..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setVerifyingProfile(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingVerify}
              >
                {submittingVerify ? 'Updating...' : 'Save Decision'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* New Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Add New Food Category"
      >
        <form onSubmit={handleCreateCategory}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="form-input"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Frozen Meals, Chilled Dairy"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              placeholder="Detailed guidelines and storage requirements..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingCategory}
            >
              {submittingCategory ? 'Saving...' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
