import { Express } from 'express';

export function registerHealthRoutes(app: Express) {
  app.get('/health', (_req, res) => {
    return res.status(200).json({
      success: true,
      app: 'AVUXO Backend',
      status: 'online',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });
}