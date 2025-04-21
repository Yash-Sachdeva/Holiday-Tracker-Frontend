import { useState, useEffect } from 'react';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState({
    attendanceStats: {
      present: 85,
      absent: 8,
      late: 5,
      halfDay: 2
    },
    leaveStats: {
      approved: 45,
      pending: 12,
      rejected: 8
    },
    departmentAttendance: [
      { department: 'HR', attendance: 95 },
      { department: 'IT', attendance: 88 },
      { department: 'Finance', attendance: 92 },
      { department: 'Marketing', attendance: 85 },
      { department: 'Operations', attendance: 90 }
    ],
    monthlyTrends: [
      { month: 'Jan', attendance: 92, leaves: 15 },
      { month: 'Feb', attendance: 88, leaves: 18 },
      { month: 'Mar', attendance: 90, leaves: 12 },
      { month: 'Apr', attendance: 85, leaves: 20 },
      { month: 'May', attendance: 87, leaves: 16 },
      { month: 'Jun', attendance: 91, leaves: 14 }
    ]
  });

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [selectedReport, setSelectedReport] = useState('attendance');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, selectedReport]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, fetch data from backend
      // const response = await fetch(`http://localhost:8080/api/reports/${selectedReport}?start=${dateRange.start}&end=${dateRange.end}`);
      // const data = await response.json();
      // setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    // Implement report generation/export logic
    console.log('Generating report...');
  };

  const renderAttendanceChart = () => {
    const { attendanceStats } = reportData;
    const total = Object.values(attendanceStats).reduce((a, b) => a + b, 0);
    
    return (
      <div className="chart attendance-chart">
        {Object.entries(attendanceStats).map(([key, value]) => (
          <div key={key} className="chart-bar">
            <div 
              className="bar-fill"
              style={{ 
                height: `${(value / total) * 100}%`,
                backgroundColor: getStatusColor(key)
              }}
            />
            <div className="bar-label">
              <span className="percentage">{((value / total) * 100).toFixed(1)}%</span>
              <span className="category">{key}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDepartmentChart = () => {
    return (
      <div className="chart department-chart">
        {reportData.departmentAttendance.map(dept => (
          <div key={dept.department} className="dept-bar">
            <div className="dept-info">
              <span className="dept-name">{dept.department}</span>
              <span className="dept-value">{dept.attendance}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${dept.attendance}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      present: '#2ecc71',
      absent: '#e74c3c',
      late: '#f1c40f',
      halfDay: '#3498db',
      approved: '#27ae60',
      pending: '#f39c12',
      rejected: '#c0392b'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <div className="report-controls">
          <div className="date-filters">
            <div className="filter-group">
              <label>From:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>To:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="report-type-select"
          >
            <option value="attendance">Attendance Report</option>
            <option value="leave">Leave Report</option>
            <option value="department">Department Report</option>
          </select>
          <button onClick={generateReport} className="generate-btn">
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="reports-content">
          <div className="report-cards">
            <div className="report-card">
              <h3>Overall Attendance Rate</h3>
              <p className="stat-value">92%</p>
              <p className="stat-change positive">↑ 2.5% from last month</p>
            </div>
            <div className="report-card">
              <h3>Leave Utilization</h3>
              <p className="stat-value">15%</p>
              <p className="stat-change negative">↓ 1.2% from last month</p>
            </div>
            <div className="report-card">
              <h3>Average Working Hours</h3>
              <p className="stat-value">7.8h</p>
              <p className="stat-change neutral">← No change</p>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-container">
              <h3>Attendance Distribution</h3>
              {renderAttendanceChart()}
            </div>
            <div className="chart-container">
              <h3>Department-wise Attendance</h3>
              {renderDepartmentChart()}
            </div>
          </div>

          <div className="trends-section">
            <h3>Monthly Trends</h3>
            <div className="trends-chart">
              {reportData.monthlyTrends.map(trend => (
                <div key={trend.month} className="trend-column">
                  <div className="trend-bars">
                    <div 
                      className="trend-bar attendance"
                      style={{ height: `${trend.attendance}%` }}
                    >
                      <span className="trend-value">{trend.attendance}%</span>
                    </div>
                    <div 
                      className="trend-bar leaves"
                      style={{ height: `${trend.leaves * 3}%` }}
                    >
                      <span className="trend-value">{trend.leaves}</span>
                    </div>
                  </div>
                  <span className="trend-label">{trend.month}</span>
                </div>
              ))}
            </div>
            <div className="trends-legend">
              <div className="legend-item">
                <span className="legend-color attendance"></span>
                <span>Attendance Rate</span>
              </div>
              <div className="legend-item">
                <span className="legend-color leaves"></span>
                <span>Leave Count</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;