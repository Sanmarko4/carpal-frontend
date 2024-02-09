import React, { useState, useEffect } from 'react';
import EditDriver from './EditDriver';
import './styles/Drivers.css';
import config from '../config';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Drivers({ isDarkMode }) {
  const driverClassName = `VehiclesList ${isDarkMode ? 'dark-mode' : ''}`;
  const [drivers, setDrivers] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    axios.get(`${config.API_ROOT_PATH}/drivers`)
      .then(response => {
        setDrivers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the drivers data:", error);
      });
  }, []);

  if (drivers.length === 0) {
    return <div className="no-drivers-message">{t('noDrivers')}</div>;
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver);
  };

  const handleUpdate = (updatedDriver) => {
    const updatedDrivers = drivers.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    );
    setDrivers(updatedDrivers);
    setEditingDriver(null);
  };

if (editingDriver) {
    return <EditDriver driver={editingDriver} onUpdate={handleUpdate} />;
  }

  const handleRemove = (id) => {
    if (window.confirm(t('removeDriver?'))) {
      axios.delete(`${config.API_ROOT_PATH}/deletedriver/${id}`)
        .then(() => {
          setDrivers(drivers.filter(driver => driver.id !== id));
        })
        .catch(error => {
          if (error.response && error.response.status === 500) {
            alert(t('detachFirst'));
          } else {
            console.error("Error removing driver:", error);
          }
        });
    }
  };

  const calculateExpirity = (expiryDate) => {
    const currentDate = new Date();
    const expirationDate = new Date(expiryDate);
    const timeDifference = expirationDate - currentDate;
    const daysDifference = timeDifference / (24 * 60 * 60 * 1000);
  
    if (daysDifference <= 0) {
      return 'red';
    } else if (daysDifference <= 21) {
      return 'orange';
    } else {
      return 'green';
    }
  };

  return (
    <div className={driverClassName}>
      {drivers.map((driver) => (
        <div key={driver.id} className="Driver">
          <div>
          <img 
          src={driver.imageUrl || '/images/Driver.png'}
          alt={`${driver.firstName} ${driver.secondName}`} 
          className="driver-image" />
          </div>
          <div className="vehicle-actions">
          <button onClick={() => handleEdit(driver)} className="edit-btn">{t('edit')}</button>
          <br />
          <button onClick={() => handleRemove(driver.id)} className="remove-btn">{t('remove')}</button>
          </div>
          <div className="driver-details">
            <h1>{t('driver')}</h1>
            <h3>{t('firstName')}: {driver.firstName}</h3>
            <h3>{t('secondName')}: {driver.secondName}</h3>
            <h3>{t('driverLicenseNumber')}: {driver.driverLicenseNumber}</h3>
            <h3>
            {t('licenseEexpiryDate')}:
            <span className={`dates ${calculateExpirity(driver.licenseExpiryDate)}`}>
            {driver.licenseExpiryDate}
            {calculateExpirity(driver.licenseExpiryDate) === 'red' && '⚠️'}
            </span>
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Drivers;
