import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, MonitorSmartphone, Coins, ShieldCheck, Truck, Earth } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container animate-fade-in">
          <div className="hero-content">
            <div className="badge">
              <span className="live-dot"></span> Smart E-Waste Recycling
            </div>
            <h1>Turn Your Old Tech Into <span className="text-gradient">Green Rewards</span></h1>
            <p>
              Join the movement for a sustainable future. Dispose of electronic waste responsibly, 
              request free home pickups, and earn real monetary rewards for your contribution.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Register <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">12k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-value">45k+</span>
                <span className="stat-label">Devices Recycled</span>
              </div>
              <div className="stat">
                <span className="stat-value">₹2.4M</span>
                <span className="stat-label">Rewards Paid</span>
              </div>
            </div>
          </div>
          <div className="hero-image-wrapper">
            {/* Using a highly aesthetic illustration/mockup representation */}
            <div className="glass-card hero-glass-card">
              <Recycle size={80} className="hero-icon floating-animation" />
              <h3>Recycle & Earn</h3>
              <p>Your wallet grows while the Earth heals.</p>
              <div className="progress-bar-container">
                <span className="progress-label">Global Impact</span>
                <div className="progress-track">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="info-section section">
        <div className="container">
          <div className="section-title">
            <h2>Why Recycle E-Waste?</h2>
            <p>Electronic waste is the fastest-growing waste stream in the world.</p>
          </div>
          
          <div className="info-grid">
            <div className="info-card">
              <div className="icon-wrapper danger-bg">
                <MonitorSmartphone size={32} />
              </div>
              <h3>The Growing Problem</h3>
              <p>Millions of devices end up in landfills every year, leaching toxic chemicals like lead and mercury into the soil and water.</p>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper warning-bg">
                <Earth size={32} />
              </div>
              <h3>Environmental Impact</h3>
              <p>Improper disposal accelerates climate change and destroys natural habitats. Recycling recovers valuable materials and reduces mining.</p>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper success-bg">
                <Recycle size={32} />
              </div>
              <h3>The Solution</h3>
              <p>By using EcoSync, you ensure that your old electronics are safely refurbished, reused, or recycled while earning rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Features Section */}
      <section className="features-section section">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2>How EcoSync Works</h2>
              <p className="features-desc">
                We've made responsible recycling as effortless and rewarding as possible. 
                Our platform connects you with certified recycling centers in just a few clicks.
              </p>
              
              <ul className="feature-list">
                <li className="feature-item">
                  <div className="feature-icon"><ShieldCheck size={24} /></div>
                  <div className="feature-details">
                    <h4>1. Easy Registration</h4>
                    <p>Create an account and register the devices you want to dispose of.</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon"><Truck size={24} /></div>
                  <div className="feature-details">
                    <h4>2. Free Home Pickup</h4>
                    <p>Schedule a convenient time, and our agents will collect it from your doorstep.</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon"><Coins size={24} /></div>
                  <div className="feature-details">
                    <h4>3. Earn Real Money</h4>
                    <p>Get credits instantly upon pickup. Withdraw to your bank once you reach the minimum threshold.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="features-visual">
              <div className="app-preview glass">
                 <div className="preview-header">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                 </div>
                 <div className="preview-body">
                   <div className="wallet-card">
                     <h5>Total Balance</h5>
                     <h2>₹ 1,240.00</h2>
                     <button className="btn btn-primary compact-btn">Withdraw Funds</button>
                   </div>
                   <div className="recent-activity">
                     <h6>Recent Activity</h6>
                     <div className="activity-item">
                       <span className="activity-icon"><MonitorSmartphone size={16} /></span>
                       <div className="activity-text">
                         <span>Old Laptop</span>
                         <small>Picked up today</small>
                       </div>
                       <span className="activity-amount">+ ₹120</span>
                     </div>
                     <div className="activity-item">
                       <span className="activity-icon"><MonitorSmartphone size={16} /></span>
                       <div className="activity-text">
                         <span>Broken Smartphone</span>
                         <small>Completed</small>
                       </div>
                       <span className="activity-amount">+ ₹40</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-box glass">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of users who are getting paid to protect the environment.</p>
            <div className="cta-buttons">
              <Link to="/register-device" className="btn btn-primary btn-lg">Start Recycling</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
