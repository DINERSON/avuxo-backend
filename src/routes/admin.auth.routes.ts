import { Router } from 'express';

import {
  adminLogin,
  adminLogout,
  adminMe,
} from '../controllers/admin.auth.controller';

import {
  adminAuth,
} from '../middleware/adminAuth';

const adminAuthRoutes = Router();

adminAuthRoutes.post(
  '/login',
  adminLogin,
);

adminAuthRoutes.get(
  '/me',
  adminAuth,
  adminMe,
);

adminAuthRoutes.post(
  '/logout',
  adminAuth,
  adminLogout,
);

export default adminAuthRoutes;