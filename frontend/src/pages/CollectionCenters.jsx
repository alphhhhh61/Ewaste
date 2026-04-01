import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Clock, 
  Phone, 
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { getCollectionCenters } from '../services/api.js';
import './CollectionCenters.css';

const CollectionCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const data = await getCollectionCenters();
        setCenters(data);
        setLoading(false);
      } catch {
        setError('Failed to load collection centers.');
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(center => 
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="centers-page container section">
      <div className="centers-header">
        <div className="header-content">
          <h2>Collection Centers</h2>
          <p className="text-secondary">Find the nearest certified drop-off locations for your e-waste.</p>
        </div>
        
        <div className="search-bar glass">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by city, name, or address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="form-alert danger-bg">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Locating centers near you...</p>
        </div>
      ) : (
        <div className="centers-grid">
          {filteredCenters.length > 0 ? (
            filteredCenters.map(center => (
              <div key={center._id} className="center-card glass">
                <div className="center-card-header">
                  <h3>{center.name}</h3>
                  <span className="distance-badge"><MapPin size={14} /> {center.distance}</span>
                </div>
                
                <div className="center-info">
                  <div className="info-row">
                    <MapPin size={18} className="info-icon" />
                    <span>{center.address}, {center.city}</span>
                  </div>
                  <div className="info-row">
                    <Clock size={18} className="info-icon" />
                    <span>{center.operatingHours}</span>
                  </div>
                  <div className="info-row">
                    <Phone size={18} className="info-icon" />
                    <span>{center.contactNumber}</span>
                  </div>
                </div>

                <div className="accepted-items">
                  <h4><CheckCircle2 size={16} /> Accepted Items</h4>
                  <div className="chips-container">
                    {center.acceptedCategories.map(cat => (
                      <span key={cat} className="mini-chip">{cat}</span>
                    ))}
                  </div>
                </div>

                <div className="center-actions">
                  <button className="btn btn-secondary w-100 get-directions-btn">
                    <Navigation size={18} /> Get Directions
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results glass">
              <MapPin size={48} className="text-secondary mb-2" />
              <h3>No centers found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionCenters;
