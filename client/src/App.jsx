import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import CanvasPage from './pages/CanvasPage';

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
              <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
              <Route path="/signup" element={<RedirectIfAuth><SignupPage /></RedirectIfAuth>} />
              
              <Route path="/shared/:id" element={<CanvasPage sharedView={true} />} />

              <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
              
              <Route path="/canvas" element={<RequireAuth><CanvasPage /></RequireAuth>} />
              <Route path="/canvas/:id" element={<RequireAuth><CanvasPage /></RequireAuth>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
