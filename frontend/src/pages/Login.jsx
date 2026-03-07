import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In development, handle fake login if backend is not running
      // const userData = await loginUser(formData);
      // localStorage.setItem('userInfo', JSON.stringify(userData));
      
      // Simulating succesful login for UI purposes if DB is not attached correctly
      setTimeout(() => {
        localStorage.setItem('userInfo', JSON.stringify({ name: 'Test User', email: formData.email, role: 'user' }));
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass animate-fade-in">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Log in to access your recycling dashboard and rewards.</p>
        </div>

        {error && <div className="auth-alert danger-bg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
