import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MentamindBranding from './MentamindBranding';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Updated nav items matching user's reference design
  const navItems = [
    { path: '/home', icon: 'wb_sunny', label: 'Today' },
    { path: '/daily-session', icon: 'spa', label: 'Practice' },
    { path: '/journey', icon: 'map', label: 'Journey' },
    { path: '/profile', icon: 'person', label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Color classes with dark mode support
  const getColors = (path: string) => {
    const active = isActive(path);
    return active
      ? 'text-[#3D6B5B] dark:text-[#4FD1C5]'
      : 'text-gray-400 dark:text-gray-600 hover:text-[#3D6B5B] dark:hover:text-[#4FD1C5]';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-[1200px] mx-auto pb-6 pt-2 px-6 bg-white/85 dark:bg-[#151E32]/90 backdrop-blur-xl border-t border-white/20 dark:border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] transition-colors duration-300">
      <div className="flex justify-between items-end">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`group flex flex-1 flex-col items-center justify-end gap-1.5 p-2 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors ${getColors(item.path)}`}
          >
            <span
              className={`material-symbols-outlined text-[28px] font-light transition-transform group-hover:scale-110 ${isActive(item.path) ? 'filled' : ''}`}
              style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : {}}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-semibold tracking-wide ${isActive(item.path) ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}

        {/* Center Mentamind Logo */}
        <MentamindBranding variant="nav" />

        {navItems.slice(2).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`group flex flex-1 flex-col items-center justify-end gap-1.5 p-2 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors ${getColors(item.path)}`}
          >
            <span
              className={`material-symbols-outlined text-[28px] font-light transition-transform group-hover:scale-110 ${isActive(item.path) ? 'filled' : ''}`}
              style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : {}}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-semibold tracking-wide ${isActive(item.path) ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;