import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { registerAdminPanelRoutes } from './routes/admin.panel.routes';
import { registerDriverRoutes } from './routes/driver.routes';
import { registerRootRoutes } from './routes/root.routes';
import { registerHealthRoutes } from './routes/health.routes';
import { registerAuthRoutes } from './routes/auth.routes';
import { registerSocket } from './sockets/socket';
import adminRoutes from './routes/admin.routes';
import { registerRideRoutes } from './routes/ride.routes';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

app.use(cors());

app.use(
  express.json({
    limit: '90mb',
  }),
);

const PORT = Number(process.env.PORT || 3000);

registerAdminPanelRoutes(app);
registerRootRoutes(app);
registerHealthRoutes(app);
registerAuthRoutes(app);
registerDriverRoutes(app);
registerRideRoutes(app, io);

app.use('/admin', adminRoutes);

registerSocket(io);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('====================================');
  console.log('🚀 AVUXO BACKEND ONLINE');
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📡 Porta: ${PORT}`);
  console.log('====================================');
  console.log('');
});