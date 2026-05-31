"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthRoutes = registerHealthRoutes;
function registerHealthRoutes(app) {
    app.get('/health', (_req, res) => {
        res.json({
            success: true,
            app: 'AVUXO Backend',
            status: 'online',
            timestamp: new Date().toISOString(),
        });
    });
}
