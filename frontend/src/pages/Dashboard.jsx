import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MonitorSmartphone, 
  Wallet, 
  CalendarClock, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [userInfo] = useState(() => {
    const userStr = localStorage.getItem('userInfo');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [stats, setStats] = useState({
    totalDevices: 0,
    walletBalance: 0,
    devicesCollected: 0,
    pendingRequests: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Mock fetching dashboard data 
    // In production, this would call /api/dashboard with Bearer token
    setTimeout(() => {
      setStats({
        totalDevices: 4,
        walletBalance: 450,
        devicesCollected: 3,
        pendingRequests: 1
      });

      setRecentActivity([
        { id: 1, action: 'Broken Smartphone Collected', date: '2 hours ago', type: 'credit', amount: 40, status: 'Completed' },
        { id: 2, action: 'Registered Old Tablet', date: '1 day ago', type: 'info', amount: 0, status: 'Registered' },
        { id: 3, action: 'Pickup Scheduled for Laptop', date: '3 days ago', type: 'info', amount: 0, status: 'Pickup Scheduled' },
        { id: 4, action: 'Old Monitor Collected', date: '1 week ago', type: 'credit', amount: 150, status: 'Completed' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your green impact...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout container section">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar glass">
        <div className="user-profile">
          <div className="avatar">{userInfo?.name?.charAt(0) || 'U'}</div>
          <div>
            <h3>{userInfo?.name || 'User'}</h3>
            <span className="badge-eco">Eco Warrior</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="dash-nav-item active">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/my-devices" className="dash-nav-item">
            <MonitorSmartphone size={20} /> My Devices
          </Link>
          <Link to="/wallet" className="dash-nav-item">
            <Wallet size={20} /> My Wallet
          </Link>
          <Link to="/schedule" className="dash-nav-item">
            <CalendarClock size={20} /> Schedule Pickup
          </Link>
        </nav>

        <div className="sidebar-promo">
          <div className="promo-box">
            <h4>Earn 10% Extra!</h4>
            <p>Recycle 5 devices this month to unlock a bonus multiplier.</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: '60%' }}></div>
            </div>
            <small>3/5 Completed</small>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h2>Welcome back, {userInfo?.name?.split(' ')[0] || 'User'}! 👋</h2>
            <p className="text-secondary">Here's what's happening with your recycling efforts today.</p>
          </div>
          <Link to="/register-device" className="btn btn-primary">
            Register New Device
          </Link>
        </header>

        {/* Overview Cards */}
        <div className="stats-grid">
          <div className="stat-card glass border-success">
            <div className="stat-header">
              <div className="stat-icon-wrapper success-bg">
                <Wallet size={24} />
              </div>
              <span className="trend positive"><TrendingUp size={16} /> +12%</span>
            </div>
            <div className="stat-body">
              <h3>₹ {stats.walletBalance}</h3>
              <p>Available Balance</p>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="stat-header">
              <div className="stat-icon-wrapper primary-bg">
                <MonitorSmartphone size={24} />
              </div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalDevices}</h3>
              <p>Total Registered Devices</p>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="stat-header">
              <div className="stat-icon-wrapper warning-bg">
                <Clock size={24} />
              </div>
            </div>
            <div className="stat-body">
              <h3>{stats.pendingRequests}</h3>
              <p>Pending Pickups</p>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          {/* Recent Activity Feed */}
          <div className="activity-section glass">
            <div className="section-header">
              <h3>Recent Activity</h3>
              <Link to="/my-devices" className="text-btn">View All</Link>
            </div>
            
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-feed-item">
                  <div className={`activity-indicator ${activity.type === 'credit' ? 'indicator-success' : 'indicator-info'}`}></div>
                  <div className="activity-content">
                    <div className="activity-title">
                      <span>{activity.action}</span>
                      {activity.type === 'credit' && (
                        <span className="activity-amount success-text">+ ₹{activity.amount}</span>
                      )}
                    </div>
                    <div className="activity-meta">
                      <span className="activity-date">{activity.date}</span>
                      <span className={`activity-status status-${activity.status.toLowerCase().replace(' ', '-')}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Impact Card */}
          <div className="impact-section glass">
            <h3>Your Green Impact</h3>
            <p className="text-secondary">Your recycling efforts have contributed to saving:</p>
            
            <div className="impact-stats">
              <div className="impact-item">
                <h2>14.5</h2>
                <span>kg CO₂ Emissions</span>
              </div>
              <div className="impact-item">
                <h2>52</h2>
                <span>Liters of Water</span>
              </div>
            </div>
            
            <div className="impact-graphic">
               <div className="tree-graphic">🌲🌲🌱</div>
               <p>Equivalent to planting 2 trees!</p>
            </div>
            
            <Link to="/about" className="btn btn-secondary w-100 impact-btn">
              Learn about our impact <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
