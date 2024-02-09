import React, { useState, useEffect } from 'react';
import EditVehicle from './EditVehicle';
import './styles/Vehicles.css';
import config from '../config';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Vehicles({ isDarkMode }) {
  const vehiclesClassName = `VehiclesList ${isDarkMode ? 'dark-mode' : ''}`;
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    axios.get(`${config.API_ROOT_PATH}/vehicles`)
      .then(response => {
        setVehicles(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the vehicle data:", error);
      });
  }, []);

  if (vehicles.length === 0) {
    return <div className="no-vehicles-message">{t('noVehicles')}</div>;
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleUpdate = () => {
    axios.get(`${config.API_ROOT_PATH}/vehicles`)
      .then(response => {
        setVehicles(response.data);
        window.scrollTo(0, 0);// Scroll to the top of the page
      })
      .catch(error => {
        console.error("Error fetching updated vehicles list:", error);
      });
    setEditingVehicle(null);
  };

  if (editingVehicle) {
    return <EditVehicle vehicle={editingVehicle} onUpdate={handleUpdate} />;
  }

  const handleRemove = (id) => {
    if (window.confirm(t('removeVehicle?'))) {
      axios.delete(`${config.API_ROOT_PATH}/deletevehicle/${id}`)
        .then(() => {
          setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        })
        .catch(error => console.error("Error removing vehicle:", error));
    }
  };

  const handleDetach = (vehicleId) => {
    if (window.confirm(t('detachDriver?'))) {
      const vehicleToDetach = vehicles.find(v => v.id === vehicleId);
      const updatedVehicle = { ...vehicleToDetach, driver: null };
      axios.put(`${config.API_ROOT_PATH}/seperatevehiclefromdriver`, updatedVehicle)
        .then(() => {
          const updatedVehicles = vehicles.map(v => {
            if (v.id === vehicleId) {
              return updatedVehicle;
            }
            return v;
          });
          setVehicles(updatedVehicles);
        })
        .catch(error => console.error("Error detaching driver from vehicle:", error));
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
    <div className={vehiclesClassName}>
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="Vehicle">
          <div>
          <img 
          src={vehicle.imageUrl || '/images/Vehicle.png'} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="vehicle-image" />
          </div>
          <div className="vehicle-actions">
          <button onClick={() => handleEdit(vehicle)} className="edit-btn">{t('edit')}</button>
          <br />
          <button onClick={() => handleRemove(vehicle.id)} className="remove-btn">{t('remove')}</button>          
          <h2>🤵 {vehicle.driver ? (
          <>
          {vehicle.driver.firstName} {vehicle.driver.secondName}
          </>
          ) : t('noDriver')}</h2>
          <button onClick={() => handleDetach(vehicle.id)} className="remove-btn">{t('detach')}</button>
          </div>
          <div className="vehicle-details">
            <h1>{t('vehicle')}: {vehicle.plateNumber}</h1>
            <h3>{t('make')}: {vehicle.make}</h3>
            <h3>{t('model')}: {vehicle.model}</h3>
            <h3>{t('year')}: {vehicle.year}</h3>
            <h3>{t('color')}: {vehicle.color}</h3>
            <h3>{t('VIN')}: {vehicle.vin}</h3>
            <h3>
            {t('insurance')}:
            <span className={`dates ${calculateExpirity(vehicle.insurenceExpiryDate)}`}>
            {vehicle.insurenceExpiryDate}
            {calculateExpirity(vehicle.insurenceExpiryDate) === 'red' && '⚠️'}
            </span>
            </h3>
            <h3>
            {t('inspection')}:
            <span className={`dates ${calculateExpirity(vehicle.inspectionExpiryDate)}`}>
            {vehicle.inspectionExpiryDate}
            {calculateExpirity(vehicle.inspectionExpiryDate) === 'red' && '⚠️'}
            </span>
            </h3>
            <h3>
            {t('service')}:
            <span className={`dates ${calculateExpirity(vehicle.nextServiceDate)}`}>
            {vehicle.nextServiceDate}
            {calculateExpirity(vehicle.nextServiceDate) === 'red' && '⚠️'}
            </span>
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Vehicles;
