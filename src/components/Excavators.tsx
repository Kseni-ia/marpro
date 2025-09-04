import React from 'react';
import './Sections.css';

const Excavators: React.FC = () => {
  return (
    <div className="section-container">
      <h1 className="section-title">Excavators</h1>
      <div className="maintenance-box">
        <h2>🚧 Under Maintenance 🚧</h2>
        <p>We're currently updating our excavator services information.</p>
        <p>Please check back soon for:</p>
        <ul>
          <li>Excavator types and models</li>
          <li>Equipment specifications</li>
          <li>Rental rates and availability</li>
          <li>Operator services</li>
        </ul>
      </div>
      <div className="info-grid">
        <div className="info-card">
          <h3>Equipment Fleet</h3>
          <p>Information coming soon...</p>
        </div>
        <div className="info-card">
          <h3>Services</h3>
          <p>Information coming soon...</p>
        </div>
        <div className="info-card">
          <h3>Projects</h3>
          <p>Information coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Excavators;
