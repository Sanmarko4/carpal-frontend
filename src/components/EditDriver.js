import React, { useState } from 'react';
import './styles/EditDriver.css';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';

function EditDriver({ driver, onUpdate }) {
  const { t } = useTranslation();

  const [editedDriver, setEditedDriver] = useState(driver);

  const handleChange = (e) => {
    setEditedDriver({ ...editedDriver, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedDriver.firstName || !editedDriver.secondName || !editedDriver.driverLicenseNumber || !editedDriver.licenseExpiryDate) {
      alert(t('fillAll'));
      return;
    }

    UserService.updateDriver (editedDriver)
      .then(() => {
        alert(`${t('driverUpdated')} ${editedDriver.firstName} ${editedDriver.secondName}`)
        onUpdate(editedDriver);
      })
      .catch(error => console.error("Error updating driver:", error));
  };

  const renderAsterisk = (value) => value === '' ? <span className="required">⚠️</span> : null;

  return (
    <form className="edit-driver-form" onSubmit={handleSubmit}>
     <label>
     {renderAsterisk(editedDriver.firstName)} {t('firstName')}:
        <input type="text" name="firstName" value={editedDriver.firstName} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(editedDriver.secondName)} {t('secondName')}:
        <input type="text" name="secondName" value={editedDriver.secondName} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(editedDriver.driverLicenseNumber)} {t('driverLicenseNumber')}:
        <input type="text" name="driverLicenseNumber" value={editedDriver.driverLicenseNumber} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(editedDriver.licenseExpiryDate)} {t('licenseEexpiryDate')}:
        <input type="date" name="licenseExpiryDate" value={editedDriver.licenseExpiryDate} onChange={handleChange} />
      </label>   
      <button type="submit">{t('updateDriver')}</button>
    </form>
  );
}

export default EditDriver;
