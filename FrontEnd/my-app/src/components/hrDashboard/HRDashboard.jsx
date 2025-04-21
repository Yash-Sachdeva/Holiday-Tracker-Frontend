import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import EmployeeManagement from './components/EmployeeManagement';
import HolidayManagement from './components/HolidayManagement';
import MobileMenuToggle from './components/MobileMenuToggle';
import './styles/HRDashboard.css';

const HRDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const { logout, isAuthenticated, userRole, checkSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated || userRole !== 'HR') {
        await checkSession();
        if (!isAuthenticated || userRole !== 'HR') {
          navigate('/hr-login');
        }
      }
    };
    
    verifyAuth();

    const sessionInterval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(sessionInterval);
  }, [isAuthenticated, userRole, navigate, checkSession]);

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
      navigate('/hr-login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  if (!isAuthenticated || userRole !== 'HR') {
    return null;
  }

  return (
    <div className="hr-dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <MobileMenuToggle 
            isOpen={isMobileMenuOpen} 
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
          <h1>HR Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

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
            <Route path="/" element={<DashboardHome />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="holidays" element={<HolidayManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;







