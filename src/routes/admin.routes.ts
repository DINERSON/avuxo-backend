import { Router } from 'express';

import {
  approveDriver,
  blockDriver,
  listAllDrivers,
  listPendingDrivers,
  rejectDriver,
  unblockDriver,
} from '../controllers/admin.controller';

const adminRoutes = Router();

adminRoutes.get('/drivers', listAllDrivers);

adminRoutes.get('/drivers/pending', listPendingDrivers);

adminRoutes.post('/drivers/:id/approve', approveDriver);

adminRoutes.post('/drivers/:id/reject', rejectDriver);

adminRoutes.post('/drivers/:id/block', blockDriver);

adminRoutes.post('/drivers/:id/unblock', unblockDriver);

export default adminRoutes;