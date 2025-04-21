import { useState, useEffect } from 'react';
import './AttendanceTracking.css';

const AttendanceTracking = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDepartment, setFilterDepartment] = useState('all');

  useEffect(() => {
    fetchAttendanceData();
  }, [filterDate, filterDepartment]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/attendance?date=${filterDate}&department=${filterDepartment}`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to fetch attendance data');
      const data = await response.json();
      setAttendanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      present: '#2ecc71',
      absent: '#e74c3c',
      late: '#f1c40f',
      'half-day': '#3498db'
    };
    return colors[status.toLowerCase()] || '#95a5a6';
  };

  const departments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations'];

  if (loading) return <div className="loading">Loading attendance data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="attendance-tracking">
      <div className="header">
        <h2>Attendance Tracking</h2>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="date-filter">Date:</label>
            <input
              type="date"
              id="date-filter"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="department-filter">Department:</label>
            <select
              id="department-filter"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept.toLowerCase()}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <h3>Present</h3>
          <p>{attendanceData.filter(a => a.status.toLowerCase() === 'present').length}</p>
        </div>
        <div className="stat-card">
          <h3>Absent</h3>
          <p>{attendanceData.filter(a => a.status.toLowerCase() === 'absent').length}</p>
        </div>
        <div className="stat-card">
          <h3>Late</h3>
          <p>{attendanceData.filter(a => a.status.toLowerCase() === 'late').length}</p>
        </div>
        <div className="stat-card">
          <h3>Half-day</h3>
          <p>{attendanceData.filter(a => a.status.toLowerCase() === 'half-day').length}</p>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map(record => (
              <tr key={record.id}>
                <td>
                  <div className="employee-info">
                    <span className="employee-name">{record.employeeName}</span>
                    <span className="employee-id">#{record.employeeId}</span>
                  </div>
                </td>
                <td>{record.department}</td>
                <td>{record.checkIn || '-'}</td>
                <td>{record.checkOut || '-'}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(record.status) }}
                  >
                    {record.status}
                  </span>
                </td>
                <td>{record.workingHours || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {attendanceData.length === 0 && (
        <div className="no-data">
          No attendance records found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AttendanceTracking;