import { useState, useEffect } from 'react';
import '../styles/DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hrName, setHrName] = useState('HR Manager'); // Default value

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees under the logged-in HR
      const employeesResponse = await fetch('http://localhost:8080/auth/all/employee', {
        credentials: 'include'
      });
      if (!employeesResponse.ok) throw new Error('Failed to fetch employees');
      const employeesData = await employeesResponse.json();

      // Get HR session info
      const sessionResponse = await fetch('http://localhost:8080/auth/session', {
        credentials: 'include'
      });
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.text();
        if (sessionData) {
          setHrName(sessionData);
        }
      }

      setStats({
        totalEmployees: employeesData.length
      });
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-home">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, {hrName}</h2>
          <p>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon employees">👥</div>
          <div className="card-content">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats.totalEmployees}</p>
          </div>
        </div>
      </div>

      {/* You can remove or modify these sections as needed */}
      <div className="dashboard-sections">
        <div className="section recent-activities">
          <h3>Quick Actions</h3>
          <div className="activities-list">
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-details">
                <p className="activity-title">
                  <strong>Add New Employee</strong>
                </p>
                <p className="activity-meta">
                  Register a new employee in the system
                </p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📋</div>
              <div className="activity-details">
                <p className="activity-title">
                  <strong>View All Employees</strong>
                </p>
                <p className="activity-meta">
                  See complete employee list
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="section department-stats">
          <h3>System Overview</h3>
          <div className="department-grid">
            <div className="department-card">
              <h4>Employee Management</h4>
              <div className="dept-stats">
                <div className="dept-stat">
                  <span className="label">Total Employees</span>
                  <span className="value">{stats.totalEmployees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;





