import { useState, useEffect } from 'react';
import '../styles/Holidays.css';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allUpcomingHolidays, setAllUpcomingHolidays] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    fetchUserHolidays();
  }, []);

  useEffect(() => {
    if (holidays.length) {
      const today = new Date();
      const upcoming = holidays
        .filter(h => new Date(h.holidayDate) >= today)
        .sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate));
      
      setAllUpcomingHolidays(upcoming);
      setVisibleIndex(0); // reset to first when list updates
    }
  }, [holidays]);

  const fetchUserHolidays = async () => {
    try {
      setLoading(true);
      const profileResponse = await fetch('http://localhost:8000/emps/employee/profile', {
        credentials: 'include'
      });

      if (!profileResponse.ok) throw new Error('Failed to fetch employee profile');
      const profileData = await profileResponse.json();

      const holidaysResponse = await fetch(
        `http://localhost:8000/hs/holiday/get/${encodeURIComponent(profileData.clientName)}`,
        { credentials: 'include' }
      );

      if (!holidaysResponse.ok) throw new Error('Failed to fetch holidays');
      const holidaysData = await holidaysResponse.json();

      setHolidays(holidaysData);
    } catch (error) {
      setError('Failed to fetch holidays. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (visibleIndex > 0) {
      setVisibleIndex(visibleIndex - 1);
    }
  };

  const handleNext = () => {
    if (visibleIndex < allUpcomingHolidays.length - 1) {
      setVisibleIndex(visibleIndex + 1);
    }
  };

  const isPreviousDisabled = visibleIndex === 0;
  const isNextDisabled = visibleIndex >= allUpcomingHolidays.length - 1;

  if (loading) {
    return <div className="loading">Loading holidays...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const currentHoliday = allUpcomingHolidays[visibleIndex];

  return (
      <div className="upcoming-holidays">
        <h2>Upcoming Holiday</h2>

        {currentHoliday ? (
          <div className="holiday-card">
            <div className="date">
              {new Date(currentHoliday.holidayDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="details">
              <strong>{currentHoliday.name}</strong>
              <p>{currentHoliday.description}</p>
            </div>
          </div>
        ) : (
          <p className="no-upcoming">No upcoming holidays</p>
        )}

        <div className="navigation-controls">
          <button onClick={handlePrevious} disabled={isPreviousDisabled} className="nav-button">
            Previous
          </button>
          <button onClick={handleNext} disabled={isNextDisabled} className="nav-button">
            Next
          </button>
        </div>

        {currentHoliday && (
          <div className="holidays-pagination">
            Showing {visibleIndex + 1} of {allUpcomingHolidays.length} upcoming holidays
          </div>
        )}
      </div>
  );
};

export default Holidays;
