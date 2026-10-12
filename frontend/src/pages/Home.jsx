import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';

export const Home = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFoodDonated: 0,
    totalFoodRescued: 0,
    totalDonors: 0,
    totalNgos: 0,
    totalVolunteers: 0
  });
  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const donationsRes = await apiClient.get('/donations?status=AVAILABLE');
        if (donationsRes.data) {
          setAvailableDonations(donationsRes.data.slice(0, 6));
        }

        // Fetch public / admin stats
        const statsRes = await apiClient.get('/admin/stats').catch(() => null);
        if (statsRes && statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.warn('Error loading home data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-badge-pill">
              <span className="pulse-dot" />
              <span>Live Redistribution Network · Active in 12 Zones</span>
            </div>

            <h1>
              Rescue Surplus Food. <br />
              <span className="gradient-text">Feed Communities.</span> <br />
              Zero Waste.
            </h1>

            <p>
              A high-precision coordination network connecting commercial food donors, certified hunger-relief non-profits, and volunteer dispatchers to safely redistribute wholesome surplus food in real time.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('browse')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Explore Available Food
              </button>

              {!user ? (
                <>
                  <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('register')}>
                    Register Organization
                  </button>
                  <button className="btn btn-ghost btn-lg" style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => onNavigate('login')}>
                    Sign In →
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-amber btn-lg"
                  onClick={() => {
                    if (user.role === 'DONOR') onNavigate('donor-dashboard');
                    else if (user.role === 'NGO') onNavigate('ngo-dashboard');
                    else if (user.role === 'VOLUNTEER') onNavigate('volunteer-dashboard');
                    else if (user.role === 'ADMIN') onNavigate('admin-dashboard');
                  }}
                >
                  Open Dashboard ({user.role}) →
                </button>
              )}
            </div>

            {/* Quick trust tags */}
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2rem', flexWrap: 'wrap', fontSize: '0.825rem', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> FSSAI Compliant
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> Verified Cold-Chain
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: '#10b981' }}>✓</span> Real-Time GPS Tracking
              </span>
            </div>
          </div>

          {/* Hero Live Logistics Preview Widget */}
          <div className="hero-dispatch-widget">
            <div className="dispatch-widget-header">
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: '700' }}>
                  Live Active Dispatch #FR-9042
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginTop: '0.15rem' }}>
                  Banquet Lunch Surplus (140 Meals)
                </div>
              </div>
              <span className="badge badge-in-transit" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                <span className="badge-dot" /> In Transit
              </span>
            </div>

            <div className="dispatch-route">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Donor</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f8fafc' }}>Grand Chola Banquets</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Domlur / Indiranagar</div>
              </div>
              <div style={{ color: '#10b981', fontSize: '1.2rem', padding: '0 0.5rem' }}>➔</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Recipient</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f8fafc' }}>Akshaya Seva Shelter</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Koramangala 4th Block</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.65rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Dispatcher</div>
                <div style={{ fontWeight: '600', color: '#ffffff' }}>🚴 Arjun Patel (1.2 km away)</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.65rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Est. Delivery</div>
                <div style={{ fontWeight: '600', color: '#10b981' }}>⏱️ 14 mins remaining</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>Route Progress</span>
                <span style={{ fontWeight: '700', color: '#34d399' }}>72% Handover</span>
              </div>
              <div className="dispatch-progress-bar">
                <div className="dispatch-progress-fill" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Counter Strip */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)', color: '#059669' }}>
            🍲
          </div>
          <div className="stat-info">
            <h4>Surplus Meals Pledged</h4>
            <div className="stat-value">{stats.totalFoodDonated > 0 ? `${stats.totalFoodDonated} Units` : '150+ Servings'}</div>
            <div className="stat-trend">↑ High Impact</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}>
            🚚
          </div>
          <div className="stat-info">
            <h4>Rescued & Delivered</h4>
            <div className="stat-value">{stats.totalFoodRescued > 0 ? `${stats.totalFoodRescued} Units` : '100% Verified'}</div>
            <div className="stat-trend" style={{ color: '#0284c7' }}>↑ Safe Redistribution</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#d97706' }}>
            🏢
          </div>
          <div className="stat-info">
            <h4>Commercial Donors</h4>
            <div className="stat-value">{stats.totalDonors > 0 ? stats.totalDonors : 'Active'}</div>
            <div className="stat-trend" style={{ color: '#d97706' }}>Banquets & Caterers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            🤝
          </div>
          <div className="stat-info">
            <h4>Partner NGOs & Shelters</h4>
            <div className="stat-value">{stats.totalNgos > 0 ? stats.totalNgos : 'Verified'}</div>
            <div className="stat-trend" style={{ color: '#6366f1' }}>Community Kitchens</div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-role" style={{ marginBottom: '0.5rem' }}>Automated Pipeline</span>
          <h2>How The Food Rescue Coordination Works</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            A transparent, audit-ready workflow built to ensure food safety, zero loss, and rapid dispatch.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="card card-hover">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                01
              </div>
              <span style={{ fontSize: '1.4rem' }}>👨‍🍳</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>1. Donor Lists Food</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Hotels, corporate cafeterias, or banquets list excess wholesome food in seconds with portions, allergens, and strict pickup windows.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                02
              </div>
              <span style={{ fontSize: '1.4rem' }}>🤝</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>2. NGO Claims Portions</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Nearby vetted shelters receive instantaneous notifications and request portions with concurrency protection against overselling.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                03
              </div>
              <span style={{ fontSize: '1.4rem' }}>🚴</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>3. Volunteer Dispatch</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Trained volunteer couriers receive the optimal pickup route, inspect packaging & temperature adherence, and begin transit.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                04
              </div>
              <span style={{ fontSize: '1.4rem' }}>✅</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>4. Confirmed Handover</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Food is delivered to the charity shelter with verified digital receipts, tracking notes, and full chain-of-custody audit records.
            </p>
          </div>
        </div>
      </section>

      {/* Live Available Food Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
              <span className="badge-dot" /> Real-Time Surplus Feed
            </span>
            <h2>Fresh Food Listings Ready For Rescue</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Active surplus batches available right now across verified pickup hubs
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('browse')}>
            View All Batches ({availableDonations.length}) →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍲</div>
            Loading active food donations...
          </div>
        ) : availableDonations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
            <h3>No Food Batches Currently Listed</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              All current surplus batches have been safely claimed and dispatched.
            </p>
            <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => onNavigate('browse')}>
              Explore Past Batches
            </button>
          </div>
        ) : (
          <div className="donations-grid">
            {availableDonations.map((d) => (
              <div key={d.id} className="donation-card">
                <div className="donation-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {d.categoryName || 'Cooked Meals'}
                    </span>
                    <Badge status={d.status} />
                  </div>

                  <h3 className="donation-card-title">{d.foodName}</h3>
                  <div className="donation-card-meta">
                    <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      📍 {d.city} ({d.area || 'Central'})
                    </span>
                    {d.vegetarian && (
                      <span style={{ fontSize: '0.8rem', background: '#ecfdf5', color: '#065f46', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700', border: '1px solid #a7f3d0' }}>
                        🌿 Vegetarian
                      </span>
                    )}
                  </div>

                  <p className="donation-card-desc">
                    {d.description || 'Nutritious surplus meal freshly prepared in commercial kitchen.'}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Remaining Portion:</span>
                      <strong style={{ color: 'var(--primary)' }}>{d.remainingQuantity} / {d.quantity} {d.unit}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>⏱️ Pickup Deadline:</span>
                      <strong>{new Date(d.pickupDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong>
                    </div>
                  </div>
                </div>

                <div className="donation-card-footer">
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    🏢 {d.donorOrganization || 'Registered Donor'}
                  </span>
                  <button className="btn btn-primary btn-sm" onClick={() => onNavigate('browse')}>
                    Request Portions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Safety & Compliance Framework */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              🌡️
            </div>
            <h3>Temperature & Food Hygiene</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Strict adherence to hot-holding (&gt;65°C) and cold-chain (&lt;5°C) guidelines with tamper-evident packaging validation before handover.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)' }}>
              🛡️
            </div>
            <h3>Verified 501(c)(3) & 80G Charities</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Every receiving NGO undergoes rigorous vetting, ensuring surplus food only reaches legitimate shelters, children's homes, and community feeding centers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              📊
            </div>
            <h3>ESG Impact & Audit Certificates</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Commercial donors receive automated digital impact metrics, CO₂ landfill emission diversion reports, and auditable donation receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 'var(--radius-xl)', padding: '3.5rem 2.5rem', color: '#ffffff', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 style={{ color: '#ffffff', fontSize: '2.25rem', marginBottom: '1rem' }}>
            Ready to Help Eliminate Food Insecurity?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join hundreds of banquet hotels, restaurants, food banks, and volunteers working together to make hunger history.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('register')}>
              Join The Network Today
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('browse')}>
              Browse Food Donations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
