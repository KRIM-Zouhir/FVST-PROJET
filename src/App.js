import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Layout/Footer';
import Spinner from './components/common/Spinner';
import LoadingTest from './components/common/LoadingTest';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NewShipment from './pages/NewShipment';
import Tracking from './pages/Tracking';
import RelayPoints from './pages/Admin/RelayPoints';
import DriverRoutes from './pages/DriverRoutes';
import VerifyEmail from './pages/VerifyEmail';
import WaitingVerification from './pages/WaitingVerification';
import NotFound from './pages/NotFound';
import MyShipments from './pages/MyShipments';
import TrackShipment from './pages/TrackShipment';
import DeliveryHistory from './pages/DeliveryHistory';
import AdminDashboard from './pages/Admin/Dashboard';
import BecomeDriver from './pages/BecomeDriver';
import HowItWorks from './pages/HowItWorks';
import ForBusinesses from './pages/ForBusinesses';
import FAQ from './pages/FAQ';

// Auth Components
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Protected route component that checks authentication
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    // While still loading auth status, show a loading indicator
    if (isLoading) {
      return <Spinner text="Vérification de l'authentification..." size="md" />;
    }
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    // If roles are specified and user doesn't have required role, redirect
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      // Redirect based on user role
      if (user?.role === 'livreur') {
        return <Navigate to="/driver-routes" replace />;
      } else if (user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
    
    // If all checks pass, render the protected content
    return children;
  };
  
  return (
    <div className="App flex flex-col min-h-screen">
      {isLoading && <Spinner fullScreen text="Chargement de l'application..." size="lg" />}
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop
        closeOnClick 
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <AnimatePresence mode="wait">
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/loading-test" element={<LoadingTest />} />
            <Route path="/track" element={<Tracking />} />
            <Route path="/track/:trackingId" element={<TrackShipment />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/become-driver" element={<BecomeDriver />} />
            <Route path="/for-businesses" element={<ForBusinesses />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Email Verification */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/waiting-verification" element={<WaitingVerification />} />
            
            {/* Protected Routes for All Authenticated Users */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['expediteur']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Expediteur Routes */}
            <Route path="/new-shipment" element={
              <ProtectedRoute allowedRoles={['expediteur', 'admin']}>
                <NewShipment />
              </ProtectedRoute>
            } />
            
            <Route path="/my-shipments" element={
              <ProtectedRoute allowedRoles={['expediteur', 'admin']}>
                <MyShipments />
              </ProtectedRoute>
            } />
            
            {/* Livreur Routes */}
            <Route path="/driver-routes" element={
              <ProtectedRoute allowedRoles={['livreur', 'admin']}>
                <DriverRoutes />
              </ProtectedRoute>
            } />
            
            <Route path="/delivery-history" element={
              <ProtectedRoute allowedRoles={['livreur', 'admin']}>
                <DeliveryHistory />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/relay-points" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RelayPoints />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;