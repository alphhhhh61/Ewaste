import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MonitorSmartphone,
  IndianRupee,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Building2,
  Plus,
  Trash2,
  Clock,
  Phone,
  Tag,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import {
  getAdminStats,
  getAdminWithdrawals,
  getAdminUsers,
  getAdminDevices,
  getAdminPickups,
  approveWithdrawal,
  completePickup,
  getCollectionCenters,
  createCollectionCenter,
  deleteCollectionCenter,
} from '../services/api.js';
import './AdminDashboard.css';

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo'))?.token || null;
  } catch { return null; }
};

const getStatusClass = (status) => {
  if (!status) return '';
  return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [stats, setStats]         = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers]         = useState([]);
  const [devices, setDevices]     = useState([]);
  const [pickups, setPickups]     = useState([]);
  const [centers, setCenters]     = useState([]);

  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError]             = useState('');
  const [successMsg, setSuccessMsg]   = useState('');

  // Centers form state
  const [centerForm, setCenterForm] = useState({
    name: '', address: '', city: '',
    operatingHours: '', contactNumber: '',
    lat: '', lng: '',
    acceptedCategories: '',
  });
  const [centerFormLoading, setCenterFormLoading] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Data Fetching                                                     */
  /* ---------------------------------------------------------------- */
  const fetchAll = useCallback(async (silent = false) => {
    const token = getToken();
    if (!token) { navigate('/admin-login'); return; }

    if (!silent) setLoading(true);
    setError('');

    try {
      const [s, w, u, d, p, c] = await Promise.all([
        getAdminStats(token),
        getAdminWithdrawals(token),
        getAdminUsers(token),
        getAdminDevices(token),
        getAdminPickups(token),
        getCollectionCenters(),
      ]);
      setStats(s);
      setWithdrawals(Array.isArray(w) ? w : []);
      setUsers(Array.isArray(u) ? u : []);
      setDevices(Array.isArray(d) ? d : []);
      setPickups(Array.isArray(p) ? p : []);
      setCenters(Array.isArray(c) ? c : []);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll(true);
    showSuccess('Data refreshed!');
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  /* ---------------------------------------------------------------- */
  /*  Actions                                                           */
  /* ---------------------------------------------------------------- */
  const handleWithdrawal = async (id, status) => {
    const token = getToken();
    setActionLoading(id);
    try {
      await approveWithdrawal(id, status, token);
      setWithdrawals(prev => prev.filter(w => (w._id || w.id) !== id));
      if (status === 'Completed') {
        const t = withdrawals.find(w => (w._id || w.id) === id);
        setStats(prev => ({ ...prev, totalRewardsPaid: prev.totalRewardsPaid + (t?.amount || 0) }));
      }
      showSuccess(`Withdrawal ${status === 'Completed' ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePickupComplete = async (id) => {
    const token = getToken();
    setActionLoading(`pickup-${id}`);
    try {
      await completePickup(id, token);
      setPickups(prev => prev.map(p => ((p._id || p.id) === id) ? { ...p, status: 'Completed' } : p));
      const t = pickups.find(p => (p._id || p.id) === id);
      setStats(prev => ({
        ...prev,
        pendingPickups: Math.max(0, prev.pendingPickups - 1),
        totalRewardsPaid: prev.totalRewardsPaid + (t?.device?.creditValue || 0),
      }));
      showSuccess('Pickup marked as completed');
    } catch (err) {
      setError(err.message || 'Failed to complete pickup');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddCenter = async (e) => {
    e.preventDefault();
    const token = getToken();
    setCenterFormLoading(true);
    setError('');
    try {
      const cats = centerForm.acceptedCategories
        ? centerForm.acceptedCategories.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const newCenter = await createCollectionCenter({
        name: centerForm.name,
        address: centerForm.address,
        city: centerForm.city,
        operatingHours: centerForm.operatingHours,
        contactNumber: centerForm.contactNumber,
        lat: centerForm.lat ? parseFloat(centerForm.lat) : null,
        lng: centerForm.lng ? parseFloat(centerForm.lng) : null,
        acceptedCategories: cats,
      }, token);
      setCenters(prev => [...prev, newCenter]);
      setCenterForm({ name: '', address: '', city: '', operatingHours: '', contactNumber: '', lat: '', lng: '', acceptedCategories: '' });
      showSuccess('Collection center added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to add center');
    } finally {
      setCenterFormLoading(false);
    }
  };

  const handleDeleteCenter = async (id) => {
    if (!window.confirm('Delete this collection center? This cannot be undone.')) return;
    const token = getToken();
    setActionLoading(`center-${id}`);
    try {
      await deleteCollectionCenter(id, token);
      setCenters(prev => prev.filter(c => (c._id || c.id) !== id));
      showSuccess('Collection center deleted');
    } catch (err) {
      setError(err.message || 'Failed to delete center');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin-login');
  };

  /* ---------------------------------------------------------------- */
  /*  Nav Config                                                        */
  /* ---------------------------------------------------------------- */
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending' || !w.status);
  const pendingPickupsList = pickups.filter(p => p.status === 'Scheduled');

  const navItems = [
    { id: 'overview',    label: 'Overview',          icon: LayoutDashboard },
    { id: 'withdrawals', label: 'Payout Requests',   icon: IndianRupee,   badge: pendingWithdrawals.length },
    { id: 'pickups',     label: 'Manage Pickups',    icon: Truck,          badge: pendingPickupsList.length },
    { id: 'users',       label: 'Platform Users',    icon: Users },
    { id: 'devices',     label: 'Device Log',        icon: MonitorSmartphone },
    { id: 'centers',     label: 'Collection Centers',icon: Building2 },
  ];

  /* ---------------------------------------------------------------- */
  /*  Loading Screen                                                    */
  /* ---------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Loading Control Panel...</p>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="admin-dashboard-page">

      {/* Mobile Overlay */}
      <div className={`admin-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Hamburger */}
      <button className="admin-hamburger" onClick={() => setSidebarOpen(s => !s)}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ============================================================
          SIDEBAR
          ============================================================ */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          {/* Brand */}
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <ShieldCheck size={18} />
            </div>
            <div className="admin-brand-text">
              <strong>EcoSync Control</strong>
              <small>Admin Panel</small>
            </div>
          </div>

          {/* Profile */}
          <div className="admin-profile-card">
            <div className="admin-avatar">A</div>
            <div className="admin-profile-info">
              <h4>System Admin</h4>
              <span className="badge-admin">Superuser</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          <span className="admin-nav-label">Main Menu</span>
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
            >
              <Icon size={18} />
              {label}
              {badge > 0 && <span className="admin-badge-count">{badge}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <main className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-page-header-left">
            <h1>{navItems.find(n => n.id === activeTab)?.label}</h1>
            <p>E-Waste Management Platform — Admin Control Panel</p>
          </div>
          <button className={`admin-refresh-btn ${refreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Alerts */}
        {error     && <div className="admin-alert danger"><AlertCircle size={16}/> {error}</div>}
        {successMsg && <div className="admin-alert success"><CheckCircle2 size={16}/> {successMsg}</div>}

        {/* ======================================================
            TAB: OVERVIEW
            ====================================================== */}
        {activeTab === 'overview' && stats && (
          <div className="tab-pane">
            {/* Stat Cards */}
            <div className="admin-stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon-wrapper blue"><Users size={22}/></div>
                <div className="stat-content">
                  <div className="stat-label">Registered Users</div>
                  <div className="stat-value">{stats.totalUsers?.toLocaleString() || 0}</div>
                  <div className="stat-trend"><TrendingUp size={12}/> Platform members</div>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-icon-wrapper green"><MonitorSmartphone size={22}/></div>
                <div className="stat-content">
                  <div className="stat-label">Devices Registered</div>
                  <div className="stat-value">{stats.totalDevices?.toLocaleString() || 0}</div>
                  <div className="stat-trend"><TrendingUp size={12}/> E-Waste tracked</div>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-icon-wrapper purple"><IndianRupee size={22}/></div>
                <div className="stat-content">
                  <div className="stat-label">Rewards Paid Out</div>
                  <div className="stat-value">₹{(stats.totalRewardsPaid || 0).toLocaleString()}</div>
                  <div className="stat-trend"><TrendingUp size={12}/> Credits distributed</div>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-icon-wrapper orange"><Truck size={22}/></div>
                <div className="stat-content">
                  <div className="stat-label">Pending Pickups</div>
                  <div className="stat-value">{stats.pendingPickups || 0}</div>
                  <div className="stat-trend"><Activity size={12}/> Awaiting action</div>
                </div>
              </div>
            </div>

            {/* Overview Row */}
            <div className="overview-row">
              {/* Platform Health */}
              <div className="overview-panel">
                <h3><Activity size={16}/> Platform Health</h3>
                {[
                  { label: 'User Retention', value: 78, color: 'green' },
                  { label: 'Pickup Completion Rate', value: 91, color: 'blue' },
                  { label: 'Rewards Utilization', value: 65, color: 'purple' },
                  { label: 'Center Capacity Used', value: 54, color: 'orange' },
                ].map(item => (
                  <div className="health-item" key={item.label}>
                    <div className="health-label">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="health-bar-bg">
                      <div className={`health-bar-fill ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="overview-panel">
                <h3><Clock size={16}/> Recent Activity</h3>
                <div className="activity-list">
                  {devices.slice(0,3).map(d => (
                    <div className="activity-item" key={d._id || d.id}>
                      <div className="activity-dot green"/>
                      <div>
                        <div className="activity-text">
                          <strong>{d.user?.name || 'A user'}</strong> registered a {d.brand} {d.category}
                        </div>
                        <div className="activity-time">{formatDate(d.created_at || d.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                  {pickups.filter(p => p.status === 'Scheduled').slice(0,2).map(p => (
                    <div className="activity-item" key={p._id || p.id}>
                      <div className="activity-dot orange"/>
                      <div>
                        <div className="activity-text">
                          <strong>{p.user?.name || 'A user'}</strong> scheduled a pickup for {p.preferredDate}
                        </div>
                        <div className="activity-time">{formatDate(p.created_at || p.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                  {withdrawals.slice(0,2).map(w => (
                    <div className="activity-item" key={w._id || w.id}>
                      <div className="activity-dot blue"/>
                      <div>
                        <div className="activity-text">
                          <strong>{w.user?.name || 'A user'}</strong> requested ₹{w.amount} withdrawal
                        </div>
                        <div className="activity-time">{formatDate(w.created_at || w.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                  {devices.length === 0 && withdrawals.length === 0 && pickups.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No recent activity.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            TAB: PAYOUT REQUESTS
            ====================================================== */}
        {activeTab === 'withdrawals' && (
          <div className="tab-pane">
            {pendingWithdrawals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><CheckCircle2 size={32}/></div>
                <h4>All Clear!</h4>
                <p>No pending withdrawal requests to process.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <div className="admin-table-toolbar">
                  <h3><IndianRupee size={16}/> Pending Payouts <span className="table-count-badge">{pendingWithdrawals.length}</span></h3>
                </div>
                <div className="table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date Requested</th>
                        <th>User</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingWithdrawals.map(w => {
                        const wId = w._id || w.id;
                        return (
                          <tr key={wId}>
                            <td>{formatDate(w.created_at || w.createdAt)}</td>
                            <td>
                              <div className="td-user">
                                <strong>{w.user?.name || 'Unknown'}</strong>
                                <small>{w.user?.email || '—'}</small>
                              </div>
                            </td>
                            <td><span className="badge-method">{w.withdrawalMethod || w.withdrawal_method || '—'}</span></td>
                            <td><strong>₹{(w.amount || 0).toLocaleString()}</strong></td>
                            <td>
                              <div className="action-group">
                                <button
                                  className="btn-action btn-approve"
                                  onClick={() => handleWithdrawal(wId, 'Completed')}
                                  disabled={actionLoading === wId}
                                  title="Approve Payout"
                                >
                                  {actionLoading === wId ? <div className="spinner-mini"/> : <CheckCircle2 size={16}/>}
                                </button>
                                <button
                                  className="btn-action btn-reject"
                                  onClick={() => handleWithdrawal(wId, 'Failed')}
                                  disabled={actionLoading === wId}
                                  title="Reject Payout"
                                >
                                  <XCircle size={16}/>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            TAB: PICKUPS
            ====================================================== */}
        {activeTab === 'pickups' && (
          <div className="tab-pane">
            {pickups.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Truck size={32}/></div>
                <h4>No Pickups Yet</h4>
                <p>No pickup requests have been scheduled so far.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <div className="admin-table-toolbar">
                  <h3><Truck size={16}/> Pickup Logistics <span className="table-count-badge">{pickups.length}</span></h3>
                </div>
                <div className="table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Requested</th>
                        <th>Preferred Date & Time</th>
                        <th>User</th>
                        <th>Device</th>
                        <th>Pickup Address</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickups.map(p => {
                        const pId = p._id || p.id;
                        return (
                          <tr key={pId}>
                            <td>{formatDate(p.created_at || p.createdAt)}</td>
                            <td>
                              <div>{p.preferredDate || p.preferred_date || '—'}</div>
                              <small style={{ color: '#64748b' }}>{p.preferredTime || p.preferred_time || ''}</small>
                            </td>
                            <td>
                              <div className="td-user">
                                <strong>{p.user?.name || '—'}</strong>
                                <small>{p.user?.email || '—'}</small>
                              </div>
                            </td>
                            <td>
                              <div className="td-user">
                                <strong>{p.device?.brand} {p.device?.modelName || p.device?.model_name}</strong>
                                <small>{p.device?.category}</small>
                              </div>
                            </td>
                            <td style={{ maxWidth: '180px', whiteSpace: 'normal', fontSize: '0.8rem', color: '#475569' }}>
                              {p.pickupAddress || p.pickup_address || '—'}
                            </td>
                            <td><span className={`status-badge ${getStatusClass(p.status)}`}>{p.status}</span></td>
                            <td>
                              {p.status === 'Scheduled' || p.status === 'Agent Assigned' ? (
                                <button
                                  className="btn-complete"
                                  onClick={() => handlePickupComplete(pId)}
                                  disabled={actionLoading === `pickup-${pId}`}
                                >
                                  {actionLoading === `pickup-${pId}` ? <><div className="spinner-mini"/> Processing</> : <><CheckCircle2 size={14}/> Complete</>}
                                </button>
                              ) : (
                                <span className="done-label"><CheckCircle2 size={14}/> Done</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            TAB: USERS
            ====================================================== */}
        {activeTab === 'users' && (
          <div className="tab-pane">
            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Users size={32}/></div>
                <h4>No Users Yet</h4>
                <p>No users have registered on the platform.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <div className="admin-table-toolbar">
                  <h3><Users size={16}/> All Platform Users <span className="table-count-badge">{users.length}</span></h3>
                </div>
                <div className="table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Joined</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Wallet Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => {
                        const uId = u._id || u.id;
                        const role = (u.role || 'user').toLowerCase();
                        return (
                          <tr key={uId}>
                            <td>{formatDate(u.created_at || u.createdAt)}</td>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ color: '#64748b' }}>{u.email}</td>
                            <td style={{ color: '#64748b' }}>{u.phoneNumber || u.phonenumber || '—'}</td>
                            <td>
                              <span className={`status-badge ${role === 'admin' ? 'status-admin' : 'status-user'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td><strong style={{ color: '#059669' }}>₹{(u.walletBalance ?? u.wallet_balance ?? 0).toLocaleString()}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            TAB: DEVICES
            ====================================================== */}
        {activeTab === 'devices' && (
          <div className="tab-pane">
            {devices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><MonitorSmartphone size={32}/></div>
                <h4>No Devices Registered</h4>
                <p>No e-waste devices have been registered yet.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <div className="admin-table-toolbar">
                  <h3><MonitorSmartphone size={16}/> Device Registry <span className="table-count-badge">{devices.length}</span></h3>
                </div>
                <div className="table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Device ID</th>
                        <th>Registered</th>
                        <th>Owner</th>
                        <th>Device</th>
                        <th>Condition</th>
                        <th>Disposal</th>
                        <th>Status</th>
                        <th>Credit Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map(d => {
                        const dId = d._id || d.id;
                        return (
                          <tr key={dId}>
                            <td><span className="td-id-code">#{dId?.slice(0,6).toUpperCase()}</span></td>
                            <td>{formatDate(d.created_at || d.createdAt)}</td>
                            <td>{d.user?.name || '—'}</td>
                            <td>
                              <div className="td-user">
                                <strong>{d.brand} {d.modelName || d.model_name}</strong>
                                <small>{d.category}</small>
                              </div>
                            </td>
                            <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{d.condition}</td>
                            <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{d.disposalMethod || d.disposal_method}</td>
                            <td><span className={`status-badge ${getStatusClass(d.status)}`}>{d.status}</span></td>
                            <td><strong style={{ color: '#059669' }}>₹{d.creditValue || d.credit_value || 0}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            TAB: COLLECTION CENTERS
            ====================================================== */}
        {activeTab === 'centers' && (
          <div className="tab-pane">
            <div className="centers-layout">
              {/* ADD CENTER FORM */}
              <div className="center-form-card">
                <div className="center-form-card-header">
                  <Plus size={16}/>
                  <h3>Add New Center</h3>
                </div>
                <form className="center-form-body" onSubmit={handleAddCenter}>
                  <div className="form-row">
                    <label>Center Name *</label>
                    <input
                      className="form-control"
                      placeholder="GreenEarth E-Waste Hub"
                      value={centerForm.name}
                      onChange={e => setCenterForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Address *</label>
                    <input
                      className="form-control"
                      placeholder="123 Eco Street, Tech Park"
                      value={centerForm.address}
                      onChange={e => setCenterForm(p => ({ ...p, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>City *</label>
                    <input
                      className="form-control"
                      placeholder="Bangalore"
                      value={centerForm.city}
                      onChange={e => setCenterForm(p => ({ ...p, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Operating Hours *</label>
                    <input
                      className="form-control"
                      placeholder="9:00 AM - 6:00 PM (Mon-Sat)"
                      value={centerForm.operatingHours}
                      onChange={e => setCenterForm(p => ({ ...p, operatingHours: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Contact Number *</label>
                    <input
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={centerForm.contactNumber}
                      onChange={e => setCenterForm(p => ({ ...p, contactNumber: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-row form-row-half">
                    <div>
                      <label>Latitude</label>
                      <input
                        className="form-control"
                        placeholder="12.9716"
                        type="number"
                        step="any"
                        value={centerForm.lat}
                        onChange={e => setCenterForm(p => ({ ...p, lat: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>Longitude</label>
                      <input
                        className="form-control"
                        placeholder="77.5946"
                        type="number"
                        step="any"
                        value={centerForm.lng}
                        onChange={e => setCenterForm(p => ({ ...p, lng: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <label>Accepted Categories (comma-separated)</label>
                    <input
                      className="form-control"
                      placeholder="Mobile phones, Laptops, Tablets"
                      value={centerForm.acceptedCategories}
                      onChange={e => setCenterForm(p => ({ ...p, acceptedCategories: e.target.value }))}
                    />
                  </div>
                  <button type="submit" className="btn-add-center" disabled={centerFormLoading}>
                    {centerFormLoading ? <><div className="spinner-mini"/> Adding...</> : <><Plus size={16}/> Add Center</>}
                  </button>
                </form>
              </div>

              {/* CENTERS LIST */}
              <div>
                {centers.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon"><MapPin size={32}/></div>
                    <h4>No Centers Yet</h4>
                    <p>Add your first collection center using the form.</p>
                  </div>
                ) : (
                  <div className="centers-grid">
                    {centers.map(c => {
                      const cId = c._id || c.id;
                      const cats = c.acceptedCategories || c.accepted_categories || [];
                      return (
                        <div className="center-card" key={cId}>
                          <div className="center-card-header">
                            <h4>{c.name}</h4>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleDeleteCenter(cId)}
                              disabled={actionLoading === `center-${cId}`}
                              title="Delete Center"
                            >
                              {actionLoading === `center-${cId}` ? <div className="spinner-mini"/> : <Trash2 size={14}/>}
                            </button>
                          </div>
                          <div className="center-card-body">
                            <div className="center-meta-item">
                              <MapPin size={14}/>
                              <span>{c.address}, {c.city}</span>
                            </div>
                            <div className="center-meta-item">
                              <Clock size={14}/>
                              <span>{c.operatingHours || c.operating_hours}</span>
                            </div>
                            <div className="center-meta-item">
                              <Phone size={14}/>
                              <span>{c.contactNumber || c.contact_number}</span>
                            </div>
                            {cats.length > 0 && (
                              <div className="center-meta-item">
                                <Tag size={14}/>
                                <div className="center-categories">
                                  {cats.map(cat => (
                                    <span className="center-cat-tag" key={cat}>{cat}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
