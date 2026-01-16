import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

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

  // Apply dark mode class for Tailwind dark: variant support
  const darkModeClass = user.nightMode ? 'dark' : '';

  return (
    <div className={`${darkModeClass} w-full h-full min-h-screen`}>
      <div className="w-full h-full min-h-screen bg-[#fafafa] dark:bg-[#0B1015] text-slate-900 dark:text-gray-100 font-['Epilogue'] mx-auto max-w-[480px] relative shadow-2xl overflow-hidden transition-colors duration-300">
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