import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MonitorSmartphone, Printer, Laptop, Battery, Tv, Box, Clock, MoreVertical, Plus } from 'lucide-react';
import { getMyDevices } from '../services/api.js';
import './MyDevices.css';

const MyDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) throw new Error('Not logged in');
        const { token } = JSON.parse(userInfoStr);
        const data = await getMyDevices(token);

        setDevices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch devices');
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Mobile phones': return <MonitorSmartphone size={20} />;
      case 'Laptops': return <Laptop size={20} />;
      case 'Printers': return <Printer size={20} />;
      case 'Batteries': return <Battery size={20} />;
      case 'Televisions': return <Tv size={20} />;
      default: return <Box size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const lowerStatus = status.toLowerCase().replace(' ', '-');
    return <span className={`status-badge status-${lowerStatus}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

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
                    <span className="code">#{device._id.slice(0,6).toUpperCase()}</span>
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
                    {device.status === 'Registered' && device.disposalMethod === 'Home Pickup' ? (
                      <Link to={`/schedule?device=${device._id}`} className="btn btn-sm btn-secondary compact-btn">
                        <Clock size={14} /> Schedule
                      </Link>
                    ) : (
                      <button className="icon-btn"><MoreVertical size={18} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDevices;
