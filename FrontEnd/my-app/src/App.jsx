import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import EmpLogin from './components/empLogin/EMPLogin';
import HRDashboard from './components/hrDashboard/HRDashboard';
import EmployeeDashboard from './components/employeeDashboard/EmployeeDashboard';
import AdminDashboard from './components/adminDashboard/AdminDashboard';

// Create HomePage as a separate component
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h1>Holiday Tracker</h1>
        </div>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/employee-login')} className="login-btn employee">
            <i className="button-icon">👥</i>
             Login
          </button>
        </nav>
      </header>

      <main className="home-main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Streamline Holiday Management</h2>
            <p>Transform your organization's leave management with our intuitive and powerful holiday tracking system</p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/employee-login')} className="cta-button primary">Get Started</button>
              <button className="cta-button secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="calendar-illustration">
              <div className="calendar-header">
                <div className="month">April 2025</div>
                <div className="calendar-toolbar">
                  <button className="calendar-toolbar-btn">⬅️</button>
                  <button className="calendar-toolbar-btn">➡️</button>
                </div>
              </div>
              
              <div className="calendar-weekdays">
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
                <div className="weekday">Sun</div>
              </div>
              
              <div className="calendar-body">
                <div className="calendar-day"><span className="day-number">1</span></div>
                <div className="calendar-day"><span className="day-number">2</span></div>
                <div className="calendar-day"><span className="day-number">3</span></div>
                <div className="calendar-day"><span className="day-number">4</span><div className="event-indicator event-pending"></div></div>
                <div className="calendar-day"><span className="day-number">5</span></div>
                <div className="calendar-day weekend"><span className="day-number">6</span></div>
                <div className="calendar-day weekend"><span className="day-number">7</span></div>
                
                <div className="calendar-day today"><span className="day-number">8</span></div>
                <div className="calendar-day"><span className="day-number">9</span></div>
                <div className="calendar-day"><span className="day-number">10</span><div className="event-indicator event-approved"></div></div>
                <div className="calendar-day"><span className="day-number">11</span></div>
                <div className="calendar-day"><span className="day-number">12</span></div>
                <div className="calendar-day weekend"><span className="day-number">13</span></div>
                <div className="calendar-day weekend"><span className="day-number">14</span></div>
                
                <div className="calendar-day"><span className="day-number">15</span></div>
                <div className="calendar-day holiday"><span className="day-number">16</span><div className="event-indicator event-holiday"></div></div>
                <div className="calendar-day holiday"><span className="day-number">17</span><div className="event-indicator event-holiday"></div></div>
                <div className="calendar-day"><span className="day-number">18</span></div>
                <div className="calendar-day"><span className="day-number">19</span><div className="event-indicator event-work"></div></div>
                <div className="calendar-day weekend"><span className="day-number">20</span></div>
                <div className="calendar-day weekend"><span className="day-number">21</span></div>
                
                <div className="calendar-day"><span className="day-number">22</span></div>
                <div className="calendar-day"><span className="day-number">23</span></div>
                <div className="calendar-day"><span className="day-number">24</span></div>
                <div className="calendar-day"><span className="day-number">25</span><div className="event-indicator event-pending"></div></div>
                <div className="calendar-day"><span className="day-number">26</span></div>
                <div className="calendar-day weekend"><span className="day-number">27</span></div>
                <div className="calendar-day weekend"><span className="day-number">28</span></div>
                
                <div className="calendar-day"><span className="day-number">29</span></div>
                <div className="calendar-day"><span className="day-number">30</span></div>
              </div>
              
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color legend-holiday"></div>
                  <span>Public Holiday</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-pending"></div>
                  <span>Pending</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-approved"></div>
                  <span>Approved</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Companies Trust Us</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-number">99.9%</div>
            <div className="stat-label">System Uptime</div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why Choose Holiday Tracker?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Leave Tracking</h3>
              <p>Automated tracking system with real-time updates and intelligent leave balance management</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Multi-Client Management</h3>
              <p>Efficiently manage holidays across multiple clients and departments with customizable policies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Advanced Analytics</h3>
              <p>Comprehensive insights into leave patterns, availability, and resource planning</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📆</div>
              <h3>Interactive Calendar</h3>
              <p>Visual calendar interface for easy scheduling and conflict prevention</p>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-quote">"Holiday Tracker has transformed how we manage employee leave. The dashboard is intuitive and our HR team saves hours each week."</div>
              <div className="testimonial-author">Sarah Johnson, HR Director</div>
              <div className="testimonial-company">TechCorp Inc.</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">"The analytics provided by this platform have helped us identify patterns and better allocate resources during holiday seasons."</div>
              <div className="testimonial-author">Michael Chen, Operations Manager</div>
              <div className="testimonial-company">Global Enterprises</div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to transform your leave management?</h2>
            <p>Join hundreds of companies already using Holiday Tracker</p>
            <button onClick={() => navigate('/hr-login')} className="cta-button primary large">Start Free Trial</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Holiday Tracker</h3>
            <p>Simplifying Leave Management</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li>Features</li>
                <li>Pricing</li>
                <li>Testimonials</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li>Documentation</li>
                <li>Help Center</li>
                <li>API Reference</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Holiday Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Main App component with routing
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employee-login" element={<EmpLogin />} />
          <Route path="/hr-dashboard/*" element={
            <ProtectedRoute userType="hr">
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard/*" element={ // Add the /* here
            <ProtectedRoute userType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee-dashboard/*" element={
            <ProtectedRoute userType="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
