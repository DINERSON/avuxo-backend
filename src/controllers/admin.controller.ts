import { Request, Response } from 'express';
import { memoryStore } from '../storage/memory.store';

const driversDatabase = memoryStore.driversDatabase;

export function listPendingDrivers(_req: Request, res: Response) {
  const pendingDrivers = driversDatabase.filter(
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
  return res.json({
    success: true,
    total: driversDatabase.length,
    drivers: driversDatabase,
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
  driver.blockedReason = '';

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
    req.body.reason || 'Mensalidade pendente';

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

  driver.status = 'pending';
  driver.approved = false;
  driver.blocked = false;
  driver.online = false;
  driver.blockedReason = '';

  return res.json({
    success: true,
    message: 'Motorista desbloqueado.',
    driver,
  });
}