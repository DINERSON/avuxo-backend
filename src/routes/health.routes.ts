import { Express } from 'express';

export function registerHealthRoutes(app: Express) {

  app.get('/health', (_req, res) => {

    res.json({
      success: true,
      app: 'AVUXO Backend',
      status: 'online',
      timestamp: new Date().toISOString(),
    });

  });

}