import { Express } from 'express';

import { memoryStore } from '../storage/memory.store';
import { DriverAccount } from '../types/app.types';

export function registerDriverRoutes(app: Express) {
  app.get('/drivers', (_req, res) => {
    res.json({
      success: true,
      drivers: memoryStore.driversDatabase,
    });
  });

  app.post('/drivers/register', (req, res) => {
    const driver: DriverAccount = {
      id: Date.now(),

      fullName: req.body.fullName || req.body.name || 'Motorista AVUXO',
      email: req.body.email || '',
      phone: req.body.phone || '',

      carBrand: req.body.carBrand || '',
      carModel: req.body.carModel || '',
      carPlate: req.body.carPlate || req.body.plate || '',
      carColor: req.body.carColor || '',
      carYear: req.body.carYear || '',
      carSeats: req.body.carSeats || '',

      renavam: req.body.renavam || '',

      driverPhoto: req.body.driverPhoto || '',
      vehiclePhoto: req.body.vehiclePhoto || '',
      documentPhoto: req.body.documentPhoto || '',

      licensePhoto: req.body.licensePhoto || '',
      cnhFront: req.body.cnhFront || req.body.cnhFrontPhoto || '',
      cnhBack: req.body.cnhBack || req.body.cnhBackPhoto || '',
      cnhFrontPhoto: req.body.cnhFrontPhoto || req.body.cnhFront || '',
      cnhBackPhoto: req.body.cnhBackPhoto || req.body.cnhBack || '',

      vehicleDocumentPhoto: req.body.vehicleDocumentPhoto || '',
      vehicleDocumentPdf: req.body.vehicleDocumentPdf || '',
      vehicleSidePhoto: req.body.vehicleSidePhoto || '',
      vehicleBackPhoto: req.body.vehicleBackPhoto || '',

      rentedVehicle: Boolean(req.body.rentedVehicle),

      status: 'pending',

      approved: false,
      online: false,

      blocked: false,
      blockedReason: '',

      createdAt: new Date().toISOString(),
    };

    memoryStore.driversDatabase.unshift(driver);

    res.json({
      success: true,
      message: 'Motorista cadastrado com sucesso',
      driver,
    });
  });
app.get('/drivers/status/:phone', (req, res) => {

  const phone = String(
    req.params.phone || '',
  ).replace(/\D/g, '');

  const driver =
    memoryStore.driversDatabase.find(
      (item) =>
        String(item.phone || '')
          .replace(/\D/g, '') === phone,
    );

  if (!driver) {
    return res.status(404).json({
      success: false,
      found: false,
      approved: false,
    });
  }

  return res.json({
  success: true,
  found: true,
  approved: driver.approved === true,
  blocked: driver.blocked === true,
  blockedReason: driver.blockedReason || '',
  status: driver.status,
  driver: {
    id: driver.id,
    fullName: driver.fullName,
    phone: driver.phone,
  },
});
});
  app.post('/drivers/status', (req, res) => {
const phone = String(req.body.phone || '').replace(/\D/g, '');
const plate = String(req.body.carPlate || req.body.plate || '').toUpperCase().trim();

const alreadyExists = memoryStore.driversDatabase.find((item) => {
  const itemPhone = String(item.phone || '').replace(/\D/g, '');
  const itemPlate = String(item.carPlate || '').toUpperCase().trim();

  return itemPhone === phone || itemPlate === plate;
});

if (alreadyExists) {
  return res.status(409).json({
    success: false,
    message: 'Motorista já cadastrado com este telefone ou placa.',
    driver: alreadyExists,
  });
}
    const id = Number(req.body.id || req.body.driverId);
    const online = Boolean(req.body.online);

    const driver = memoryStore.driversDatabase.find(
      (item) => Number(item.id) === id,
    );

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
      return;
    }

    if (driver.blocked) {
      res.status(403).json({
        success: false,
        message: 'Motorista bloqueado',
      });
      return;
    }

    if (!driver.approved) {
      res.status(403).json({
        success: false,
        message: 'Motorista ainda não aprovado',
      });
      return;
    }

    driver.online = online;

    res.json({
      success: true,
      driver,
    });
  });

  app.get('/driver/profile/:id', (req, res) => {
    const id = Number(req.params.id);

    const driver = memoryStore.driversDatabase.find(
      (item) => Number(item.id) === id,
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    return res.json({
      success: true,
      driver,
    });
  });

  app.get('/driver/wallet/:id', (_req, res) => {
    return res.json({
      success: true,
      wallet: {
        balance: 1247.80,
        today: 187.50,
        week: 1243.00,
        month: 4872.00,
        fee: 20,
      },
    });
  });

  app.get('/driver/trips/:id', (_req, res) => {
    return res.json({
      success: true,
      trips: [],
    });
  });

  app.get('/driver/vehicle/:id', (req, res) => {
    const id = Number(req.params.id);

    const driver = memoryStore.driversDatabase.find(
      (item) => Number(item.id) === id,
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    return res.json({
      success: true,
      vehicle: {
        brand: driver.carBrand,
        model: driver.carModel,
        plate: driver.carPlate,
        color: driver.carColor,
        year: driver.carYear,
        renavam: driver.renavam,
      },
    });
  });

  app.get('/driver/performance/:id', (_req, res) => {
    return res.json({
      success: true,
      performance: {
        rating: 4.98,
        completedTrips: 325,
        acceptanceRate: 97,
        cancelRate: 1,
        onlineHours: 142,
      },
    });
  });

  app.get('/driver/notifications/:id', (_req, res) => {
    return res.json({
      success: true,
      notifications: [],
    });
  });
}