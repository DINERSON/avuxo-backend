import { Express } from 'express';

import { memoryStore } from '../storage/memory.store';
import { DriverAccount } from '../types/app.types';

function normalizePhone(value: unknown) {
  return String(value || '').replace(/\D/g, '');
}

function normalizePlate(value: unknown) {
  return String(value || '').toUpperCase().trim();
}

export function registerDriverRoutes(app: Express) {
  app.get('/drivers', (_req, res) => {
    res.json({
      success: true,
      drivers: memoryStore.driversDatabase,
    });
  });

  app.post('/drivers/register', (req, res) => {
    const phone = normalizePhone(req.body.phone);

    const plate = normalizePlate(req.body.carPlate || req.body.plate);

    const alreadyExists = memoryStore.driversDatabase.find((item) => {
      const itemPhone = normalizePhone(item.phone);
      const itemPlate = normalizePlate(item.carPlate);

      return (
        (phone.length > 0 && itemPhone === phone) ||
        (plate.length > 0 && itemPlate === plate)
      );
    });

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: 'Motorista já cadastrado com este telefone ou placa.',
        driver: alreadyExists,
      });
    }

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
       
      rating: 0,
totalRatings: 0,

      blocked: false,
      blockedReason: '',

      createdAt: new Date().toISOString(),
    };

    memoryStore.driversDatabase.unshift(driver);

    return res.json({
      success: true,
      message: 'Motorista cadastrado com sucesso',
      driver,
    });
  });

  app.get('/drivers/status/:phone', (req, res) => {
    const phone = normalizePhone(req.params.phone);

    const driver = memoryStore.driversDatabase.find(
      (item) => normalizePhone(item.phone) === phone,
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        found: false,
        approved: false,
        blocked: false,
        status: 'not_found',
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
        email: driver.email,
        phone: driver.phone,

        rating: driver.rating || 0,
totalRatings: driver.totalRatings || 0,

        carBrand: driver.carBrand,
        carModel: driver.carModel,
        carPlate: driver.carPlate,
        carColor: driver.carColor,
        carYear: driver.carYear,
        carSeats: driver.carSeats,

        renavam: driver.renavam,

        driverPhoto: driver.driverPhoto,
        vehiclePhoto: driver.vehiclePhoto,
        documentPhoto: driver.documentPhoto,

        licensePhoto: driver.licensePhoto,
        cnhFrontPhoto: driver.cnhFrontPhoto,
        cnhBackPhoto: driver.cnhBackPhoto,

        vehicleDocumentPhoto: driver.vehicleDocumentPhoto,
        vehicleDocumentPdf: driver.vehicleDocumentPdf,

        vehicleSidePhoto: driver.vehicleSidePhoto,
        vehicleBackPhoto: driver.vehicleBackPhoto,
      },
    });
  });

  app.post('/drivers/:id/photo', (req, res) => {
  console.log('===== FOTO =====');
  console.log('ID:', req.params.id);
  console.log('BODY:', Object.keys(req.body || {}));

  const id = Number(req.params.id);
  const driverPhoto = String(req.body.driverPhoto || '').trim();

  const driver = memoryStore.driversDatabase.find(
    (item) => Number(item.id) === id,
  );

  if (!driver) {
    console.log('MOTORISTA NÃO ENCONTRADO');

    return res.status(404).json({
      success: false,
      message: 'Motorista não encontrado',
    });
  }

  if (!driverPhoto) {
    console.log('FOTO VAZIA');

    return res.status(400).json({
      success: false,
      message: 'Foto vazia',
    });
  }

  driver.driverPhoto = driverPhoto;

  console.log('FOTO SALVA');

  return res.json({
    success: true,
  });
});
    const id = Number(req.params.id);
    const driverPhoto = String(req.body.driverPhoto || '').trim();

    const driver = memoryStore.driversDatabase.find(
      (item) => Number(item.id) === id,
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    if (!driverPhoto) {
      return res.status(400).json({
        success: false,
        message: 'Foto do motorista não enviada.',
      });
    }

    driver.driverPhoto = driverPhoto;

    return res.json({
      success: true,
      message: 'Foto atualizada com sucesso.',
      driverPhoto: driver.driverPhoto,
      driver,
    });
  });

  app.post('/drivers/status', (req, res) => {
    const id = Number(req.body.id || req.body.driverId);
    const online = Boolean(req.body.online);

    const driver = memoryStore.driversDatabase.find(
      (item) => Number(item.id) === id,
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    if (driver.blocked) {
      return res.status(403).json({
        success: false,
        message: 'Motorista bloqueado',
        driver,
      });
    }

    if (!driver.approved) {
      return res.status(403).json({
        success: false,
        message: 'Motorista ainda não aprovado',
        driver,
      });
    }

    driver.online = online;

    return res.json({
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