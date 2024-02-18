import React, { useState, useEffect } from 'react';
import './App.css';
import TopBarMenu from './components/TopBarMenu';
import Vehicles from './components/Vehicles';
import Drivers from './components/Drivers';
import NewVehicleForm from './components/NewVehicleForm'
import NewDriverForm from './components/NewDriverForm';
import PetrolStation from './components/PetrolStation';
import Parking from './components/Parking';
import Settings from './components/Settings';
import Help from './components/Help';
import './locales/i18n';

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  const [activeComponent, setActiveComponent] = useState('vehicles');

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

  //==============================
  //========= SECURITY ===========
  //==============================

  const [ShowRestrictedData, setShowRestrictedData] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowRestrictedData(user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_MANAGER") || user.roles.includes("ROLE_DRIVER"));
    }
  }, []);

  return (
    <div>
      {currentUser === undefined && (
        <div className="content">
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav mr-auto">
              <img src="./images/LogoCarPal(Croped).png" alt="CarPal Logo" />
            </div>
            <br />
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
              <br />
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          </nav>

          <div className="container mt-3">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      )}

      {ShowRestrictedData && (
        <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
          <TopBarMenu onComponentChange={handleComponentChange} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          {activeComponent === 'vehicles' && <Vehicles isDarkMode={isDarkMode} />}
          {activeComponent === 'newvehicleform' && <NewVehicleForm onVehicleAdded={handleVehicleAdded} />}
          {activeComponent === 'newdriverform' && <NewDriverForm onDriverAdded={handleDriverAdded} />}
          {activeComponent === 'drivers' && <Drivers isDarkMode={isDarkMode} />}
          {activeComponent === 'petrolstation' && <PetrolStation />}
          {activeComponent === 'parking' && <Parking />}
          {activeComponent === 'help' && <Help />}
          {activeComponent === 'settings' && <Settings isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
        </div>
      )}

    </div>
  );
};

export default App;