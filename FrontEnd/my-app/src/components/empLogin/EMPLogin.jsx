import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EmpLogin.css';

const EmpLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, userRole } = useAuth();

  // Redirect if already authenticated as employee
  if (isAuthenticated && userRole === 'EMPLOYEE') {
    return <Navigate to="/employee-dashboard" />;
  }
  if (isAuthenticated && userRole === 'HR') {
    return <Navigate to="/hr-dashboard" />;
  }
  if (isAuthenticated && userRole === 'ADMIN') {
    return <Navigate to="/admin-dashboard" />;
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
      const form = new URLSearchParams();
      form.append('username', formData.email);
      form.append('password', formData.password);
  
      const response = await fetch('http://localhost:8000/as/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (response.ok && data.message === "Login successful") {
        const userRole = data.role;
        login(userRole); // from context
  
        if (userRole === 'EMPLOYEE') {
          navigate('/employee-dashboard');
        } else if (userRole === 'HR') {
          navigate('/hr-dashboard');
        } else if (userRole === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          setError("Unknown role. Access denied.");
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <button onClick={() => navigate('/')} className="back-button">
          ←
        </button>
        <h2>Welcome to the Holiday Portal!</h2>
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

export default EmpLogin;













































