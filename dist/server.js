"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const admin_panel_routes_1 = require("./routes/admin.panel.routes");
const driver_routes_1 = require("./routes/driver.routes");
const root_routes_1 = require("./routes/root.routes");
const health_routes_1 = require("./routes/health.routes");
const auth_routes_1 = require("./routes/auth.routes");
const socket_1 = require("./sockets/socket");
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const ride_routes_1 = require("./routes/ride.routes");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json({
    limit: '90mb',
}));
const PORT = Number(process.env.PORT || 3000);
(0, admin_panel_routes_1.registerAdminPanelRoutes)(app);
(0, root_routes_1.registerRootRoutes)(app);
(0, health_routes_1.registerHealthRoutes)(app);
(0, auth_routes_1.registerAuthRoutes)(app);
(0, driver_routes_1.registerDriverRoutes)(app);
(0, ride_routes_1.registerRideRoutes)(app, io);
app.use('/admin', admin_routes_1.default);
(0, socket_1.registerSocket)(io);
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('====================================');
    console.log('🚀 AVUXO BACKEND ONLINE');
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`📡 Porta: ${PORT}`);
    console.log('====================================');
    console.log('');
});
