import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MonitorSmartphone, 
  Cpu, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { registerEwasteDevice } from '../services/api.js';
import './RegisterDevice.css';

const RegisterDevice = () => {
  const [formData, setFormData] = useState({
    category: 'Mobile phones',
    brand: '',
    modelName: '',
    condition: 'Working',
    approximateAge: 'Less than 1 year',
    disposalMethod: 'Home Pickup',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'Mobile phones', 'Laptops', 'Tablets', 'Televisions', 
    'Printers', 'Computer accessories', 'Batteries'
  ];

  const conditions = [
    'Working', 'Not Working', 'Broken Screen/Parts', 'Unknown'
  ];

  const ages = [
    'Less than 1 year', '1-2 years', '2-5 years', 'More than 5 years'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await registerEwasteDevice(formData, userInfo.token);
      
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to register device');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container section form-success-container">
        <div className="success-box glass animate-fade-in">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={64} className="success-icon" />
          </div>
          <h2>Device Registered Successfully!</h2>
          <p>Your {formData.category} has been logged. You will be redirected to your dashboard shortly.</p>
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-device-page">
      <div className="container device-form-container">
        
        <div className="form-header glass animate-fade-in">
           <div className="header-icon-wrapper">
             <MonitorSmartphone size={32} />
           </div>
           <div>
             <h2>Register Your E-Waste</h2>
             <p>Provide details about your electronic device to help us process it properly and calculate your rewards.</p>
           </div>
        </div>

        {error && <div className="form-alert danger-bg"><AlertCircle size={20} /> {error}</div>}

        <form onSubmit={handleSubmit} className="device-registration-form glass animate-fade-in">
          
          {/* Step 1: Device Details */}
          <div className="form-section">
            <h3 className="section-subtitle"><Cpu size={20} /> <span className="text-gradient">Device Details</span></h3>
            
            <div className="form-grid">
              <div className="form-group row-span-full">
                <label>Device Category</label>
                <div className="category-chips">
                  {categories.map(cat => (
                    <div 
                      key={cat}
                      className={`chip ${formData.category === cat ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, category: cat})}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., Apple, Samsung, Dell"
                  required
                  className="fancy-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="modelName">Model Name / Number</label>
                <input
                  type="text"
                  id="modelName"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleChange}
                  placeholder="e.g., iPhone 12, XPS 15"
                  required
                  className="fancy-input"
                />
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Step 2: Condition & Age */}
          <div className="form-section">
            <h3 className="section-subtitle"><Calendar size={20} /> <span className="text-gradient">Condition & Age</span></h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="condition">Current Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="fancy-select"
                >
                  {conditions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="approximateAge">Approximate Age</label>
                <select
                  id="approximateAge"
                  name="approximateAge"
                  value={formData.approximateAge}
                  onChange={handleChange}
                  className="fancy-select"
                >
                  {ages.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Step 3: Disposal Method */}
          <div className="form-section">
            <h3 className="section-subtitle"><MapPin size={20} /> <span className="text-gradient">Disposal Preference</span></h3>
            
            <div className="radio-group">
              <label className={`radio-card ${formData.disposalMethod === 'Home Pickup' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="disposalMethod" 
                  value="Home Pickup"
                  checked={formData.disposalMethod === 'Home Pickup'}
                  onChange={handleChange}
                />
                <div className="radio-content">
                  <h4>🏡 Home Pickup</h4>
                  <p>Our agents will collect it from your registered address.</p>
                </div>
              </label>

              <label className={`radio-card ${formData.disposalMethod === 'Center Drop-off' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="disposalMethod" 
                  value="Center Drop-off"
                  checked={formData.disposalMethod === 'Center Drop-off'}
                  onChange={handleChange}
                />
                <div className="radio-content">
                  <h4>📍 Center Drop-off</h4>
                  <p>You will drop it off at the nearest collection center.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-device-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Register Device'} <ArrowRight size={20} />
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default RegisterDevice;
