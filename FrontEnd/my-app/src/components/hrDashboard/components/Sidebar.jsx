import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/hr-dashboard', icon: '🏠', name: 'Dashboard', exact: true },
    { path: '/hr-dashboard/employees', icon: '👥', name: 'Employees' },
    { path: '/hr-dashboard/holidays', icon: '🎉', name: 'Holidays' }
  ];

  return (
    <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
            title={isCollapsed ? item.name : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{!isCollapsed && item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && <p>© 2024 HR System</p>}
      </div>
    </aside>
  );
};

export default Sidebar;



