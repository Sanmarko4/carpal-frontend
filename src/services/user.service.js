import axios from "axios";
import authHeader from "./auth-header";
import config from '../config';

//=============================
//===== VEHICLE METHODS ======
//=============================

const getVehicles = () => {
  return axios.get(`${config.API_ROOT_PATH}/vehicles`, { headers: authHeader() });
};

const addVehicle = (vehicleData) => {
  return axios.post(`${config.API_ROOT_PATH}/addvehicle`, vehicleData, { headers: authHeader() });
};

const updateVehicle = (vehicle) => {
  return axios.put(`${config.API_ROOT_PATH}/updatevehicle`, vehicle, { headers: authHeader() });
};

const detachVehicleFromDriver = (vehicle) => {
  return axios.put(`${config.API_ROOT_PATH}/separatevehiclefromdriver`, vehicle, { headers: authHeader() });
};

const deleteVehicle = (id) => {
  return axios.delete(`${config.API_ROOT_PATH}/deletevehicle/${id}`, { headers: authHeader() });
};

//=============================
//===== DRIVER METHODS =======
//=============================

const getDrivers = () => {
  return axios.get(`${config.API_ROOT_PATH}/drivers`, { headers: authHeader() });
};

const addDriver = (driverData) => {
  return axios.post(`${config.API_ROOT_PATH}/adddriver`, driverData, { headers: authHeader() });
};

const getAvailableDrivers = () => {
  return axios.get(`${config.API_ROOT_PATH}/availabledrivers`, { headers: authHeader() });
};

const deleteDriver = (id) => {
  return axios.delete(`${config.API_ROOT_PATH}/deletedriver/${id}`, { headers: authHeader() });
};

const updateDriver = (driver) => {
  return axios.put(`${config.API_ROOT_PATH}/updatedriver`, driver, { headers: authHeader() });
};

//========================================
//===== VEHICLE MAKE & MODEL METHODS =====
//========================================

const getVehiclemakes = () => {
  return axios.get(`${config.API_ROOT_PATH}/vehiclemakes`, { headers: authHeader() });
};

const getVehicleModels = (make) => {
  return axios.get(`${config.API_ROOT_PATH}/vehiclemodels/${make}`, { headers: authHeader() });
};

const UserService = {
  getVehicles, addVehicle, updateVehicle, 
  getDrivers, addDriver, getAvailableDrivers, deleteDriver, updateDriver,
  getVehiclemakes, getVehicleModels, deleteVehicle, detachVehicleFromDriver
};

export default UserService;