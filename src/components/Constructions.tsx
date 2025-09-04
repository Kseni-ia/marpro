import React from 'react';
import './Sections.css';

const Constructions: React.FC = () => {
  return (
    <div className="section-container">
      <h1 className="section-title">Constructions</h1>
      <div className="maintenance-box">
        <h2>🚧 Under Maintenance 🚧</h2>
        <p>We're currently updating our construction services information.</p>
        <p>Please check back soon for:</p>
        <ul>
          <li>Construction project types</li>
          <li>Our portfolio and past projects</li>
          <li>Engineering and design services</li>
          <li>Project management solutions</li>
        </ul>
      </div>
      <div className="info-grid">
        <div className="info-card">
          <h3>Residential Projects</h3>
          <p>Information coming soon...</p>
        </div>
        <div className="info-card">
          <h3>Commercial Projects</h3>
          <p>Information coming soon...</p>
        </div>
        <div className="info-card">
          <h3>Infrastructure</h3>
          <p>Information coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Constructions;
