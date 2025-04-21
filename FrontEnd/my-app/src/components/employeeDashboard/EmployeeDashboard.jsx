import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, userRole, checkSession } = useAuth();
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    clientName: '',
    age:'',
    designation:''
  });
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidayDetails, setHolidayDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated || userRole !== 'EMPLOYEE') {
        await checkSession();
        if (!isAuthenticated || userRole !== 'EMPLOYEE') {
          navigate('/employee-login');
        }
      }
    };
    
    verifyAuth();
    fetchUserData();  // This will trigger the userData update, which will then trigger fetchHolidays

    const sessionInterval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(sessionInterval);
  }, [isAuthenticated, userRole, navigate, checkSession]);

  useEffect(() => {
    if (holidays.length) {
      const today = new Date();
      const upcoming = holidays
        .filter(h => new Date(h.holidayDate) >= today)
        .sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate))
        .slice(0, 3);
      setUpcomingHolidays(upcoming);
    }
  }, [holidays]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/auth/profile/employee`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  useEffect(() => {
    if (userData && userData.clientName) {
      fetchHolidays();
    }
  }, [userData.clientName]);

  const fetchHolidays = async () => {
    try {
      if (!userData.clientName) {
        console.log('Client name not available yet');
        return;
      }

      const encodedClientName = encodeURIComponent(userData.clientName);

      const response = await fetch(`http://localhost:8081/holiday/get/${encodedClientName}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setHolidays(data);
        
        const eventsData = data.map(holiday => ({
          id: holiday.holidayId,
          type: 'holiday',
          title: holiday.name,
          date: new Date(holiday.holidayDate),
          description: holiday.description
        }));
        setEvents(eventsData);
      } else {
        throw new Error('Failed to fetch holidays');
      }
    } catch (error) {
      console.error('Error fetching holidays:', error); // Debug log
      setError('Failed to fetch holidays');
      setHolidays([]);
      setEvents([]);
    }
  };

  const getHolidayId = async (clientId, holidayDate) => {
    try {
      const response = await fetch(
        `http://localhost:8081/holiday/holidayid?clientId=${clientId}&holidayDate=${holidayDate}`,
        {
          credentials: 'include'
        }
      );
      
      if (response.ok) {
        const holidayId = await response.json();
        return holidayId;
      }
    } catch (error) {
      setError('Failed to fetch holiday ID');
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/logout/employee', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        logout();
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Network error during logout. Please try again.');
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateString = date.toDateString();
    const isToday = new Date().toDateString() === dateString;
    const holiday = holidays.find(h => new Date(h.holidayDate).toDateString() === dateString);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    if (holiday) return 'holiday-tile';
    if (isToday) return 'today-tile';
    if (isWeekend) return 'weekend-tile';
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateEvents = events.filter(
      event => event.date.toDateString() === date.toDateString()
    );
    
    if (dateEvents.length > 0) {
      return (
        <div className="event-indicator">
          {dateEvents.map(event => (
            <div key={event.id} className={`indicator ${event.type}`} title={event.title}></div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDateClick = (date) => {
    const holiday = holidays.find(h => 
      new Date(h.holidayDate).toDateString() === date.toDateString()
    );
    setSelectedDate(date);
    setHolidayDetails(holiday);
  };

  if (!isAuthenticated || userRole !== 'EMPLOYEE') {
    return null;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-profile">
          <div className="profile-image">
            <img src="/dp.jpeg" alt="Profile" />
          </div>
          <h2>{userData.name}</h2>
          <p className="user-title">{userData.position}</p>
        </div>

        <div className="user-info-section">
          <div className="info-item">
            <label>Email</label>
            <span>{userData.email}</span>
          </div>
          <div className="info-item">
            <label>Name</label>
            <span>{userData.name}</span>
          </div>
          <div className="info-item">
            <label>Client Name</label>
            <span>{userData.clientName}</span>
          </div>
          <div className="info-item">
            <label>Designation</label>
            <span>{userData.designation}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="welcome-message">Welcome back, {userData.name}!</p>
        </div>

        <div className="dashboard-grid">
          <div className="calendar-section">
            <div className="calendar-card">
              <div className="card-header">
                <h2>Company Calendar</h2>
                <div className="calendar-legend">
                  <span className="legend-item"><span className="dot holiday-dot"></span> Holiday</span>
                  <span className="legend-item"><span className="dot today-dot"></span> Today</span>
                  <span className="legend-item"><span className="dot weekend-dot"></span> Weekend</span>
                </div>
              </div>
              
              <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                tileClassName={tileClassName}
                tileContent={tileContent}
                formatMonthYear={(locale, date) => 
                  date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
                }
                nextLabel={<span className="calendar-nav">›</span>}
                prevLabel={<span className="calendar-nav">‹</span>}
                next2Label={<span className="calendar-nav">»</span>}
                prev2Label={<span className="calendar-nav">«</span>}
                showNeighboringMonth={false}
                className="custom-calendar"
              />
            </div>
          </div>

          <div className="date-details-section">
            <div className="date-details-card">
              <h3>Selected Date</h3>
              <div className="selected-date">
                <div className="date-number">{selectedDate.getDate()}</div>
                <div className="date-info">
                  <span className="date-month">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long' })}
                  </span>
                  <span className="date-year">{selectedDate.getFullYear()}</span>
                </div>
              </div>

              {holidayDetails ? (
                <div className="holiday-details">
                  <div className="holiday-badge">Holiday</div>
                  <h4>{holidayDetails.name}</h4>
                  <p>{holidayDetails.description}</p>
                </div>
              ) : (
                <p className="no-events">No events on this date</p>
              )}
            </div>

            <div className="upcoming-holidays-card">
              <h3>Upcoming Holidays</h3>
              {upcomingHolidays.length > 0 ? (
                <ul className="upcoming-list">
                  {upcomingHolidays.map((holiday) => (
                    <li key={holiday.holidayId} className="upcoming-item">
                      <div className="upcoming-date">
                        {new Date(holiday.holidayDate).toLocaleDateString('en-US', { 
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                      <div className="upcoming-details">
                        <strong>{holiday.name}</strong>
                        <span>{holiday.description}</span>
                        <span>
                          {new Date(holiday.holidayDate).toLocaleDateString('en-US', { 
                            weekday: 'long' 
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-events">No upcoming holidays</p>
              )}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </main>
    </div>
  );
};

export default EmployeeDashboard;







