// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components (Mockups - You need to create these)
import Header from './components/layout/Header'; 
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import WisherDashboardPage from './pages/WisherDashboardPage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

// --- Private Route Component ---
// Ensures a route is only accessible if the user is logged in AND has the correct role
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // NOTE: Replace this with a proper spinner or skeleton loader in production
    return <div className="text-center p-8">Loading user data...</div>;
  }
  
  // 1. Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. Logged in, but wrong role -> Redirect to a safe spot (e.g., their correct dashboard or home)
  if (requiredRole && user.user_type !== requiredRole) {
    // If they are logged in but tried to access the wrong dashboard, send them to the root.
    return <Navigate to="/" replace />; 
  }
  
  // 3. Authorized -> Render the component
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage type="login" />} />
              <Route path="/register" element={<AuthPage type="register" />} />

              {/* Payment Result Route (Must be public as it comes from Stripe's redirect) */}
              <Route path="/donor/success" element={<PaymentSuccessPage />} />

              {/* ---------------------------------- */}
              {/* PROTECTED ROUTES (Requires Login)  */}
              {/* ---------------------------------- */}

              {/* Wisher Dashboard (Restricted to 'Wisher') */}
              <Route path="/wisher/dashboard" element={
                <PrivateRoute requiredRole="Wisher">
                  <WisherDashboardPage />
                </PrivateRoute>
              } />

              {/* Donor Dashboard (Restricted to 'Donor') */}
              <Route path="/donor/dashboard" element={
                <PrivateRoute requiredRole="Donor">
                  <DonorDashboardPage />
                </PrivateRoute>
              } />

              {/* Admin Dashboard (Restricted to 'Admin') */}
              <Route path="/admin/dashboard" element={
                <PrivateRoute requiredRole="Admin">
                  <AdminDashboardPage />
                </PrivateRoute>
              } />

              {/* Catch-all for 404 (Redirects to Home) */}
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