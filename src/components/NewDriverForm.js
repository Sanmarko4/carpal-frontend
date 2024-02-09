import React, { useState } from 'react';
import './styles/NewDriverForm.css';
import config from '../config';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function NewDriverForm({ onDriverAdded }) {
  const { t } = useTranslation();

  const [driverData, setDriverData] = useState({
    firstName: '',
    secondName: '',
    driverLicenseNumber: '',
    licenseExpiryDate: ''
  });

  const handleChange = (e) => {
    setDriverData({ ...driverData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!driverData.firstName || !driverData.secondName || !driverData.driverLicenseNumber || !driverData.licenseExpiryDate) {
      alert(t('fillAll'));
      return;
    }

    axios.post(`${config.API_ROOT_PATH}/adddriver`, driverData)
      .then(() => {
        alert(`${t('driverCreated')} ${driverData.firstName} ${driverData.secondName}`)
        onDriverAdded();
      })
      .catch(error => {
        console.error('Error:', error);
        alert(t('no connection'));
      });
  }

  const renderAsterisk = (value) => value === '' ? <span className="required">⚠️</span> : null;

  return (
    <form className="new-driver-form" onSubmit={handleSubmit}>
      <label>
      {renderAsterisk(driverData.firstName)} {t('firstName')}: 
        <input type="text" name="firstName" value={driverData.firstName} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(driverData.secondName)} {t('secondName')}:
        <input type="text" name="secondName" value={driverData.secondName} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(driverData.driverLicenseNumber)} {t('driverLicenseNumber')}:
        <input type="text" name="driverLicenseNumber" value={driverData.driverLicenseNumber} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(driverData.licenseExpiryDate)} {t('licenseEexpiryDate')}:
        <input type="date" name="licenseExpiryDate" value={driverData.licenseExpiryDate} onChange={handleChange} />
      </label>
      <button type="submit">{t('addDriver')}</button>
    </form>
  );
}

export default NewDriverForm;
