import { Express } from 'express';

import { memoryStore } from '../storage/memory.store';
import { DriverAccount } from '../types/app.types';

const AVUXO_FEE_PER_RIDE = 0.5;

function normalizePhone(value: unknown) {
  return String(value || '').replace(/\D/g, '');
}

function normalizePlate(value: unknown) {
  return String(value || '').toUpperCase().trim();
}

function findDriverById(id: any) {
  return memoryStore.driversDatabase.find(
    (item) => String(item.id) === String(id),
  );
}

function ensureDriverOnlineStore() {
  const store = memoryStore as any;

  store.onlineDrivers = store.onlineDrivers || {};
  store.driverSockets = store.driverSockets || {};
  store.driverWallets = store.driverWallets || {};

  return store;
}

function ensureDriverWallet(driverId: string, driverName = 'Motorista AVUXO') {
  const store = ensureDriverOnlineStore();

  if (!store.driverWallets[driverId]) {
    store.driverWallets[driverId] = {
      driverId,
      driverName,
      balance: 0,
      availableBalance: 0,
      totalEarnings: 0,
      totalFees: 0,
      transactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return store.driverWallets[driverId];
}

export function registerDriverRoutes(app: Express) {
  app.get('/drivers', (_req, res) => {
    return res.json({
      success: true,
      drivers: memoryStore.driversDatabase,
    });
  });

  app.post('/drivers/register', (req, res) => {
    ensureDriverOnlineStore();

    const phone = normalizePhone(req.body.phone);
    const plate = normalizePlate(req.body.carPlate || req.body.plate);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Telefone é obrigatório.',
      });
    }

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
      id: phone,

      fullName: req.body.fullName || req.body.name || 'Motorista AVUXO',
      email: req.body.email || '',
      phone,

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

      walletBalance: 0,
      walletFees: 0,
      walletEarnings: 0,

      createdAt: new Date().toISOString(),
    };

    memoryStore.driversDatabase.unshift(driver);
    ensureDriverWallet(driver.id, driver.fullName);

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

    const wallet = ensureDriverWallet(driver.id, driver.fullName);

    driver.walletBalance = Number(wallet.balance || 0);
    driver.walletFees = Number(wallet.totalFees || 0);
    driver.walletEarnings = Number(wallet.totalEarnings || 0);

    return res.json({
      success: true,
      found: true,
      approved: driver.approved === true,
      blocked: driver.blocked === true,
      blockedReason: driver.blockedReason || '',
      status: driver.status,
      driver,
      wallet,
    });
  });

  app.post('/drivers/:id/photo', (req, res) => {
    const driver = findDriverById(req.params.id);
    const driverPhoto = String(req.body.driverPhoto || '').trim();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    if (!driverPhoto) {
      return res.status(400).json({
        success: false,
        message: 'Foto vazia',
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

  app.post('/drivers/photo-by-phone/:phone', (req, res) => {
    const phone = normalizePhone(req.params.phone);
    const driverPhoto = String(req.body.driverPhoto || '').trim();

    const driver = memoryStore.driversDatabase.find(
      (item) => normalizePhone(item.phone) === phone,
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado pelo telefone',
      });
    }

    if (!driverPhoto) {
      return res.status(400).json({
        success: false,
        message: 'Foto vazia',
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
    const id = String(req.body.id || req.body.driverId || req.body.phone || '');
    const online = Boolean(req.body.online);

    const driver = findDriverById(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    if (driver.blocked) {
      driver.online = false;

      return res.status(403).json({
        success: false,
        message: 'Motorista bloqueado pelo administrador.',
        driver,
      });
    }

    if (!driver.approved) {
      driver.online = false;

      return res.status(403).json({
        success: false,
        message: 'Motorista ainda não aprovado.',
        driver,
      });
    }

    const wallet = ensureDriverWallet(driver.id, driver.fullName);

    driver.walletBalance = Number(wallet.balance || 0);
    driver.walletFees = Number(wallet.totalFees || 0);
    driver.walletEarnings = Number(wallet.totalEarnings || 0);

    if (online && Number(wallet.balance || 0) < AVUXO_FEE_PER_RIDE) {
      driver.online = false;

      return res.status(403).json({
        success: false,
        message: 'Adicione saldo na carteira para começar a receber corridas.',
        driver,
        wallet,
      });
    }

    const store = ensureDriverOnlineStore();

    driver.online = online;
    store.onlineDrivers[String(driver.id)] = online;

    return res.json({
      success: true,
      driver,
      wallet,
    });
  });

  app.get('/driver/profile/:id', (req, res) => {
    const driver = findDriverById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    const wallet = ensureDriverWallet(driver.id, driver.fullName);

    driver.walletBalance = Number(wallet.balance || 0);
    driver.walletFees = Number(wallet.totalFees || 0);
    driver.walletEarnings = Number(wallet.totalEarnings || 0);

    return res.json({
      success: true,
      driver,
      wallet,
    });
  });

  app.get('/driver/wallet/:id', (req, res) => {
    const driverId = String(req.params.id);

    const driver = findDriverById(driverId);
    const wallet = ensureDriverWallet(
      driverId,
      driver?.fullName || 'Motorista AVUXO',
    );

    return res.json({
      success: true,
      wallet,
    });
  });

  app.get('/driver/trips/:id', (req, res) => {
    const driverId = String(req.params.id);

    const trips = (memoryStore.rideHistory || []).filter(
      (ride: any) =>
        String(ride.driverId || ride.driver?.id || ride.driver?.driverId) ===
        driverId,
    );

    return res.json({
      success: true,
      trips,
    });
  });

  app.get('/driver/vehicle/:id', (req, res) => {
    const driver = findDriverById(req.params.id);

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

  app.get('/driver/performance/:id', (req, res) => {
    const driverId = String(req.params.id);

    const trips = (memoryStore.rideHistory || []).filter(
      (ride: any) =>
        String(ride.driverId || ride.driver?.id || ride.driver?.driverId) ===
        driverId,
    );

    const completedTrips = trips.filter(
      (ride: any) => ride.status === 'finished',
    ).length;

    const cancelledTrips = trips.filter(
      (ride: any) => ride.status === 'cancelled',
    ).length;

    const totalTrips = trips.length;

    return res.json({
      success: true,
      performance: {
        rating: 0,
        completedTrips,
        acceptanceRate: totalTrips > 0 ? 100 : 0,
        cancelRate:
          totalTrips > 0
            ? Number(((cancelledTrips / totalTrips) * 100).toFixed(1))
            : 0,
        onlineHours: 0,
      },
    });
  });

  app.get('/driver/notifications/:id', (req, res) => {
    const driver = findDriverById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Motorista não encontrado',
      });
    }

    const notifications: Array<{
      type: string;
      title: string;
      message: string;
      time: string;
    }> = [];

    if (driver.approved) {
      notifications.push({
        type: 'document',
        title: 'Cadastro aprovado',
        message: 'Seu cadastro foi aprovado pela AVUXO.',
        time: driver.createdAt,
      });
    }

    if (driver.blocked) {
      notifications.push({
        type: 'warning',
        title: 'Conta bloqueada',
        message: driver.blockedReason || 'Sua conta está bloqueada no momento.',
        time: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      notifications: notifications.reverse(),
    });
  });
}