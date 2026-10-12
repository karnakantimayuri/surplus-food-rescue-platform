import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Navbar = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  const getDashboardPage = () => {
    if (!user) return 'home';
    switch (user.role) {
      case 'DONOR': return 'donor-dashboard';
      case 'NGO': return 'ngo-dashboard';
      case 'VOLUNTEER': return 'volunteer-dashboard';
      case 'ADMIN': return 'admin-dashboard';
      default: return 'home';
    }
  };

  return (
    <header className="navbar">
        <div className="nav-wrapper">
          {/* Brand Logo */}
          <div className="brand" onClick={() => onNavigate('home')}>
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
                <path d="M12 6v6l4 2" />
                <path d="M7 16c2-2 6-2 8 0" />
              </svg>
            </div>
            <div>
              <div className="brand-text">Food<span>Rescue</span></div>
              <span className="brand-subtag">Redistribution Network</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="nav-links">
            <button
              className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </button>
            <button
              className={`nav-btn ${currentPage === 'browse' ? 'active' : ''}`}
              onClick={() => onNavigate('browse')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Browse Food
            </button>

            {user && (
              <button
                className={`nav-btn ${currentPage === getDashboardPage() ? 'active' : ''}`}
                onClick={() => onNavigate(getDashboardPage())}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="9" x="3" y="3" rx="1"/>
                  <rect width="7" height="5" x="14" y="3" rx="1"/>
                  <rect width="7" height="9" x="14" y="12" rx="1"/>
                  <rect width="7" height="5" x="3" y="16" rx="1"/>
                </svg>
                Dashboard
              </button>
            )}

            {user && user.role !== 'ADMIN' && (
              <button
                className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => onNavigate('profile')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profile
              </button>
            )}
          </nav>

          {/* Nav Actions */}
          <div className="nav-actions">
            {user ? (
              <>
                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ position: 'relative', padding: '0.5rem 0.75rem', borderRadius: '10px' }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    title="Notifications"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                    </svg>
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: 'var(--danger)',
                          color: 'white',
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          borderRadius: '999px',
                          padding: '1px 5px',
                          boxShadow: '0 2px 5px rgba(225, 29, 72, 0.4)',
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="notif-popover">
                      <div className="notif-header">
                        <strong>Live Alerts ({notifications.length})</strong>
                        {notifications.length > 0 && (
                          <button
                            style={{ background: 'transparent', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700' }}
                            onClick={markAllAsRead}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="notif-list">
                        {notifications.length === 0 ? (
                          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📭</div>
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`notif-item ${!n.read ? 'unread' : ''}`}
                              onClick={() => !n.read && markAsRead(n.id)}
                            >
                              <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{n.title}</div>
                              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                {n.message}
                              </div>
                              <div className="notif-time">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Pill */}
                <div className="user-profile-pill">
                  <div className="user-avatar-circle">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <span style={{ display: 'block', lineHeight: 1.2 }}>{user.fullName}</span>
                    <span className="badge badge-role" style={{ padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}>{user.role}</span>
                  </div>
                </div>

                <button className="btn btn-secondary btn-sm" onClick={logout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('login')}>
                  Sign In
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('register')}>
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>
  );
};
