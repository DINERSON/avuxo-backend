import { Request, Response } from 'express';
import { memoryStore } from '../storage/memory.store';

const driversDatabase = memoryStore.driversDatabase;

function getDriverWallet(driverId: any) {
  const store = memoryStore as any;

  store.driverWallets = store.driverWallets || {};

  const id = String(driverId || '');

  if (!store.driverWallets[id]) {
    store.driverWallets[id] = {
      driverId: id,
      balance: 0,
      availableBalance: 0,
      totalEarnings: 0,
      totalFees: 0,
      transactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return store.driverWallets[id];
}

function attachWallet(driver: any) {
  const wallet = getDriverWallet(driver.id);

  driver.walletBalance = Number(wallet.balance || 0);
  driver.walletFees = Number(wallet.totalFees || 0);
  driver.walletEarnings = Number(wallet.totalEarnings || 0);

  return driver;
}

export function listPendingDrivers(_req: Request, res: Response) {
  const pendingDrivers = driversDatabase
    .map(attachWallet)
    .filter((driver) => driver.status === 'pending');

  return res.json({
    success: true,
    total: pendingDrivers.length,
    drivers: pendingDrivers,
  });
}

export function listAllDrivers(_req: Request, res: Response) {
  const drivers = driversDatabase.map(attachWallet);

  return res.json({
    success: true,
    total: drivers.length,
    drivers,
  });
}

export function approveDriver(req: Request, res: Response) {
  const { id } = req.params;

  const driver = driversDatabase.find(
    (item) => String(item.id) === String(id),
  );

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: 'Motorista não encontrado.',
    });
  }

  driver.status = 'approved';
  driver.approved = true;
  driver.blocked = false;
  driver.online = false;
  driver.blockedReason = '';

  attachWallet(driver);

  return res.json({
    success: true,
    message: 'Motorista aprovado com sucesso.',
    driver,
  });
}

export function rejectDriver(req: Request, res: Response) {
  const { id } = req.params;

  const driver = driversDatabase.find(
    (item) => String(item.id) === String(id),
  );

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: 'Motorista não encontrado.',
    });
  }

  driver.status = 'rejected';
  driver.approved = false;
  driver.blocked = false;
  driver.online = false;
  driver.blockedReason = 'Cadastro rejeitado pelo administrador';

  attachWallet(driver);

  return res.json({
    success: true,
    message: 'Motorista rejeitado.',
    driver,
  });
}

export function blockDriver(req: Request, res: Response) {
  const { id } = req.params;

  const driver = driversDatabase.find(
    (item) => String(item.id) === String(id),
  );

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: 'Motorista não encontrado.',
    });
  }

  driver.status = 'blocked';
  driver.approved = false;
  driver.blocked = true;
  driver.online = false;
  driver.blockedReason =
    req.body?.reason || 'Bloqueado pelo administrador';

  attachWallet(driver);

  return res.json({
    success: true,
    message: 'Motorista bloqueado.',
    driver,
  });
}

export function unblockDriver(req: Request, res: Response) {
  const { id } = req.params;

  const driver = driversDatabase.find(
    (item) => String(item.id) === String(id),
  );

  if (!driver) {
    return res.status(404).json({
      success: false,
      message: 'Motorista não encontrado.',
    });
  }

  driver.status = 'approved';
  driver.approved = true;
  driver.blocked = false;
  driver.online = false;
  driver.blockedReason = '';

  attachWallet(driver);

  return res.json({
    success: true,
    message: 'Motorista desbloqueado e aprovado.',
    driver,
  });
}