import React, { useState, useEffect } from 'react';
import './styles/App.css';
import TopBarMenu from './TopBarMenu';
import Vehicles from './Vehicles';
import Drivers from './Drivers';
import NewVehicleForm from './NewVehicleForm'
import NewDriverForm from './NewDriverForm';
import PetrolStation from './PetrolStation';
import Parking from './Parking';
import Settings from './Settings';
import '../locales/i18n';

function App() {
  const [activeComponent, setActiveComponent] = useState('vehicles'); // Default to 'vehicles'
  
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const handleVehicleAdded = () => {
    setActiveComponent('vehicles');
  };

  const handleDriverAdded = () => {
    setActiveComponent('drivers');
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <TopBarMenu onComponentChange={handleComponentChange} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      {activeComponent === 'vehicles' && <Vehicles isDarkMode={isDarkMode} />}
      {activeComponent === 'newvehicleform' && <NewVehicleForm onVehicleAdded={handleVehicleAdded} />}
      {activeComponent === 'newdriverform' && <NewDriverForm onDriverAdded={handleDriverAdded} />}
      {activeComponent === 'drivers' && <Drivers isDarkMode={isDarkMode} />}
      {activeComponent === 'petrolstation' && <PetrolStation />}
      {activeComponent === 'parking' && <Parking />}
      {activeComponent === 'settings' && <Settings isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
    </div>
  );
}

export default App;