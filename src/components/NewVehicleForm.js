import React, { useState, useEffect } from 'react';
import './styles/NewVehicleForm.css';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';

function NewVehicleForm({ onVehicleAdded }) {
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const { t } = useTranslation();
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    plateNumber: '',
    vin: '',
    insurenceExpiryDate: '',
    inspectionExpiryDate: '',
    nextServiceDate: '',
    driver: ''
  });

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

//======================================
//===== AVAILABLE DRIVERS & MAKES =====
//======================================

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (v, k) => currentYear - k);
    setAvailableYears(years);
    
    UserService.getAvailableDrivers()
    .then(response => {
      setAvailableDrivers(response.data);
    })
    .catch(error => console.error("Error fetching available drivers:", error));

    UserService.getVehiclemakes()
        .then(response => setVehicleMakes(response.data))
        .catch(error => console.error('Error fetching vehicle makes:', error));
}, []);

const handleDriverChange = (e) => {
  setVehicleData({ ...vehicleData, driver: { id: e.target.value } });
};

//=============================================
//=== AVAILABLE MODELS AFTER MAKE CHANGE =====
//=============================================

  const handleMakeChange = (e) => {
    const make = e.target.value;
    setVehicleData({ ...vehicleData, make: make, model: '' }); // Clear model when make changes
    UserService.getVehicleModels(make)
      .then(response => {
        setAvailableModels(response.data);
      })
      .catch(error => console.error("Error fetching vehicle models:", error));
  };

//=============================
//==== CREATING VEHICLE ======
//=============================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vehicleData.make || !vehicleData.model || !vehicleData.year || !vehicleData.color || !vehicleData.plateNumber || !vehicleData.vin 
      || !vehicleData.insurenceExpiryDate || !vehicleData.inspectionExpiryDate || !vehicleData.nextServiceDate) {
      alert(t('fillAll'));
      return;
    }
    
    let requestData = {...vehicleData};
    if (!requestData.driver || !requestData.driver.id) {
      delete requestData.driver;
    }

    UserService.addVehicle(requestData)
      .then(() => {
        alert(`${t('vehicleCreated')} ${vehicleData.plateNumber}`)
        onVehicleAdded();
      })
      .catch(error => {
        console.error('Error:', error);
        alert(t('no connection'));
      });
  }

  const renderAsterisk = (value) => value === '' ? <span className="required">⚠️</span> : null;

  return (
    <form className="new-vehicle-form" onSubmit={handleSubmit}>
      <label>
      {renderAsterisk(vehicleData.make)} {t('make')}:
            <select name="make" value={vehicleData.make} onChange={handleMakeChange}>
            <option value="">{t('selectMake')}</option>
             {vehicleMakes.map((make, index) => (
             <option key={index} value={make}>{make}</option>
            ))}
            </select>
      </label>
      <label>
        {renderAsterisk(vehicleData.model)} {t('model')}:
        <select name="model" value={vehicleData.model} onChange={handleChange}>
          <option value="">{t('selectModel')}</option>
          {availableModels.map((model, index) => (
            <option key={index} value={model}>{model}</option>
          ))}
        </select>
      </label>
      <label>
      {renderAsterisk(vehicleData.year)} {t('year')}:
        <select name="year" value={vehicleData.year} onChange={handleChange}>
          <option value="">{t('selectYear')}</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </label>
      <label>
      {renderAsterisk(vehicleData.color)} {t('color')}:
        <input type="text" name="color" value={vehicleData.color} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(vehicleData.plateNumber)} {t('plateNumber')}:
        <input type="text" name="plateNumber" value={vehicleData.plateNumber} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(vehicleData.vin)} {t('VIN')}:
        <input type="text" name="vin" value={vehicleData.vin} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(vehicleData.insurenceExpiryDate)} {t('insurance')}:
        <input type="date" name="insurenceExpiryDate" value={vehicleData.insurenceExpiryDate} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(vehicleData.inspectionExpiryDate)} {t('inspection')}:
        <input type="date" name="inspectionExpiryDate" value={vehicleData.inspectionExpiryDate} onChange={handleChange} />
      </label>
      <label>
      {renderAsterisk(vehicleData.nextServiceDate)} {t('service')}:
        <input type="date" name="nextServiceDate" value={vehicleData.nextServiceDate} onChange={handleChange} />
      </label>
      <label>
      {t('driver')}:
        <select name="driver" value={vehicleData.driver?.id || ''} onChange={handleDriverChange}>
          <option value="">{t('selectDriver')}</option>
          {availableDrivers.map(driver => (
            <option key={driver.id} value={driver.id}>
              {driver.firstName} {driver.secondName}
            </option>
          ))}
        </select>
      </label>  
      <button type="submit">{t('addVehicle')}</button>
    </form>
  );
}

export default NewVehicleForm;
