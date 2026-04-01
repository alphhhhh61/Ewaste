import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegisterDevice from './pages/RegisterDevice';
import MyDevices from './pages/MyDevices';
import CollectionCenters from './pages/CollectionCenters';
import SchedulePickup from './pages/SchedulePickup';
import Wallet from './pages/Wallet';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

// Routes where the global Navbar and Footer should be hidden
const ADMIN_ROUTES = ['/admin-dashboard'];

function App() {
  const location = useLocation();
  const isAdminPage = ADMIN_ROUTES.includes(location.pathname);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminPage && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/centers" element={<CollectionCenters />} />
          <Route path="/about" element={<About />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Route */}
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/register-device" element={<PrivateRoute><RegisterDevice /></PrivateRoute>} />
          <Route path="/my-devices" element={<PrivateRoute><MyDevices /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><SchedulePickup /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;

