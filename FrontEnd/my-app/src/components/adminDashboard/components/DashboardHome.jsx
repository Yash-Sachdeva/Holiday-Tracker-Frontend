import { useState, useEffect } from 'react';
import '../styles/DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalHRs: 0,
    totalEmployees: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [hrsResponse, employeesResponse, clientsResponse] = await Promise.all([
        fetch('http://localhost:8080/auth/admin/dashboard/total-hrs', {
          credentials: 'include'
        }),
        fetch('http://localhost:8080/auth/admin/dashboard/total-employees', {
          credentials: 'include'
        }),
        fetch('http://localhost:8080/auth/admin/dashboard/total-clients', {
          credentials: 'include'
        })
      ]);

      const [hrsData, employeesData, clientsData] = await Promise.all([
        hrsResponse.json(),
        employeesResponse.json(),
        clientsResponse.json()
      ]);

      setStats({
        totalHRs: hrsData,
        totalEmployees: employeesData,
        totalClients: clientsData
      });
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-home">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Admin Dashboard</h2>
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
          <div className="card-icon hrs">👥</div>
          <div className="card-content">
            <h3>Total HRs</h3>
            <p className="stat-number">{stats.totalHRs}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon employees">👤</div>
          <div className="card-content">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon clients">🏢</div>
          <div className="card-content">
            <h3>Total Clients</h3>
            <p className="stat-number">{stats.totalClients}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;