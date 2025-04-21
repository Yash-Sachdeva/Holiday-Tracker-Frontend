import { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Holidays.css';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidayDetails, setHolidayDetails] = useState(null);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);

  useEffect(() => {
    fetchUserHolidays();
  }, []);

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

  const fetchUserHolidays = async () => {
    try {
      setLoading(true);
      // First fetch the employee profile to get the client name
      const profileResponse = await fetch('http://localhost:8000/emps/employee/profile', {
        credentials: 'include'
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch employee profile');
      }

      const profileData = await profileResponse.json();
      
      // Then fetch holidays for that client
      const holidaysResponse = await fetch(
        `http://localhost:8000/hs/holiday/get/${encodeURIComponent(profileData.clientName)}`,
        {
          credentials: 'include'
        }
      );

      if (!holidaysResponse.ok) {
        throw new Error('Failed to fetch holidays');
      }

      const holidaysData = await holidaysResponse.json();
      setHolidays(holidaysData);
    } catch (error) {
      setError('Failed to fetch holidays. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateString = date.toDateString();
    const isToday = new Date().toDateString() === dateString;
    const holiday = holidays.find(h => new Date(h.holidayDate).toDateString() === dateString);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    let classes = [];
    if (holiday) classes.push('holiday-tile');
    if (isToday) classes.push('today-tile');
    if (isWeekend) classes.push('weekend-tile');
    
    return classes.join(' ');
  };

  const handleDateClick = date => {
    setSelectedDate(date);
    const holiday = holidays.find(
      h => new Date(h.holidayDate).toDateString() === date.toDateString()
    );
    setHolidayDetails(holiday);
  };

  if (loading) {
    return <div className="loading">Loading holidays...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="holidays-page">
      <div className="holidays-container">
        <div className="calendar-section">
          <h2>Holiday Calendar</h2>
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileClassName={tileClassName}
          />
        </div>

        <div className="holiday-details-section">
          <div className="selected-date-details">
            <h3>Selected Date</h3>
            <div className="date-display">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {holidayDetails ? (
              <div className="holiday-info">
                <div className="holiday-badge">Holiday</div>
                <h4>{holidayDetails.name}</h4>
                <p>{holidayDetails.description}</p>
              </div>
            ) : (
              <p className="no-holiday">No holiday on this date</p>
            )}
          </div>

          <div className="upcoming-holidays">
            <h3>Upcoming Holidays</h3>
            {upcomingHolidays.length > 0 ? (
              <ul className="upcoming-list">
                {upcomingHolidays.map(holiday => (
                  <li key={holiday.holidayId} className="upcoming-item">
                    <div className="date">
                      {new Date(holiday.holidayDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="details">
                      <strong>{holiday.name}</strong>
                      <span>{holiday.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-upcoming">No upcoming holidays</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holidays;