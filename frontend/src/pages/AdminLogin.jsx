import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../services/api.js';
import './Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      if (userInfo.role === 'admin' || userInfo.role === 'Admin') {
         navigate('/admin-dashboard');
      } else {
         navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(formData);
      
      if (data.role !== 'admin' && data.role !== 'Admin') {
         setError('Invalid Admin credentials or Unauthorized role');
         setLoading(false);
         return;
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/admin-dashboard');

    } catch (err) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass animate-fade-in">
        <div className="auth-header">
          <div className="auth-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            <ShieldAlert size={32} />
          </div>
          <h2>Admin Portal</h2>
          <p>Secure login for platform administrators</p>
        </div>

        {error && <div className="form-alert danger-bg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Administrator Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@ecosync.com"
                required
                className="fancy-input pl-10"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="fancy-input pl-10 pr-10"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 auth-btn" disabled={loading} style={{ background: 'linear-gradient(135deg, #EF4444, #B91C1C)'}}>
            {loading ? 'Authenticating...' : 'Access Dashboard'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Not an administrator? <Link to="/login" className="text-primary">Return to User Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
