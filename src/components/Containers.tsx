import React from 'react';
import './Sections.css';

const Containers: React.FC = () => {
  return (
    <div className="section-container">
      <h1 className="section-title">Containers</h1>
      <div className="maintenance-box">
        <h2>🚧 Under Maintenance 🚧</h2>
        <p>We're currently updating our container services information.</p>
        <p>Please check back soon for:</p>
        <ul>
          <li>Container types and specifications</li>
          <li>Rental and purchase options</li>
          <li>Delivery services</li>
          <li>Custom container solutions</li>
        </ul>
      </div>
      <div className="info-grid">
        <div className="info-card">
          <h3>Standard Containers</h3>
          <p>Information coming soon...</p>
        </div>
        <div className="info-card">
          <h3>Specialized Containers</h3>
          <p>Information coming soon...</p>
        </div>
        <div className="info-card">
          <h3>Container Services</h3>
          <p>Information coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Containers;
