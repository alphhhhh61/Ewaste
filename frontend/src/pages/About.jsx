import { Leaf, Recycle, Globe, ShieldCheck } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page container section">
      
      {/* Hero Section */}
      <div className="about-hero glass animate-fade-in">
        <div className="hero-content">
          <h1>Pioneering a Greener Tomorrow</h1>
          <p className="subtitle">
            EcoSync is a dedicated platform designed to revolutionize the way we manage electronic waste, turning your old devices into sustainable impact and rewards.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-section mb-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="section-header text-center mb-4">
          <Leaf className="section-icon text-primary mx-auto mb-2" size={32} />
          <h2>Our Mission</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            We believe that obsolete technology shouldn't mean a compromised environment. Our mission is to provide an accessible, transparent, and rewarding process for households and businesses to safely dispose of their electronic waste.
          </p>
        </div>
      </div>

      {/* Why it matters Grid */}
      <div className="why-it-matters mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-center mb-4">Why E-Waste Recycling Matters</h3>
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon-wrapper danger-bg">
              <Globe size={24} className="text-danger" />
            </div>
            <h4>Toxic Hazard Prevention</h4>
            <p className="text-secondary">E-waste contains harmful materials like lead and mercury. Proper recycling prevents these toxins from polluting our soil and water.</p>
          </div>
          
          <div className="feature-card glass">
            <div className="feature-icon-wrapper success-bg">
              <Recycle size={24} className="text-success" />
            </div>
            <h4>Resource Recovery</h4>
            <p className="text-secondary">Electronics contain valuable materials like gold, silver, and copper. Recycling reduces the need to mine for new raw materials.</p>
          </div>
          
          <div className="feature-card glass">
            <div className="feature-icon-wrapper primary-bg">
              <ShieldCheck size={24} className="text-primary" />
            </div>
            <h4>Data Security</h4>
            <p className="text-secondary">We ensure certified data destruction on all collected devices, protecting your personal information before the hardware is recycled.</p>
          </div>
        </div>
      </div>

      {/* The EcoSync Process */}
      <div className="process-section glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="mb-4">How EcoSync Works</h3>
        <ul className="process-list">
          <li>
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Register Your Device</h4>
              <p className="text-secondary">Sign up and log details about your old electronics. Discover the estimated eco-credits your device is worth.</p>
            </div>
          </li>
          <li>
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Schedule or Drop Off</h4>
              <p className="text-secondary">Choose a convenient free home pickup or find a certified drop-off center near your location.</p>
            </div>
          </li>
          <li>
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Earn Rewards</h4>
              <p className="text-secondary">Once your device reaches our recycling facility, your wallet is credited instantly. Convert credits to real money!</p>
            </div>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default About;
