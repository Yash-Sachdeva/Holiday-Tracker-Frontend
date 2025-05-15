import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Home, Calendar, Settings, HelpCircle } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { path: '/employee-dashboard', icon: <Home size={20} />, name: 'Dashboard', exact: true },
    { path: '/employee-dashboard/holidays', icon: <Calendar size={20} />, name: 'Holidays' },
    { path: '/employee-dashboard/settings', icon: <Settings size={20} />, name: 'Settings' },
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
        {!isCollapsed && <p>© 2024 Holiday Manager</p>}
      </div>
    </aside>
  );
};

export default Sidebar;


