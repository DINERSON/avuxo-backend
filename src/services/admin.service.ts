import {
  Driver,
  driversDatabase,
} from '../models/driver.model';

export function createDriver(data: Driver) {
  driversDatabase.push(data);

  return data;
}

export function findDriverById(id: string) {
  return driversDatabase.find(
    (driver) => String(driver.id) === String(id),
  );
}

export function getPendingDrivers() {
  return driversDatabase.filter(
    (driver) => driver.status === 'pending',
  );
}

export function getApprovedDrivers() {
  return driversDatabase.filter(
    (driver) => driver.status === 'approved',
  );
}

export function getRejectedDrivers() {
  return driversDatabase.filter(
    (driver) => driver.status === 'rejected',
  );
}

export function getBlockedDrivers() {
  return driversDatabase.filter(
    (driver) => driver.status === 'blocked',
  );
}

export function approveDriverService(id: string) {
  const driver = findDriverById(id);

  if (!driver) {
    return null;
  }

  driver.status = 'approved';
  driver.approved = true;
  driver.blocked = false;
  driver.online = false;
  driver.blockedReason = '';

  return driver;
}

export function rejectDriverService(id: string) {
  const driver = findDriverById(id);

  if (!driver) {
    return null;
  }

  driver.status = 'rejected';
  driver.approved = false;
  driver.blocked = false;
  driver.online = false;

  return driver;
}

export function blockDriverService(
  id: string,
  reason = 'Bloqueado pelo administrador',
) {
  const driver = findDriverById(id);

  if (!driver) {
    return null;
  }

  driver.status = 'blocked';
  driver.approved = false;
  driver.blocked = true;
  driver.online = false;
  driver.blockedReason = reason;

  return driver;
}

export function unblockDriverService(id: string) {
  const driver = findDriverById(id);

  if (!driver) {
    return null;
  }

  driver.status = 'approved';
  driver.approved = true;
  driver.blocked = false;
  driver.online = false;
  driver.blockedReason = '';

  return driver;
}