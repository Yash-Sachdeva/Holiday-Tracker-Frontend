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







