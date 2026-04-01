import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Truck,
  CalendarClock,
  MapPin,
  ListOrdered,
  AlertCircle,
  CheckCircle,
  Package,
  Clock,
  Info,
} from 'lucide-react';
import { getMyDevices, schedulePickup } from '../services/api.js';
import './SchedulePickup.css';

const TIME_SLOTS = [
  'Morning (9 AM – 12 PM)',
  'Afternoon (12 PM – 3 PM)',
  'Evening (3 PM – 6 PM)',
];

const SchedulePickup = () => {
  const [searchParams] = useSearchParams();
  const preSelectedDeviceId = searchParams.get('device');
  const fetchedRef = useRef(false);   // prevent infinite loop

  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    deviceId: preSelectedDeviceId || '',
    pickupAddress: '',
    preferredDate: '',
    preferredTime: TIME_SLOTS[0],
    specialInstructions: '',
  });

  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  const navigate = useNavigate();

  // Minimum selectable date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (fetchedRef.current) return;   // run only once
    fetchedRef.current = true;

    const fetchDevices = async () => {
      try {
        setLoading(true);
        const { token } = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const all = await getMyDevices(token);

        // Devices eligible for pickup scheduling:
        // - status is 'Registered' (not already scheduled/completed)
        // - disposalMethod is 'Home Pickup'
        const eligible = (all || []).filter(
          (d) => d.status === 'Registered' && d.disposalMethod === 'Home Pickup'
        );
        setDevices(eligible);

        // Auto-select pre-chosen device or first eligible if none specified
        if (preSelectedDeviceId) {
          setFormData((prev) => ({ ...prev, deviceId: preSelectedDeviceId }));
        } else if (eligible.length > 0 && !formData.deviceId) {
          setFormData((prev) => ({ ...prev, deviceId: eligible[0]._id || eligible[0].id }));
        }
      } catch (err) {
        setError(err.message || 'Failed to load devices. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deviceId) {
      setError('Please select a device for pickup.');
      return;
    }
    if (!formData.pickupAddress.trim()) {
      setError('Please enter a full pickup address.');
      return;
    }
    if (!formData.preferredDate) {
      setError('Please choose a preferred date.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo') || '{}');
      await schedulePickup(
        {
          deviceId: formData.deviceId,
          pickupAddress: formData.pickupAddress,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          specialInstructions: formData.specialInstructions,
        },
        token
      );
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to schedule pickup. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Selected device info card ─── */
  const selectedDevice = devices.find(
    (d) => (d._id || d.id) === formData.deviceId
  );

  /* ─── Success screen ─── */
  if (success) {
    return (
      <div className="sp-page">
        <div className="sp-success-wrap animate-fade-in">
          <div className="sp-success-icon">
            <CheckCircle size={56} />
          </div>
          <h2>Pickup Scheduled!</h2>
          <p>Our agent will arrive at your address on the specified date and time. You'll receive a notification once confirmed.</p>
          <div className="sp-dots">
            <span /><span /><span />
          </div>
          <small>Redirecting to dashboard…</small>
        </div>
      </div>
    );
  }

  /* ─── Main render ─── */
  return (
    <div className="sp-page">
      <div className="sp-container">

        {/* Page Title */}
        <div className="sp-page-title animate-fade-in">
          <div className="sp-title-icon">
            <Truck size={28} />
          </div>
          <div>
            <h1>Schedule Free Pickup</h1>
            <p>Choose a device and slot — we'll send an agent to your door.</p>
          </div>
        </div>

        {error && (
          <div className="sp-alert sp-alert-danger">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loading ? (
          <div className="sp-loading">
            <div className="sp-spinner" />
            <p>Loading your devices…</p>
          </div>
        ) : devices.length === 0 ? (
          <div className="sp-empty animate-fade-in">
            <div className="sp-empty-icon"><Package size={40} /></div>
            <h3>No Devices Available for Pickup</h3>
            <p>You don't have any devices registered for Home Pickup yet. Register a new device and choose "Home Pickup" as disposal method.</p>
            <button className="sp-btn sp-btn-primary" onClick={() => navigate('/register-device')}>
              Register a Device
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="sp-form animate-fade-in">
            {/* ── STEP 1: Select Device ── */}
            <div className="sp-card">
              <div className="sp-card-header">
                <span className="sp-step-num">1</span>
                <ListOrdered size={18} />
                <h3>Select Device</h3>
              </div>
              <div className="sp-card-body">
                <label htmlFor="deviceId">Which device should we pick up?</label>
                <select
                  id="deviceId"
                  name="deviceId"
                  value={formData.deviceId}
                  onChange={handleChange}
                  className="sp-select"
                  required
                >
                  <option value="" disabled>Choose a device…</option>
                  {devices.map((d) => (
                    <option key={d._id || d.id} value={d._id || d.id}>
                      {d.brand} {d.modelName} — {d.category}
                    </option>
                  ))}
                </select>

                {/* Device info preview */}
                {selectedDevice && (
                  <div className="sp-device-preview">
                    <div className="sp-preview-row">
                      <span className="sp-preview-label">Brand</span>
                      <span>{selectedDevice.brand}</span>
                    </div>
                    <div className="sp-preview-row">
                      <span className="sp-preview-label">Model</span>
                      <span>{selectedDevice.modelName}</span>
                    </div>
                    <div className="sp-preview-row">
                      <span className="sp-preview-label">Category</span>
                      <span>{selectedDevice.category}</span>
                    </div>
                    <div className="sp-preview-row">
                      <span className="sp-preview-label">Condition</span>
                      <span>{selectedDevice.condition}</span>
                    </div>
                    <div className="sp-preview-row">
                      <span className="sp-preview-label">Estimated Reward</span>
                      <span className="sp-reward">₹{selectedDevice.creditValue || selectedDevice.credit_value || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── STEP 2: Pickup Address ── */}
            <div className="sp-card">
              <div className="sp-card-header">
                <span className="sp-step-num">2</span>
                <MapPin size={18} />
                <h3>Pickup Location</h3>
              </div>
              <div className="sp-card-body">
                <label htmlFor="pickupAddress">Full Pickup Address</label>
                <textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="Enter your complete home/office address including street, landmark, city, and PIN code"
                  required
                  className="sp-textarea"
                  rows={4}
                />
              </div>
            </div>

            {/* ── STEP 3: Date & Time ── */}
            <div className="sp-card">
              <div className="sp-card-header">
                <span className="sp-step-num">3</span>
                <CalendarClock size={18} />
                <h3>Preferred Date & Slot</h3>
              </div>
              <div className="sp-card-body">
                <div className="sp-grid-2">
                  <div>
                    <label htmlFor="preferredDate">Select Date</label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      min={minDate}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      className="sp-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredTime">Select Time Slot</label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="sp-select"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time slot cards */}
                <div className="sp-slot-cards">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`sp-slot-card ${formData.preferredTime === slot ? 'selected' : ''}`}
                      onClick={() => setFormData((p) => ({ ...p, preferredTime: slot }))}
                    >
                      <Clock size={14} />
                      {slot}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <label htmlFor="specialInstructions">Special Instructions <span className="sp-optional">(Optional)</span></label>
                  <input
                    type="text"
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="e.g., Call on arrival, Ring doorbell, Gate code: 1234"
                    className="sp-input"
                  />
                </div>
              </div>
            </div>

            {/* ── Info Banner ── */}
            <div className="sp-info-banner">
              <Info size={16} />
              <span>Pickup is completely <strong>free of charge</strong>. You'll earn your recycling credits once our agent confirms collection.</span>
            </div>

            {/* ── Submit ── */}
            <button type="submit" className="sp-btn sp-btn-primary sp-submit" disabled={submitting}>
              {submitting ? (
                <><div className="sp-btn-spinner" /> Scheduling…</>
              ) : (
                <><CheckCircle size={20} /> Confirm Pickup</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SchedulePickup;
