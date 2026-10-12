import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BrowseDonations } from './pages/BrowseDonations';
import { DonorDashboard } from './pages/DonorDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';

const AppContent = () => {
  const { user, login } = useAuth();
  const { showToast } = useNotification();
  const [currentPage, setCurrentPage] = useState('home');

  // Handle URL hash routing or initial route
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentPage(hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    window.location.hash = page;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'browse':
        return <BrowseDonations onNavigate={navigateTo} />;
      case 'login':
        return <Login onNavigate={navigateTo} />;
      case 'register':
        return <Register onNavigate={navigateTo} />;
      case 'profile':
        return user ? <ProfilePage /> : <Login onNavigate={navigateTo} />;
      case 'donor-dashboard':
        if (!user) return <Login onNavigate={navigateTo} />;
        if (user.role !== 'DONOR') {
          return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>Access Restricted</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                This section is reserved for verified Food Donors. Your current role is: <strong>{user.role}</strong>.
              </p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigateTo('home')}>
                Return Home
              </button>
            </div>
          );
        }
        return <DonorDashboard onNavigate={navigateTo} />;
      case 'ngo-dashboard':
        if (!user) return <Login onNavigate={navigateTo} />;
        if (user.role !== 'NGO') {
          return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>Access Restricted</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                This section is reserved for registered Relief NGOs. Your current role is: <strong>{user.role}</strong>.
              </p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigateTo('home')}>
                Return Home
              </button>
            </div>
          );
        }
        return <NgoDashboard onNavigate={navigateTo} />;
      case 'volunteer-dashboard':
        if (!user) return <Login onNavigate={navigateTo} />;
        if (user.role !== 'VOLUNTEER') {
          return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>Access Restricted</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                This section is reserved for Rescue Volunteers. Your current role is: <strong>{user.role}</strong>.
              </p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigateTo('home')}>
                Return Home
              </button>
            </div>
          );
        }
        return <VolunteerDashboard />;
      case 'admin-dashboard':
        if (!user) return <Login onNavigate={navigateTo} />;
        if (user.role !== 'ADMIN') {
          return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>Access Restricted</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                This section is reserved for System Administrators.
              </p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigateTo('home')}>
                Return Home
              </button>
            </div>
          );
        }
        return <AdminDashboard />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <main className="main-content">{renderPage()}</main>
      <Footer />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
