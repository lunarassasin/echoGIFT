// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';

// Layout & Page Components
import Header from './components/layout/Header'; 
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import WisherDashboardPage from './pages/WisherDashboardPage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import SecretAdminRegister from './pages/SecretAdminRegister';

// --- Debugging Helper Component ---
// This component logs every time the URL changes
const DebugRouter = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("📍 Route Changed to:", location.pathname);
    console.log("👤 Current User Status:", user ? `Logged in as ${user.user_type}` : "Not Logged In");
    console.log("⌛ Loading Status:", loading);
  }, [location, user, loading]);

  return null;
};

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="text-center p-8">Loading user data...</div>;
  if (!user) {
    console.log("🚫 PrivateRoute: No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.user_type !== requiredRole) {
    console.log(`🚫 PrivateRole: User is ${user.user_type}, but ${requiredRole} is required. Redirecting home.`);
    return <Navigate to="/" replace />; 
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* We place the debugger inside the AuthProvider but outside Routes */}
        <DebugRouter />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage type="login" />} />
              <Route path="/register" element={<AuthPage type="register" />} />
              <Route path="/setup-admin-xyz-99" element={<SecretAdminRegister />} />
              <Route path="/donor/success" element={<PaymentSuccessPage />} />

              <Route path="/wisher/dashboard" element={<PrivateRoute requiredRole="Wisher"><WisherDashboardPage /></PrivateRoute>} />
              <Route path="/donor/dashboard" element={<PrivateRoute requiredRole="Donor"><DonorDashboardPage /></PrivateRoute>} />
              <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="Admin"><AdminDashboardPage /></PrivateRoute>} />

              {/* Log before the catch-all sends you home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;