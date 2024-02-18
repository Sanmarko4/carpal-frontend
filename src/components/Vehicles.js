import React, { useState, useEffect } from 'react';
import EditVehicle from './EditVehicle';
import './styles/Vehicles.css';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

function Vehicles({ isDarkMode }) {
  const vehiclesClassName = `VehiclesList ${isDarkMode ? 'dark-mode' : ''}`;
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const { t } = useTranslation();

  //==============================
  //===== CHECK USER ROLE =======
  //==============================

  const currentUser = AuthService.getCurrentUser();
  const isAdminOrManager = currentUser && (currentUser.roles.includes("ROLE_ADMIN") || currentUser.roles.includes("ROLE_MANAGER"));
  
  //==============================
  //===== VEHICLES DISPLAY ======
  //==============================

  useEffect(() => {
    UserService.getVehicles()
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

  //==============================
  //===== VEHICLE DATA EDIT =====
  //==============================

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleUpdate = () => {
    UserService.getVehicles()
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

  //==============================
  //======= VEHICLE REMOVE ======
  //==============================

  const handleRemove = (id) => {
    if (window.confirm(t('removeVehicle?'))) {
      UserService.deleteVehicle (id)
        .then(() => {
          setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        })
        .catch(error => console.error("Error removing vehicle:", error));
    }
  };

  //==============================
  //======= DRIVER DETACH =======
  //==============================

  const handleDetach = (vehicleId) => {
    if (window.confirm(t('detachDriver?'))) {
      const vehicleToDetach = vehicles.find(v => v.id === vehicleId);
      const updatedVehicle = { ...vehicleToDetach, driver: null };
      UserService.detachVehicleFromDriver (updatedVehicle)
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

  //==============================
  //======= DATES COLORING ======
  //==============================

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

  //==============================
  //======== DATA SORTING =======
  //==============================

  const compareDrivers = (a, b) => {
    const nameA = a.driver ? `${a.driver.firstName} ${a.driver.secondName}` : '';
    const nameB = b.driver ? `${b.driver.firstName} ${b.driver.secondName}` : '';
    return nameA.localeCompare(nameB);
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      // If already sorting by the same criteria, reverse the order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new criteria, set the new criteria and default to ascending order
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  let sortedVehicles = [...vehicles];
  if (sortBy) {
    sortedVehicles.sort((a, b) => {
      switch (sortBy) {
        case 'driver':
          return sortOrder === 'asc' ? compareDrivers(a, b) : compareDrivers(b, a);
        case 'insurance':
          return sortOrder === 'asc' ? new Date(a.insurenceExpiryDate) - new Date(b.insurenceExpiryDate) : new Date(b.insurenceExpiryDate) - new Date(a.insurenceExpiryDate);
        case 'inspection':
          return sortOrder === 'asc' ? new Date(a.inspectionExpiryDate) - new Date(b.inspectionExpiryDate) : new Date(b.inspectionExpiryDate) - new Date(a.inspectionExpiryDate);
        case 'service':
          return sortOrder === 'asc' ? new Date(a.nextServiceDate) - new Date(b.nextServiceDate) : new Date(b.nextServiceDate) - new Date(a.nextServiceDate);
        default:
          return 0;
      }
    });
  }

  //==============================
  //======== R E T U R N ========
  //==============================

  return (
    <div className={vehiclesClassName}>  
    <div className="sort-options"><div className="text1">{t('Sort by')}</div>
    <button onClick={() => handleSort('driver')} className="sort-btn">{t('ByName')}</button>
    <button onClick={() => handleSort('insurance')} className="sort-btn2">{t('byInsurance')}</button>
    <button onClick={() => handleSort('inspection')} className="sort-btn">{t('byInspection')}</button>
    <button onClick={() => handleSort('service')} className="sort-btn2">{t('byService')}</button>
  </div>
  <div></div>
  {sortedVehicles.map((vehicle) => (
        <div key={vehicle.id} className="Vehicle">
          <div>
          <img 
          src={vehicle.imageUrl || '/images/Vehicle.png'} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="vehicle-image" />
          </div>
          <div className="vehicle-actions">
          {isAdminOrManager && (
              <React.Fragment>
          <button onClick={() => handleEdit(vehicle)} className="edit-btn">{t('edit')}</button>
          <br />
          <button onClick={() => handleRemove(vehicle.id)} className="remove-btn">{t('remove')}</button>    
          </React.Fragment>
          )}      
          <h2>🤵 {vehicle.driver ? (
          <>
          {vehicle.driver.firstName} {vehicle.driver.secondName}
          </>
          ) : t('noDriver')}</h2>
          {isAdminOrManager && (
          <button onClick={() => handleDetach(vehicle.id)} className="remove-btn">{t('detach')}</button>
          )}
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
