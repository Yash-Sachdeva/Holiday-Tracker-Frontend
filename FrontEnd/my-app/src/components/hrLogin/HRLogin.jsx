import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './HRLogin.css';

const HRLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, userRole } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (userRole === 'HR') {
      return <Navigate to="/hr-dashboard" />;
    } else if (userRole === 'ADMIN') {
      return <Navigate to="/admin-dashboard" />;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // First try HR login
      const hrResponse = await fetch('http://localhost:8080/auth/login/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const hrData = await hrResponse.text();

      if (hrResponse.ok && hrData === "Login successful!") {
        login('HR');
        navigate('/hr-dashboard');
        return;
      }

      // If HR login fails, try Admin login
      const adminResponse = await fetch('http://localhost:8080/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const adminData = await adminResponse.text();

      if (adminResponse.ok && adminData === "Admin login successful!") {
        login('ADMIN');
        navigate('/admin-dashboard');
        return;
      }

      // If both logins fail, show error
      setError('Invalid credentials. Please try again.');
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <button onClick={() => navigate('/')} className="back-button">
          ←
        </button>
        <h2>HR Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default HRLogin;



