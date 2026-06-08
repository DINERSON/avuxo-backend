import { Request, Response } from 'express';
import { memoryStore } from '../storage/memory.store';

const driversDatabase = memoryStore.driversDatabase;

const AVUXO_BLOCK_DEBT_LIMIT = 20;

function getDriverDebt(driverId: any) {
  const store = memoryStore as any;
  const wallet = store.driverWallets?.[String(driverId)];

  if (!wallet) return 0;

  const balance = Number(wallet.balance || 0);

  return balance < 0 ? Math.abs(balance) : 0;
}

function applyFinancialBlockIfNeeded(driver: any) {
  const debt = getDriverDebt(driver.id);

  (driver as any).walletDebt = debt;

  if (debt >= AVUXO_BLOCK_DEBT_LIMIT) {
    driver.status = 'blocked';
    driver.approved = false;
    driver.blocked = true;
    driver.online = false;
    driver.blockedReason =
      `Bloqueado automaticamente por dívida AVUXO de R$ ${debt.toFixed(2)}`;
  }

  return driver;
}

export function listPendingDrivers(_req: Request, res: Response) {
  const pendingDrivers = driversDatabase
    .map(applyFinancialBlockIfNeeded)
    .filter(
      (driver) =>
        driver.status === 'pending' ||
        driver.approved === false,
    );

  return res.json({
    success: true,
    total: pendingDrivers.length,
    drivers: pendingDrivers,
  });
}

export function listAllDrivers(_req: Request, res: Response) {
  const drivers = driversDatabase.map(applyFinancialBlockIfNeeded);

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

  const debt = getDriverDebt(driver.id);

  if (debt >= AVUXO_BLOCK_DEBT_LIMIT) {
    driver.status = 'blocked';
    driver.approved = false;
    driver.blocked = true;
    driver.online = false;
    (driver as any).walletDebt = debt;
    driver.blockedReason =
      `Motorista possui dívida AVUXO de R$ ${debt.toFixed(2)}`;

    return res.status(403).json({
      success: false,
      message: 'Motorista não pode ser aprovado com dívida em aberto.',
      driver,
    });
  }

  driver.status = 'approved';
  driver.approved = true;
  driver.blocked = false;
  driver.blockedReason = '';
  (driver as any).walletDebt = debt;

  return res.json({
    success: true,
    message: 'Motorista aprovado com sucesso.',
    driver,
  });
}

export function rejectDriver(req: Request, res: Response) {
  const { id } = req.params;

  const index = driversDatabase.findIndex(
    (item) => String(item.id) === String(id),
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Motorista não encontrado.',
    });
  }

  const driver = driversDatabase[index];

  driver.status = 'rejected';
  driver.approved = false;
  driver.online = false;

  driversDatabase.splice(index, 1);

  return res.json({
    success: true,
    message: 'Motorista rejeitado e removido do painel.',
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
    req.body.reason || 'Bloqueado pelo administrador';
  (driver as any).walletDebt = getDriverDebt(driver.id);

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

  const debt = getDriverDebt(driver.id);

  if (debt >= AVUXO_BLOCK_DEBT_LIMIT) {
    driver.status = 'blocked';
    driver.approved = false;
    driver.blocked = true;
    driver.online = false;
    (driver as any).walletDebt = debt;
    driver.blockedReason =
      `Não é possível desbloquear. Dívida AVUXO de R$ ${debt.toFixed(2)}`;

    return res.status(403).json({
      success: false,
      message: 'Motorista precisa quitar a dívida antes do desbloqueio.',
      driver,
    });
  }

  driver.status = 'pending';
  driver.approved = false;
  driver.blocked = false;
  driver.online = false;
  driver.blockedReason = '';
  (driver as any).walletDebt = debt;

  return res.json({
    success: true,
    message: 'Motorista desbloqueado.',
    driver,
  });
}