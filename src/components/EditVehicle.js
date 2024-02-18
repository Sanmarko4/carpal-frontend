import React, { useState, useEffect } from 'react';
import './styles/EditVehicle.css';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';

function EditVehicle({ vehicle, onUpdate }) {
  const [editedVehicle, setEditedVehicle] = useState(vehicle);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const { t } = useTranslation();

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
      .then(response => {
        setVehicleMakes(response.data);
      })
      .catch(error => console.error("Error fetching vehicle makes:", error));
  }, [vehicle]);

  const handleChange = (e) => {
    setEditedVehicle({ ...editedVehicle, [e.target.name]: e.target.value });
  };

  const handleMakeChange = (e) => {
    const make = e.target.value;
    setEditedVehicle({ ...editedVehicle, make: make, model: '', }); // Clear model when make changes
    UserService.getVehicleModels (make)
      .then(response => {
        setAvailableModels(response.data);
      })
      .catch(error => console.error("Error fetching vehicle models:", error));
  };

  const handleDriverChange = (e) => {
    setEditedVehicle({ ...editedVehicle, driver: { id: e.target.value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedVehicle.make || !editedVehicle.model || !editedVehicle.year || !editedVehicle.color || !editedVehicle.plateNumber || !editedVehicle.vin
      || !editedVehicle.insurenceExpiryDate || !editedVehicle.inspectionExpiryDate || !editedVehicle.nextServiceDate) {
      alert(t('fillAll'));
      return;
    }

    let requestData = { ...editedVehicle };
    if (!requestData.driver || !requestData.driver.id) {
      delete requestData.driver;
    }

    UserService.updateVehicle (requestData)
      .then(() => {
        alert(`${t('vehicleUpdated')} ${editedVehicle.plateNumber}`);
        onUpdate();
      })
      .catch(error => {
        console.error("Error updating vehicle:", error);
      });
  };

  const renderAsterisk = (value) => value === '' ? <span className="required">⚠️</span> : null;

  return (
    <form className="edit-vehicle-form" onSubmit={handleSubmit}>
      <label>
        {renderAsterisk(editedVehicle.make)} {t('make')}:
        <select name="make" value={editedVehicle.make} onChange={handleMakeChange}>
          <option value="">{t('selectMake')}</option>
          {vehicleMakes.map((make, index) => (
            <option key={index} value={make}>{make}</option>
          ))}
        </select>
      </label>
      <label>
        {renderAsterisk(editedVehicle.model)} {t('model')}:
        <select name="model" value={editedVehicle.model} onChange={handleChange}>
          <option value="">{t('selectModel')}</option>
          {availableModels.map((model, index) => (
            <option key={index} value={model}>{model}</option>
          ))}
        </select>
      </label>
      <label>
        {renderAsterisk(editedVehicle.year)} {t('year')}:
        <select name="year" value={editedVehicle.year} onChange={handleChange}>
          <option value="">{t('selectYear')}</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </label>
      <label>
        {renderAsterisk(editedVehicle.color)} {t('color')}:
        <input type="text" name="color" value={editedVehicle.color} onChange={handleChange} />
      </label>
      <label>
        {renderAsterisk(editedVehicle.plateNumber)} {t('plateNumber')}:
        <input type="text" name="plateNumber" value={editedVehicle.plateNumber} onChange={handleChange} />
      </label>
      <label>
        {renderAsterisk(editedVehicle.vin)} {t('VIN')}:
        <input type="text" name="vin" value={editedVehicle.vin} onChange={handleChange} />
      </label>
      <label>
        {renderAsterisk(editedVehicle.insurenceExpiryDate)} {t('insurence')}:
        <input type="date" name="insurenceExpiryDate" value={editedVehicle.insurenceExpiryDate} onChange={handleChange} />
      </label>
      <label>
        {renderAsterisk(editedVehicle.inspectionExpiryDate)} {t('inspection')}:
        <input type="date" name="inspectionExpiryDate" value={editedVehicle.inspectionExpiryDate} onChange={handleChange} />
      </label>
      <label>
        {renderAsterisk(editedVehicle.nextServiceDate)} {t('service')}:
        <input type="date" name="nextServiceDate" value={editedVehicle.nextServiceDate} onChange={handleChange} />
      </label>
      <label>
        {t('driver')}:
        <select name="driver" value={editedVehicle.driver?.id || ''} onChange={handleDriverChange}>
          <option value="">{t('selectDriver')}</option>
          {availableDrivers.map(driver => (
            <option key={driver.id} value={driver.id}>
              {driver.firstName} {driver.secondName}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">{t('updateVehicle')}</button>
    </form>
  );
}

export default EditVehicle;
