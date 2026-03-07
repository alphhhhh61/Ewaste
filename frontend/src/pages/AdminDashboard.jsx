import { useState, useEffect } from 'react';
import { 
  Users, 
  MonitorSmartphone, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Truck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
// Mock APIs for UI logic
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock APIs
      setTimeout(() => {
        setStats({
          totalUsers: 145,
          totalDevices: 890,
          totalRewardsPaid: 245000,
          pendingPickups: 12
        });
        
        setWithdrawals([
          { _id: 'w1', user: { name: 'Rahul Sharma', email: 'rahul@example.com' }, amount: 1500, withdrawalMethod: 'UPI', status: 'Pending', createdAt: new Date().toISOString() },
          { _id: 'w2', user: { name: 'Priya Patel', email: 'priya@example.com' }, amount: 500, withdrawalMethod: 'Bank Transfer', status: 'Pending', createdAt: new Date(Date.now() - 86400000).toISOString() }
        ]);

        setUsers([
          { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'User', walletBalance: 450, createdAt: '2023-01-15' },
          { _id: 'u2', name: 'Priya Patel', email: 'priya@example.com', role: 'User', walletBalance: 1200, createdAt: '2023-02-20' },
          { _id: 'u3', name: 'System Admin', email: 'admin@ecosync.com', role: 'Admin', walletBalance: 0, createdAt: '2022-11-01' }
        ]);

        setDevices([
          { _id: 'd1', user: { name: 'Rahul Sharma' }, category: 'Mobile phones', brand: 'Apple', modelName: 'iPhone X', status: 'Completed', creditValue: 120, createdAt: '2023-03-10' },
          { _id: 'd2', user: { name: 'Priya Patel' }, category: 'Laptops', brand: 'HP', modelName: 'Pavilion', status: 'Pickup Scheduled', creditValue: 350, createdAt: '2023-04-05' }
        ]);

        setLoading(false);
      }, 1000);
      
    } catch {
      setError('Failed to load admin data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

  const handleWithdrawalAction = async (id, status) => {
    try {
      setActionLoading(id);
      
      // Mock action
      setTimeout(() => {
        setWithdrawals(prev => prev.filter(w => w._id !== id));
        setActionLoading(false);
        // Refresh stats silently
        setStats(prev => ({
          ...prev,
          totalRewardsPaid: status === 'Completed' ? prev.totalRewardsPaid + 1500 : prev.totalRewardsPaid
        }));
      }, 800);
      
    } catch {
      setError('Action failed');
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading System Analytics...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar glass">
        <div className="admin-profile">
          <div className="admin-avatar">
            <span className="text-gradient">A</span>
          </div>
          <div className="admin-info">
            <h3>System Admin</h3>
            <span className="badge-admin">Superuser</span>
          </div>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={18} /> Overview
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'withdrawals' ? 'active' : ''}`}
            onClick={() => setActiveTab('withdrawals')}
          >
            <IndianRupee size={18} /> Payout Requests
            {withdrawals.length > 0 && <span className="admin-badge-count">{withdrawals.length}</span>}
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Manage Users
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            <MonitorSmartphone size={18} /> Device Log
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="admin-content">
        <div className="admin-header">
          <h2>Admin Control Panel</h2>
          <p className="text-secondary">Manage platform activity, users, and financial transactions.</p>
        </div>

        {error && <div className="form-alert danger-bg"><AlertCircle size={20} /> {error}</div>}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && stats && (
          <div className="tab-pane animate-fade-in">
             <div className="admin-stats-grid">
               <div className="stat-card glass border-blue">
                 <div className="stat-icon-wrapper blue-bg"><Users size={24} /></div>
                 <div className="stat-details">
                   <p>Total Registered Users</p>
                   <h3>{stats.totalUsers.toLocaleString()}</h3>
                 </div>
               </div>
               
               <div className="stat-card glass border-green">
                 <div className="stat-icon-wrapper green-bg"><MonitorSmartphone size={24} /></div>
                 <div className="stat-details">
                   <p>Total Devices Recycled</p>
                   <h3>{stats.totalDevices.toLocaleString()}</h3>
                 </div>
               </div>
               
               <div className="stat-card glass border-purple">
                 <div className="stat-icon-wrapper purple-bg"><IndianRupee size={24} /></div>
                 <div className="stat-details">
                   <p>Total Rewards Distributed</p>
                   <h3>₹{stats.totalRewardsPaid.toLocaleString()}</h3>
                 </div>
               </div>
               
               <div className="stat-card glass border-orange">
                 <div className="stat-icon-wrapper orange-bg"><Truck size={24} /></div>
                 <div className="stat-details">
                   <p>Pending Pickups</p>
                   <h3>{stats.pendingPickups}</h3>
                 </div>
               </div>
             </div>
             
             <div className="admin-chart-placeholder glass mt-4">
                <TrendingUp size={48} className="text-secondary opacity-50 mb-3" />
                <h3>Platform Growth</h3>
                <p className="text-secondary">Charts tracking user registration and e-waste volume over time.</p>
             </div>
          </div>
        )}

        {/* Tab 2: Withdrawals */}
        {activeTab === 'withdrawals' && (
          <div className="tab-pane animate-fade-in">
            <h3 className="section-title mb-4">Pending Payouts</h3>
            {withdrawals.length === 0 ? (
              <div className="empty-state glass">
                <CheckCircle2 size={48} className="text-success mb-3" />
                <h4>All Caught Up!</h4>
                <p>No pending withdrawal requests to process.</p>
              </div>
            ) : (
              <div className="table-responsive glass">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map(w => (
                      <tr key={w._id}>
                        <td>{formatDate(w.createdAt)}</td>
                        <td>
                          <strong>{w.user.name}</strong>
                          <span className="d-block text-secondary small">{w.user.email}</span>
                        </td>
                        <td><span className="badge-method">{w.withdrawalMethod}</span></td>
                        <td><strong>₹{w.amount}</strong></td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon btn-approve" 
                              onClick={() => handleWithdrawalAction(w._id, 'Completed')}
                              disabled={actionLoading === w._id}
                              title="Approve Payout"
                            >
                              {actionLoading === w._id ? <div className="spinner-mini"></div> : <CheckCircle2 size={18} />}
                            </button>
                            <button 
                              className="btn-icon btn-reject"
                              onClick={() => handleWithdrawalAction(w._id, 'Failed')}
                              disabled={actionLoading === w._id}
                              title="Reject Payout"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="tab-pane animate-fade-in">
             <h3 className="section-title mb-4">Platform Users</h3>
             <div className="table-responsive glass">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Joined</th>
                      <th>User Details</th>
                      <th>Role</th>
                      <th>Wallet Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{formatDate(u.createdAt)}</td>
                        <td>
                          <strong>{u.name}</strong>
                          <span className="d-block text-secondary small">{u.email}</span>
                        </td>
                        <td>
                          <span className={u.role === 'Admin' ? 'badge-admin' : 'badge-user'}>{u.role}</span>
                        </td>
                        <td><strong>₹{u.walletBalance}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {/* Tab 4: Devices Log */}
        {activeTab === 'devices' && (
          <div className="tab-pane animate-fade-in">
             <h3 className="section-title mb-4">Platform Device Log</h3>
             <div className="table-responsive glass">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Owner</th>
                      <th>Item</th>
                      <th>Status</th>
                      <th>Credit Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map(d => (
                      <tr key={d._id}>
                        <td><span className="code">#{d._id.slice(0,6).toUpperCase()}</span></td>
                        <td>{d.user.name}</td>
                        <td>
                          <strong>{d.brand} {d.modelName}</strong>
                          <span className="d-block text-secondary small">{d.category}</span>
                        </td>
                        <td><span className={`status-badge status-${d.status.toLowerCase().replace(' ', '-')}`}>{d.status}</span></td>
                        <td className="text-success fw-bold">₹{d.creditValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
