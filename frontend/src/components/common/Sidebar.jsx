import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const employeeLinks = [
    { to: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/employee/attendance', label: 'My Attendance', icon: '📅' },
    { to: '/employee/profile', label: 'Profile', icon: '👤' },
  ];

  const managerLinks = [
    { to: '/manager/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/manager/attendance', label: 'All Attendance', icon: '📋' },
    { to: '/manager/calendar', label: 'Team Calendar', icon: '📅' },
    { to: '/manager/reports', label: 'Reports', icon: '📈' },
  ];

  const links = user.role === 'employee' ? employeeLinks : managerLinks;

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? user.role === 'manager' 
                        ? 'bg-primary-teal text-white shadow-md'
                        : 'bg-primary-blue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

