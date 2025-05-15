import { useState, useEffect } from 'react';
import '../styles/HolidaysPage.css';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const HolidaysPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({ clientName: '' });
  const [filterType, setFilterType] = useState('all'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.clientName) {
      fetchHolidays();
    }
  }, [userData.clientName]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/emps/employee/profile`, {
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

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const encodedClientName = encodeURIComponent(userData.clientName);
      const response = await fetch(`http://localhost:8000/hs/holiday/get/${encodedClientName}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setHolidays(data);
      } else {
        throw new Error('Failed to fetch holidays');
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setError('Failed to fetch holidays');
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredHolidays = () => {
    const today = new Date();
    
    switch(filterType) {
      case 'upcoming':
        return holidays.filter(h => new Date(h.holidayDate) >= today)
          .sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate));
      case 'past':
        return holidays.filter(h => new Date(h.holidayDate) < today)
          .sort((a, b) => new Date(b.holidayDate) - new Date(a.holidayDate));
      default:
        return [...holidays].sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate));
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  if (loading) return <div className="holidays-loading">Loading holidays...</div>;
  if (error) return <div className="holidays-error">{error}</div>;

  const filteredHolidays = getFilteredHolidays();

  return (
    <div className="holidays-page-container">
      <div className="holidays-header">
        <h1>Company Holidays</h1>
        <p className="holidays-subtitle">Holidays for {userData.clientName}</p>
      </div>

      <div className="holidays-filter">
        <button 
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Holidays
        </button>
        <button 
          className={`filter-btn ${filterType === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilterType('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`filter-btn ${filterType === 'past' ? 'active' : ''}`}
          onClick={() => setFilterType('past')}
        >
          Past
        </button>
      </div>

      <div className="holidays-stats">
        <div className="stat-card">
          <div className="stat-icon upcoming-icon">
            <CalendarIcon size={20} />
          </div>
          <div className="stat-content">
            <h4>Total Holidays</h4>
            <p>{holidays.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon upcoming-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <h4>Upcoming Holidays</h4>
            <p>{holidays.filter(h => isUpcoming(h.holidayDate)).length}</p>
          </div>
        </div>
      </div>

      <div className="holidays-grid">
        {filteredHolidays.length > 0 ? (
          filteredHolidays.map(holiday => (
            <div 
              key={holiday.holidayId} 
              className={`holiday-card ${isUpcoming(holiday.holidayDate) ? 'upcoming' : 'past'}`}
            >
              <div className="holiday-date">
                {formatDate(holiday.holidayDate)}
              </div>
              <div className="holiday-content">
                <h3>{holiday.name}</h3>
                <p>{holiday.description}</p>
              </div>
              <div className="holiday-status">
                {isUpcoming(holiday.holidayDate) ? 'Upcoming' : 'Past'}
              </div>
            </div>
          ))
        ) : (
          <div className="no-holidays-message">
            No holidays found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidaysPage;