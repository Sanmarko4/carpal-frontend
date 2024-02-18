import React, { useState, useEffect } from 'react';
import EditDriver from './EditDriver';
import './styles/Drivers.css';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

function Drivers({ isDarkMode }) {
  const driverClassName = `VehiclesList ${isDarkMode ? 'dark-mode' : ''}`;
  const [drivers, setDrivers] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const { t } = useTranslation();

  //==============================
  //===== CHECK USER ROLE =======
  //==============================

  const currentUser = AuthService.getCurrentUser();
  const isAdminOrManager = currentUser && (currentUser.roles.includes("ROLE_ADMIN") || currentUser.roles.includes("ROLE_MANAGER"));

  //==============================
  //===== DRIVERS DISPLAY =======
  //==============================

  useEffect(() => {
    UserService.getDrivers()
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

  //==============================
  //===== DRIVER DATA EDIT ======
  //==============================

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

  //==============================
  //======= DRIVER REMOVE =======
  //==============================

  const handleRemove = (id) => {
    if (window.confirm(t('removeDriver?'))) {
      UserService.deleteDriver(id)
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

  let sortedDrivers = [...drivers];
  if (sortBy) {
    sortedDrivers.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName);
      } else if (sortBy === 'licenseExpiryDate') {
        return sortOrder === 'asc' ? new Date(a.licenseExpiryDate) - new Date(b.licenseExpiryDate) : new Date(b.licenseExpiryDate) - new Date(a.licenseExpiryDate);
      }
      return 0;
    });
  }

  //==============================
  //======== R E T U R N ========
  //==============================

  return (
    <div className={driverClassName}>
      <div className="sort-options"><div className="text1">{t('Sort by')}</div>
        <button onClick={() => handleSort('name')} className="sort-btn">{t('ByName')}</button>
        <button onClick={() => handleSort('licenseExpiryDate')} className="sort-btn2">{t('ByLicenseExpiryDate')}</button>
      </div>
      <div></div>
      {sortedDrivers.map((driver) => (
        <div key={driver.id} className="Driver">
          <div>
            <img
              src={driver.imageUrl || '/images/Driver.png'}
              alt={`${driver.firstName} ${driver.secondName}`}
              className="driver-image" />
          </div>
          <div className="vehicle-actions">
          {isAdminOrManager && (
          <React.Fragment>
            <button onClick={() => handleEdit(driver)} className="edit-btn">{t('edit')}</button>
            <br />
            <button onClick={() => handleRemove(driver.id)} className="remove-btn">{t('remove')}</button>
          </React.Fragment>
          )}
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
