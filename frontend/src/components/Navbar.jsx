import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Simple client-side auth state check (Mocked for now)
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <Leaf className="logo-icon" />
          <span>EcoSync</span>
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-links ${isActive('/')}`} onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={`nav-links ${isActive('/about')}`} onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/centers" className={`nav-links ${isActive('/centers')}`} onClick={toggleMenu}>
              Centers
            </Link>
          </li>
          {userInfo && (
            <>
              <li className="nav-item">
                <Link to="/my-devices" className={`nav-links ${isActive('/my-devices')}`} onClick={toggleMenu}>
                  My Devices
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-links ${isActive('/dashboard')}`} onClick={toggleMenu}>
                  Dashboard
                </Link>
              </li>
            </>
          )}
          
          <li className="nav-item nav-buttons">
            {userInfo ? (
              <>
                {userInfo.role !== 'Admin' && (
                  <Link to="/register-device" className="btn btn-secondary nav-btn" onClick={toggleMenu}>
                    Register Item
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-primary nav-btn" style={{backgroundColor: '#EF4444'}}>
                  Logout
                </button>
              </>
            ) : (
              <div className="auth-dropdown-container">
                <button className="btn btn-secondary nav-btn">
                  Log In ▾
                </button>
                <div className="auth-dropdown glass">
                  <Link to="/login" className="dropdown-link" onClick={toggleMenu}>User Login</Link>
                  <Link to="/admin-login" className="dropdown-link" onClick={toggleMenu}>Admin Login</Link>
                </div>
              </div>
            )}
            {!userInfo && (
              <Link to="/register" className="btn btn-primary nav-btn" onClick={toggleMenu}>
                Sign Up
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
