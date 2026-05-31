"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriverRoutes = registerDriverRoutes;
const memory_store_1 = require("../storage/memory.store");
function registerDriverRoutes(app) {
    app.get('/drivers', (_req, res) => {
        res.json({
            success: true,
            drivers: memory_store_1.memoryStore.driversDatabase,
        });
    });
    app.post('/drivers/register', (req, res) => {
        const driver = {
            id: Date.now(),
            fullName: req.body.fullName || req.body.name || 'Motorista AVUXO',
            email: req.body.email || '',
            phone: req.body.phone || '',
            carBrand: req.body.carBrand || '',
            carModel: req.body.carModel || '',
            carPlate: req.body.carPlate || req.body.plate || '',
            carColor: req.body.carColor || '',
            carYear: req.body.carYear || '',
            carSeats: req.body.carSeats || '',
            renavam: req.body.renavam || '',
            driverPhoto: req.body.driverPhoto || '',
            vehiclePhoto: req.body.vehiclePhoto || '',
            documentPhoto: req.body.documentPhoto || '',
            licensePhoto: req.body.licensePhoto || '',
            cnhFront: req.body.cnhFront || req.body.cnhFrontPhoto || '',
            cnhBack: req.body.cnhBack || req.body.cnhBackPhoto || '',
            cnhFrontPhoto: req.body.cnhFrontPhoto || req.body.cnhFront || '',
            cnhBackPhoto: req.body.cnhBackPhoto || req.body.cnhBack || '',
            vehicleDocumentPhoto: req.body.vehicleDocumentPhoto || '',
            vehicleDocumentPdf: req.body.vehicleDocumentPdf || '',
            vehicleSidePhoto: req.body.vehicleSidePhoto || '',
            vehicleBackPhoto: req.body.vehicleBackPhoto || '',
            rentedVehicle: Boolean(req.body.rentedVehicle),
            status: 'pending',
            approved: false,
            online: false,
            blocked: false,
            blockedReason: '',
            createdAt: new Date().toISOString(),
        };
        memory_store_1.memoryStore.driversDatabase.unshift(driver);
        res.json({
            success: true,
            message: 'Motorista cadastrado com sucesso',
            driver,
        });
    });
    app.post('/drivers/status', (req, res) => {
        const id = Number(req.body.id || req.body.driverId);
        const online = Boolean(req.body.online);
        const driver = memory_store_1.memoryStore.driversDatabase.find((item) => Number(item.id) === id);
        if (!driver) {
            res.status(404).json({
                success: false,
                message: 'Motorista não encontrado',
            });
            return;
        }
        if (driver.blocked) {
            res.status(403).json({
                success: false,
                message: 'Motorista bloqueado',
            });
            return;
        }
        if (!driver.approved) {
            res.status(403).json({
                success: false,
                message: 'Motorista ainda não aprovado',
            });
            return;
        }
        driver.online = online;
        res.json({
            success: true,
            driver,
        });
    });
    app.get('/driver/profile/:id', (req, res) => {
        const id = Number(req.params.id);
        const driver = memory_store_1.memoryStore.driversDatabase.find((item) => Number(item.id) === id);
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Motorista não encontrado',
            });
        }
        return res.json({
            success: true,
            driver,
        });
    });
    app.get('/driver/wallet/:id', (_req, res) => {
        return res.json({
            success: true,
            wallet: {
                balance: 1247.80,
                today: 187.50,
                week: 1243.00,
                month: 4872.00,
                fee: 20,
            },
        });
    });
    app.get('/driver/trips/:id', (_req, res) => {
        return res.json({
            success: true,
            trips: [],
        });
    });
    app.get('/driver/vehicle/:id', (req, res) => {
        const id = Number(req.params.id);
        const driver = memory_store_1.memoryStore.driversDatabase.find((item) => Number(item.id) === id);
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Motorista não encontrado',
            });
        }
        return res.json({
            success: true,
            vehicle: {
                brand: driver.carBrand,
                model: driver.carModel,
                plate: driver.carPlate,
                color: driver.carColor,
                year: driver.carYear,
                renavam: driver.renavam,
            },
        });
    });
    app.get('/driver/performance/:id', (_req, res) => {
        return res.json({
            success: true,
            performance: {
                rating: 4.98,
                completedTrips: 325,
                acceptanceRate: 97,
                cancelRate: 1,
                onlineHours: 142,
            },
        });
    });
    app.get('/driver/notifications/:id', (_req, res) => {
        return res.json({
            success: true,
            notifications: [],
        });
    });
}
