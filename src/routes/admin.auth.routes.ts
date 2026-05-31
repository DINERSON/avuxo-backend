import { Router } from 'express';

import {
  adminLogin,
  adminLogout,
  adminMe,
} from '..controllersadmin.auth.controller';

import {
  adminAuth,
} from '..middlewareadminAuth';

const adminAuthRoutes = Router();

adminAuthRoutes.post(
  'login',
  adminLogin,
);

adminAuthRoutes.get(
  'me',
  adminAuth,
  adminMe,
);

adminAuthRoutes.post(
  'logout',
  adminAuth,
  adminLogout,
);

export default adminAuthRoutes;