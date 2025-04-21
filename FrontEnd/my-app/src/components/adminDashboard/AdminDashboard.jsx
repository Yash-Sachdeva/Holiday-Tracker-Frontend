import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import HRManagement from './components/HRManagement';
import ClientManagement from './components/ClientManagement';
import MobileMenuToggle from './components/MobileMenuToggle';
import './styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className={`dashboard-main ${isMobileMenuOpen ? 'menu-open' : ''}`}>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="hr-management" element={<HRManagement />} />
            <Route path="client-management" element={<ClientManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
