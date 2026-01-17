import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { useDevice } from './hooks/useDevice';

// Pages - matching sitemap
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Player from './pages/Player';
import Dashboard from './pages/Dashboard';
import Reflection from './pages/Reflection';
import Task from './pages/Task';
import Pricing from './pages/Pricing';
import ProfilePage from './pages/ProfilePage';
import Library from './pages/Library';
import Journey from './pages/Journey';
import DayView from './pages/DayView';

const AppContent: React.FC = () => {
  const { user } = useUser();
  const device = useDevice();

  // Apply dark mode class for Tailwind dark: variant support
  const darkModeClass = user.nightMode ? 'dark' : '';

  // Responsive container widths
  const containerWidth = device.isMobile
    ? 'w-full'
    : device.isTablet
      ? 'w-full max-w-[768px] mx-auto'
      : 'w-full max-w-[1200px] mx-auto'; // Desktop: max-width with centering

  return (
    <div className={`${darkModeClass} w-full min-h-screen`}>
      <div className={`${containerWidth} min-h-screen bg-[#F5F7F4] dark:bg-[#0B1121] text-[#2C3E35] dark:text-[#CBD5E1] font-['Epilogue'] relative transition-colors duration-300`}>
        <Routes>
          {/* ===================== */}
          {/* SITEMAP ROUTES */}
          {/* ===================== */}

          {/* Authentication */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Main App - Sitemap Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/daily-session" element={<Player />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Reflection />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* 30-Day Journey */}
          <Route path="/journey" element={<Journey />} />
          <Route path="/day/:dayNum" element={<DayView />} />

          {/* Additional Pages */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/task" element={<Task />} />
          <Route path="/library" element={<Library />} />

          {/* Legacy routes - redirect */}
          <Route path="/player" element={<Navigate to="/daily-session" replace />} />
          <Route path="/reflection" element={<Navigate to="/journal" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;