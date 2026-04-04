import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MonitorSmartphone, Printer, Laptop, Battery, Tv, Box,
  Clock, Plus, Trash2, AlertTriangle, X
} from 'lucide-react';
import { getMyDevices, cancelDevice } from '../services/api.js';
import './MyDevices.css';

const MyDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cancel modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, device: null });
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) throw new Error('Not logged in');
      const { token } = JSON.parse(userInfoStr);
      const data = await getMyDevices(token);
      setDevices(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const openCancelModal = (device) => {
    setCancelError('');
    setConfirmModal({ open: true, device });
  };

  const closeCancelModal = () => {
    if (cancelling) return;
    setConfirmModal({ open: false, device: null });
    setCancelError('');
  };

  const handleCancel = async () => {
    const { device } = confirmModal;
    if (!device) return;
    setCancelling(true);
    setCancelError('');
    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo') || '{}');
      await cancelDevice(device._id, token);
      setConfirmModal({ open: false, device: null });
      await fetchDevices(); // refresh list
    } catch (err) {
      setCancelError(err.message || 'Cancellation failed. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Mobile phones': return <MonitorSmartphone size={20} />;
      case 'Laptops':       return <Laptop size={20} />;
      case 'Printers':      return <Printer size={20} />;
      case 'Batteries':     return <Battery size={20} />;
      case 'Televisions':   return <Tv size={20} />;
      default:              return <Box size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const lowerStatus = (status || '').toLowerCase().replace(' ', '-');
    return <span className={`status-badge status-${lowerStatus}`}>{status}</span>;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  return (
    <div className="my-devices-page container section">
      <div className="page-header">
        <div>
          <h2>My Registered Devices</h2>
          <p className="text-secondary">Track the status of your e-waste from registration to recycling.</p>
        </div>
        <Link to="/register-device" className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={18} /> Register New
        </Link>
      </div>

      {error && <div className="form-alert danger-bg">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading your devices...</p>
        </div>
      ) : devices.length === 0 ? (
        <div className="empty-state glass">
          <MonitorSmartphone size={64} className="empty-icon" />
          <h3>No Devices Found</h3>
          <p>You haven't registered any electronic waste yet.</p>
          <Link to="/register-device" className="btn btn-primary mt-3">Register Your First Device</Link>
        </div>
      ) : (
        <div className="table-container glass">
          <table className="devices-table">
            <thead>
              <tr>
                <th>Device Code</th>
                <th>Product</th>
                <th>Category</th>
                <th>Date Added</th>
                <th>Est. Reward</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device._id} className="device-row">
                  <td className="device-id-col">
                    <span className="code">#{device._id.slice(0, 6).toUpperCase()}</span>
                  </td>
                  <td>
                    <div className="product-info">
                      <div className="product-icon-wrapper">
                        {getCategoryIcon(device.category)}
                      </div>
                      <div className="product-details">
                        <strong>{device.brand}</strong>
                        <span className="text-secondary">{device.modelName}</span>
                      </div>
                    </div>
                  </td>
                  <td>{device.category}</td>
                  <td>{formatDate(device.createdAt)}</td>
                  <td><strong className="success-text">₹{device.creditValue}</strong></td>
                  <td>{getStatusBadge(device.status)}</td>
                  <td>
                    <div className="action-cell">
                      {device.status === 'Registered' && device.disposalMethod === 'Home Pickup' && (
                        <Link
                          to={`/schedule?device=${device._id}`}
                          className="btn btn-sm btn-secondary compact-btn"
                        >
                          <Clock size={14} /> Schedule
                        </Link>
                      )}
                      {device.status === 'Registered' && (
                        <button
                          className="btn-cancel-device"
                          title="Cancel registration"
                          onClick={() => openCancelModal(device)}
                        >
                          <Trash2 size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Confirmation Modal ── */}
      {confirmModal.open && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeCancelModal} disabled={cancelling}>
              <X size={18} />
            </button>

            <div className="modal-icon-wrapper">
              <AlertTriangle size={36} />
            </div>

            <h3 className="modal-title">Cancel Registration?</h3>
            <p className="modal-body">
              You are about to cancel the registration of{' '}
              <strong>{confirmModal.device?.brand} {confirmModal.device?.modelName}</strong>.
              <br />
              This action <strong>cannot be undone</strong>.
            </p>

            {cancelError && (
              <div className="modal-error">⚠ {cancelError}</div>
            )}

            <div className="modal-actions">
              <button
                className="btn-modal-secondary"
                onClick={closeCancelModal}
                disabled={cancelling}
              >
                Keep Device
              </button>
              <button
                className="btn-modal-danger"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel It'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDevices;
