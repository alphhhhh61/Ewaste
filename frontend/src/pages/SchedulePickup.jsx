import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Truck, 
  CalendarClock, 
  MapPin, 
  ListOrdered,
  AlertCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import './SchedulePickup.css';

const SchedulePickup = () => {
  const [searchParams] = useSearchParams();
  const preSelectedDeviceId = searchParams.get('device');

  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    deviceId: preSelectedDeviceId || '',
    pickupAddress: '',
    preferredDate: '',
    preferredTime: 'Morning (9 AM - 12 PM)',
    specialInstructions: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEligibleDevices = async () => {
      try {
        setLoading(true);
        // Replace with actual API Call when ready
        // const userInfoStr = localStorage.getItem('userInfo');
        // const { token } = JSON.parse(userInfoStr);
        // const userDevices = await getMyDevices(token);

        setTimeout(() => {
          // Mock fetching ONLY 'Registered' devices meant for 'Home Pickup'
          const mockDevices = [
            { _id: '1a', brand: 'Samsung', modelName: 'Galaxy S20', category: 'Mobile phones', status: 'Registered' },
            { _id: '2b', brand: 'LG', modelName: 'Washing Machine', category: 'Home Appliances', status: 'Registered' },
          ];
          
          setDevices(mockDevices);
          
          if (mockDevices.length > 0 && !formData.deviceId) {
            setFormData(prev => ({ ...prev, deviceId: mockDevices[0]._id }));
          }
          
          setLoading(false);
        }, 800);
      } catch {
        setError('Failed to load eligible devices');
        setLoading(false);
      }
    };

    fetchEligibleDevices();
  }, [formData.deviceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deviceId) {
      setError('Please select a device for pickup');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Mock Submission
      setTimeout(() => {
        setSuccess(true);
        setSubmitting(false);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2500);
      }, 1000);
    } catch {
      setError('Failed to schedule pickup');
      setSubmitting(false);
    }
  };

  // Get minimum date for pickup (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (success) {
    return (
      <div className="container section form-success-container">
        <div className="success-box glass animate-fade-in">
          <div className="success-icon-wrapper warning-bg">
            <Truck size={64} className="success-icon" style={{color: 'white'}} />
          </div>
          <h2>Pickup Scheduled!</h2>
          <p>Our agent will arrive at your address on the specified date and time.</p>
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-page">
      <div className="container device-form-container">
        <div className="form-header glass animate-fade-in">
           <div className="header-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
             <Truck size={32} />
           </div>
           <div>
             <h2>Schedule Free Pickup</h2>
             <p>Select your registered device and choose a convenient time for our agent to collect it.</p>
           </div>
        </div>

        {error && <div className="form-alert danger-bg"><AlertCircle size={20} /> {error}</div>}

        <form onSubmit={handleSubmit} className="device-registration-form glass animate-fade-in">
          
          {loading ? (
             <div className="p-4 text-center text-secondary">Loading available devices...</div>
          ) : devices.length === 0 ? (
            <div className="empty-state">
              <ListOrdered size={48} className="empty-icon text-secondary" />
              <h4>No Eligible Devices</h4>
              <p className="text-secondary">You don't have any devices registered for Home Pickup that need scheduling.</p>
              <button 
                type="button" 
                className="btn btn-primary mt-3"
                onClick={() => navigate('/register-device')}
              >
                Register a Device
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Select Device */}
              <div className="form-section">
                <h3 className="section-subtitle"><ListOrdered size={20} /> <span className="text-gradient">Select Item</span></h3>
                
                <div className="form-group">
                  <label htmlFor="deviceId">Which device should we pick up?</label>
                  <select
                    id="deviceId"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleChange}
                    className="fancy-select"
                    required
                  >
                    <option value="" disabled>Select a device...</option>
                    {devices.map(device => (
                      <option key={device._id} value={device._id}>
                        {device.brand} {device.modelName} ({device.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="divider" />

              {/* Step 2: Address */}
              <div className="form-section">
                <h3 className="section-subtitle"><MapPin size={20} /> <span className="text-gradient">Pickup Location</span></h3>
                
                <div className="form-group">
                  <label htmlFor="pickupAddress">Full Address</label>
                  <textarea
                    id="pickupAddress"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    placeholder="Enter your complete home/office address including landmark"
                    required
                    className="fancy-input"
                    rows="3"
                  />
                </div>
              </div>

              <hr className="divider" />

              {/* Step 3: Date & Time */}
              <div className="form-section">
                <h3 className="section-subtitle"><CalendarClock size={20} /> <span className="text-gradient">Preferred Slot</span></h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="preferredDate">Select Date</label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      min={minDate}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      className="fancy-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredTime">Select Time Slot</label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="fancy-select"
                    >
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                      <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                  <input
                    type="text"
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="e.g., Call upon arrival, Ring doorbell"
                    className="fancy-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary submit-device-btn" disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Confirm Pickup'} <CheckCircle size={20} />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SchedulePickup;
