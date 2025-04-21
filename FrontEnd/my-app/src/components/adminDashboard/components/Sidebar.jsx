import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin-dashboard', icon: '📊', name: 'Dashboard', exact: true },
    { path: '/admin-dashboard/hr-management', icon: '👥', name: 'HR Management' },
    { path: '/admin-dashboard/client-management', icon: '🏢', name: 'Client Management' },
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
        {!isCollapsed && <p>© 2024 Admin Portal</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
