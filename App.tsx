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
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />

          {/* Main App - Sitemap Pages */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/programs" element={
            <ProtectedRoute>
              <Programs />
            </ProtectedRoute>
          } />
          <Route path="/daily-session" element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <Reflection />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          } />

          {/* 30-Day Journey */}
          <Route path="/journey" element={
            <ProtectedRoute>
              <Journey />
            </ProtectedRoute>
          } />
          <Route path="/day/:dayNum" element={
            <ProtectedRoute>
              <DayView />
            </ProtectedRoute>
          } />

          {/* Additional Pages */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/task" element={
            <ProtectedRoute>
              <Task />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          } />

          {/* Legacy routes - redirect */}
          <Route path="/player" element={<Navigate to="/daily-session" replace />} />
          <Route path="/reflection" element={<Navigate to="/journal" replace />} />
        </Routes>
      </div>
    </div>
  );
};

import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F4] dark:bg-[#0B1121]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#37a49f] to-[#2b5664] flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-white text-[32px]">self_improvement</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;