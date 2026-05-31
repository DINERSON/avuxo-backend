"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDriver = createDriver;
exports.findDriverById = findDriverById;
exports.getPendingDrivers = getPendingDrivers;
exports.getApprovedDrivers = getApprovedDrivers;
exports.getRejectedDrivers = getRejectedDrivers;
exports.getBlockedDrivers = getBlockedDrivers;
exports.approveDriverService = approveDriverService;
exports.rejectDriverService = rejectDriverService;
exports.blockDriverService = blockDriverService;
const driver_model_1 = require("../models/driver.model");
function createDriver(data) {
    driver_model_1.driversDatabase.push(data);
    return data;
}
function findDriverById(id) {
    return driver_model_1.driversDatabase.find((driver) => driver.id === id);
}
function getPendingDrivers() {
    return driver_model_1.driversDatabase.filter((driver) => driver.status === 'pending');
}
function getApprovedDrivers() {
    return driver_model_1.driversDatabase.filter((driver) => driver.status === 'approved');
}
function getRejectedDrivers() {
    return driver_model_1.driversDatabase.filter((driver) => driver.status === 'rejected');
}
function getBlockedDrivers() {
    return driver_model_1.driversDatabase.filter((driver) => driver.status === 'blocked');
}
function approveDriverService(id) {
    const driver = findDriverById(id);
    if (!driver) {
        return null;
    }
    driver.status = 'approved';
    return driver;
}
function rejectDriverService(id) {
    const driver = findDriverById(id);
    if (!driver) {
        return null;
    }
    driver.status = 'rejected';
    driver.online = false;
    return driver;
}
function blockDriverService(id) {
    const driver = findDriverById(id);
    if (!driver) {
        return null;
    }
    driver.status = 'blocked';
    driver.online = false;
    return driver;
}
