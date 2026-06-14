import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { registerPromotionsRoutes } from './routes/promotions.routes';
import { registerAdminPanelRoutes } from './routes/admin.panel.routes';
import { registerDriverRoutes } from './routes/driver.routes';
import { registerRootRoutes } from './routes/root.routes';
import { registerHealthRoutes } from './routes/health.routes';
import { registerAuthRoutes } from './routes/auth.routes';
import { registerSocket } from './sockets/socket';
import adminRoutes from './routes/admin.routes';
import { registerRideRoutes } from './routes/ride.routes';
import { registerLoginRoutes } from './routes/login.routes';
import adminAuthRoutes from './routes/admin.auth.routes';

const app = express();

app.set('trust proxy', 1);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },

  transports: [
    'websocket',
    'polling',
  ],
});

app.use(cors());

app.use(
  express.json({
    limit: '90mb',
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '90mb',
  }),
);

app.get('/ping', (_req, res) => {
  res.send('pong');
});

const PORT = Number(
  process.env.PORT || 3000,
);

registerAdminPanelRoutes(app);
registerLoginRoutes(app);
registerRootRoutes(app);
registerHealthRoutes(app);
registerAuthRoutes(app);
registerDriverRoutes(app);
registerRideRoutes(app, io);
registerPromotionsRoutes(app);

app.use('/admin-auth', adminAuthRoutes);
app.use('/admin', adminRoutes);

registerSocket(io);

httpServer.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log('');
    console.log('====================================');
    console.log('🚀 AVUXO BACKEND ONLINE');
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`📡 Porta: ${PORT}`);
    console.log('====================================');
    console.log('');
  },
);