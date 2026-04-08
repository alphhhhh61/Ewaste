import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MonitorSmartphone,
  Wallet,
  CalendarClock,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Leaf,
  CheckCircle2,
  Truck,
  IndianRupee,
  LogOut,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { getDashboardStats } from '../services/api.js';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userInfo') || '{}'); }
    catch { return {}; }
  });

  const [stats, setStats] = useState({
    totalDevices: 0,
    walletBalance: 0,
    devicesCollected: 0,
    pendingRequests: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!token) {
          navigate('/login');
          return;
        }
        const data = await getDashboardStats(token);
        // If backend returns an error object (non-ok response)
        if (data?.message && data.message.includes('token')) {
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }
        if (data?.stats) setStats(data.stats);
        if (data?.recentActivity) setRecentActivity(data.recentActivity);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    return `db-status db-status-${s}`;
  };

  // Eco impact: rough estimate based on devices collected
  const co2Saved = ((stats.devicesCollected || 0) * 4.8).toFixed(1);
  const waterSaved = ((stats.devicesCollected || 0) * 18);
  const treesEq = Math.max(0, ((stats.devicesCollected || 0) * 0.7).toFixed(1));

  const navLinks = [
    { to: '/dashboard',       icon: LayoutDashboard,   label: 'Dashboard' },
    { to: '/my-devices',      icon: MonitorSmartphone, label: 'My Devices' },
    { to: '/wallet',          icon: Wallet,            label: 'My Wallet' },
    { to: '/schedule',        icon: CalendarClock,     label: 'Schedule Pickup' },
    { to: '/register-device', icon: Plus,              label: 'Register Device' },
    { to: '/centers',         icon: Leaf,              label: 'Collection Centers' },
  ];

  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-spinner" />
        <p>Loading your green impact…</p>
      </div>
    );
  }

  return (
    <div className="db-shell">
      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        {/* User Profile */}
        <div className="db-profile">
          <div className="db-avatar">{userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div className="db-profile-info">
            <h4>{userInfo?.name || 'User'}</h4>
            <span className="db-badge-eco">🌿 Eco Warrior</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="db-nav">
          <span className="db-nav-label">Main Menu</span>
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`db-nav-item ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        {/* Promo Card */}
        <div className="db-promo">
          <div className="db-promo-icon">🎯</div>
          <h5>Earn 10% Extra!</h5>
          <p>Recycle 5 devices this month to unlock a bonus multiplier.</p>
          <div className="db-promo-bar">
            <div
              className="db-promo-fill"
              style={{ width: `${Math.min(100, (stats.totalDevices / 5) * 100)}%` }}
            />
          </div>
          <small>{Math.min(stats.totalDevices, 5)}/5 completed</small>
        </div>

        {/* Logout */}
        <button className="db-logout" onClick={handleLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="db-main">
        {/* Header */}
        <div className="db-header">
          <div>
            <h1>Welcome back, {userInfo?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p>Here's your recycling activity at a glance.</p>
          </div>
          <div className="db-header-actions">
            <button className="db-notif-btn" title="Notifications">
              <Bell size={18} />
            </button>
            <Link to="/register-device" className="db-btn-primary">
              <Plus size={16} /> Register Device
            </Link>
          </div>
        </div>

        {error && (
          <div className="db-alert-danger">⚠ {error}</div>
        )}

        {/* ── STAT CARDS ── */}
        <div className="db-stats-grid">
          <div className="db-stat-card green">
            <div className="db-stat-icon green"><IndianRupee size={22} /></div>
            <div>
              <div className="db-stat-label">Wallet Balance</div>
              <div className="db-stat-value">₹{(stats.walletBalance || 0).toLocaleString()}</div>
              <div className="db-stat-sub"><TrendingUp size={12} /> Total credits earned</div>
            </div>
          </div>

          <div className="db-stat-card blue">
            <div className="db-stat-icon blue"><MonitorSmartphone size={22} /></div>
            <div>
              <div className="db-stat-label">Devices Registered</div>
              <div className="db-stat-value">{stats.totalDevices || 0}</div>
              <div className="db-stat-sub"><CheckCircle2 size={12} /> Total e-waste logged</div>
            </div>
          </div>

          <div className="db-stat-card purple">
            <div className="db-stat-icon purple"><Leaf size={22} /></div>
            <div>
              <div className="db-stat-label">Devices Collected</div>
              <div className="db-stat-value">{stats.devicesCollected || 0}</div>
              <div className="db-stat-sub"><CheckCircle2 size={12} /> Successfully recycled</div>
            </div>
          </div>

          <div className="db-stat-card orange">
            <div className="db-stat-icon orange"><Truck size={22} /></div>
            <div>
              <div className="db-stat-label">Pending Pickups</div>
              <div className="db-stat-value">{stats.pendingRequests || 0}</div>
              <div className="db-stat-sub"><Clock size={12} /> Awaiting collection</div>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="db-quick-actions">
          <h3 className="db-section-title">Quick Actions</h3>
          <div className="db-actions-grid">
            {[
              { to: '/register-device', icon: Plus,              label: 'Register a Device',    desc: 'Add new e-waste for recycling',         color: 'green' },
              { to: '/schedule',        icon: CalendarClock,     label: 'Schedule Pickup',       desc: 'Book a free home collection slot',      color: 'blue' },
              { to: '/wallet',          icon: Wallet,            label: 'View Wallet',           desc: 'Check balance & withdraw credits',      color: 'purple' },
              { to: '/centers',         icon: Leaf,              label: 'Find Drop-off Centers', desc: 'Locate a nearby collection center',     color: 'orange' },
            ].map(({ to, icon: Icon, label, desc, color }) => (
              <Link to={to} key={to} className={`db-action-card db-action-${color}`}>
                <div className={`db-action-icon db-action-icon-${color}`}>
                  <Icon size={20} />
                </div>
                <div className="db-action-text">
                  <strong>{label}</strong>
                  <span>{desc}</span>
                </div>
                <ChevronRight size={16} className="db-action-arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="db-bottom-row">
          {/* Recent Activity */}
          <div className="db-panel">
            <div className="db-panel-header">
              <h3>Recent Activity</h3>
              <Link to="/my-devices" className="db-link-btn">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="db-activity-list">
              {recentActivity.length === 0 ? (
                <div className="db-empty">
                  <MonitorSmartphone size={36} />
                  <p>No activity yet. Register your first device!</p>
                </div>
              ) : (
                recentActivity.map((item) => (
                  <div key={item.id} className="db-activity-item">
                    <div className={`db-activity-dot ${item.type === 'credit' ? 'green' : 'blue'}`} />
                    <div className="db-activity-body">
                      <div className="db-activity-row">
                        <span className="db-activity-action">{item.action}</span>
                        {item.type === 'credit' && item.amount > 0 && (
                          <span className="db-activity-credit">+₹{item.amount}</span>
                        )}
                      </div>
                      <div className="db-activity-meta">
                        <span>{formatDate(item.date)}</span>
                        <span className={getStatusStyle(item.status)}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Eco Impact Panel */}
          <div className="db-panel db-eco-panel">
            <div className="db-panel-header">
              <h3>🌍 Your Green Impact</h3>
            </div>
            <p className="db-eco-sub">Your recycling efforts have so far prevented:</p>

            <div className="db-eco-grid">
              <div className="db-eco-stat">
                <div className="db-eco-value">{co2Saved}</div>
                <div className="db-eco-label">kg CO₂ Saved</div>
              </div>
              <div className="db-eco-stat">
                <div className="db-eco-value">{waterSaved}</div>
                <div className="db-eco-label">Litres Water</div>
              </div>
              <div className="db-eco-stat">
                <div className="db-eco-value">{treesEq}</div>
                <div className="db-eco-label">Trees Equivalent</div>
              </div>
            </div>

            <div className="db-eco-graphic">🌲🌿🌱</div>
            <p className="db-eco-msg">
              {stats.devicesCollected === 0
                ? 'Start recycling to see your environmental impact!'
                : `You've made a real difference. Keep it up!`}
            </p>

            <Link to="/about" className="db-btn-outline">
              Learn about our impact <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
