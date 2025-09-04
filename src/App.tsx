import React, { useState } from 'react';
import './App.css';
import Containers from './components/Containers';
import Excavators from './components/Excavators';
import Constructions from './components/Constructions';
import AnimatedLogo from './components/AnimatedLogo';
import logo from './logo.svg';

type Section = 'home' | 'containers' | 'excavators' | 'constructions';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'containers':
        return <Containers />;
      case 'excavators':
        return <Excavators />;
      case 'constructions':
        return <Constructions />;
      default:
        return (
          <div className="home-content">
            <AnimatedLogo />
            <p>Select a section to explore our services</p>
            <div className="section-cards">
              <div className="section-card" onClick={() => setActiveSection('containers')}>
                <h3>Containers</h3>
                <p>Explore our container solutions</p>
              </div>
              <div className="section-card" onClick={() => setActiveSection('excavators')}>
                <h3>Excavators</h3>
                <p>Discover our excavator services</p>
              </div>
              <div className="section-card" onClick={() => setActiveSection('constructions')}>
                <h3>Constructions</h3>
                <p>View our construction projects</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <div className="header-container">
        <img 
          src={logo} 
          alt="MARPRO" 
          className="logo-top-left" 
          onClick={() => setActiveSection('home')}
        />
        <nav className="nav-container">
          <button 
            className={`nav-button ${activeSection === 'containers' ? 'active' : ''}`}
            onClick={() => setActiveSection('containers')}
          >
            Containers
          </button>
          <button 
            className={`nav-button ${activeSection === 'excavators' ? 'active' : ''}`}
            onClick={() => setActiveSection('excavators')}
          >
            Excavators
          </button>
          <button 
            className={`nav-button ${activeSection === 'constructions' ? 'active' : ''}`}
            onClick={() => setActiveSection('constructions')}
          >
            Constructions
          </button>
        </nav>
      </div>
      <main className="App-main">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;
