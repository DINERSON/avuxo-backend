"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRideRoutes = registerRideRoutes;
const memory_store_1 = require("../storage/memory.store");
function emitRideUpdate(io, ride) {
    io.emit('ride:update', {
        success: true,
        ride,
    });
}
function emitRideCleared(io) {
    io.emit('ride:update', {
        success: true,
        ride: null,
    });
}
function registerRideRoutes(app, io) {
    app.get('/ride/current', (_req, res) => {
        res.json({
            success: true,
            ride: memory_store_1.memoryStore.currentRide,
        });
    });
    app.get('/ride/history', (_req, res) => {
        res.json({
            success: true,
            rides: memory_store_1.memoryStore.rideHistory,
        });
    });
    app.post('/ride/request', (req, res) => {
        const ride = {
            id: Date.now(),
            rideId: Date.now(),
            originLat: Number(req.body.originLat || req.body.pickupLat || 0),
            originLng: Number(req.body.originLng || req.body.pickupLng || 0),
            destLat: Number(req.body.destLat || req.body.destinationLat || 0),
            destLng: Number(req.body.destLng || req.body.destinationLng || 0),
            originName: req.body.originName || 'Origem AVUXO',
            destinationName: req.body.destinationName ||
                req.body.destinationLabel ||
                'Destino AVUXO',
            destinationLabel: req.body.destinationLabel ||
                req.body.destinationName ||
                'Destino AVUXO',
            price: Number(req.body.price || req.body.fare || 0),
            fare: Number(req.body.fare || req.body.price || 0),
            total: Number(req.body.total || req.body.price || req.body.fare || 0),
            distanceKm: Number(req.body.distanceKm || 0),
            distanceText: req.body.distanceText || '',
            eta: req.body.eta || '',
            rideType: req.body.rideType || 'Carro',
            paymentMethod: req.body.paymentMethod || 'PIX',
            platform: req.body.platform || 'passenger_app',
            requestedAt: req.body.requestedAt ||
                new Date().toISOString(),
            passenger: {
                uid: req.body.passenger?.uid || '',
                name: req.body.passenger?.name || 'Passageiro',
                fullName: req.body.passenger?.fullName ||
                    req.body.passenger?.name ||
                    'Passageiro',
                photo: req.body.passenger?.photo || '',
                email: req.body.passenger?.email || '',
                phone: req.body.passenger?.phone || '',
                rating: Number(req.body.passenger?.rating || 5),
            },
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            chat: [],
        };
        memory_store_1.memoryStore.currentRide = ride;
        memory_store_1.memoryStore.ridesDatabase.unshift(ride);
        emitRideUpdate(io, memory_store_1.memoryStore.currentRide);
        io.to('drivers').emit('ride:available', {
            success: true,
            ride: memory_store_1.memoryStore.currentRide,
        });
        res.json({
            success: true,
            message: 'Corrida solicitada com sucesso',
            ride,
        });
    });
    app.post('/ride/accept', (req, res) => {
        if (!memory_store_1.memoryStore.currentRide) {
            res.status(404).json({
                success: false,
                message: 'Nenhuma corrida disponível',
            });
            return;
        }
        memory_store_1.memoryStore.currentRide.status = 'accepted';
        memory_store_1.memoryStore.currentRide.updatedAt = new Date().toISOString();
        memory_store_1.memoryStore.currentRide.driver = {
            id: req.body.driverId || req.body.id || Date.now(),
            name: req.body.name || req.body.fullName || 'Motorista AVUXO',
            fullName: req.body.fullName || req.body.name || 'Motorista AVUXO',
            phone: req.body.phone || '',
            vehicle: req.body.vehicle || req.body.carModel || 'Carro AVUXO',
            car: req.body.car || req.body.carModel || 'Carro AVUXO',
            plate: req.body.plate || req.body.carPlate || 'AVX-2026',
            carPlate: req.body.carPlate || req.body.plate || 'AVX-2026',
            lat: Number(req.body.lat || 0),
            lng: Number(req.body.lng || 0),
            bearing: Number(req.body.bearing || 0),
        };
        emitRideUpdate(io, memory_store_1.memoryStore.currentRide);
        res.json({
            success: true,
            message: 'Corrida aceita',
            ride: memory_store_1.memoryStore.currentRide,
        });
    });
    app.post('/ride/arrived', (_req, res) => {
        if (!memory_store_1.memoryStore.currentRide) {
            res.status(404).json({
                success: false,
                message: 'Nenhuma corrida ativa',
            });
            return;
        }
        memory_store_1.memoryStore.currentRide.status = 'arriving';
        memory_store_1.memoryStore.currentRide.updatedAt = new Date().toISOString();
        emitRideUpdate(io, memory_store_1.memoryStore.currentRide);
        res.json({
            success: true,
            message: 'Motorista chegando',
            ride: memory_store_1.memoryStore.currentRide,
        });
    });
    app.post('/ride/start', (_req, res) => {
        if (!memory_store_1.memoryStore.currentRide) {
            res.status(404).json({
                success: false,
                message: 'Nenhuma corrida ativa',
            });
            return;
        }
        memory_store_1.memoryStore.currentRide.status = 'in_progress';
        memory_store_1.memoryStore.currentRide.updatedAt = new Date().toISOString();
        emitRideUpdate(io, memory_store_1.memoryStore.currentRide);
        res.json({
            success: true,
            message: 'Corrida iniciada',
            ride: memory_store_1.memoryStore.currentRide,
        });
    });
    app.post('/ride/finish', (_req, res) => {
        if (!memory_store_1.memoryStore.currentRide) {
            res.status(404).json({
                success: false,
                message: 'Nenhuma corrida ativa',
            });
            return;
        }
        memory_store_1.memoryStore.currentRide.status = 'finished';
        memory_store_1.memoryStore.currentRide.finishedAt = new Date().toISOString();
        memory_store_1.memoryStore.currentRide.updatedAt = new Date().toISOString();
        memory_store_1.memoryStore.rideHistory.unshift(memory_store_1.memoryStore.currentRide);
        if (memory_store_1.memoryStore.rideHistory.length > 200) {
            memory_store_1.memoryStore.rideHistory = memory_store_1.memoryStore.rideHistory.slice(0, 200);
        }
        const finishedRide = memory_store_1.memoryStore.currentRide;
        emitRideUpdate(io, finishedRide);
        memory_store_1.memoryStore.currentRide = null;
        setTimeout(() => {
            emitRideCleared(io);
        }, 900);
        res.json({
            success: true,
            message: 'Corrida finalizada',
            ride: finishedRide,
        });
    });
    app.post('/ride/cancel', (req, res) => {
        if (!memory_store_1.memoryStore.currentRide) {
            res.status(404).json({
                success: false,
                message: 'Nenhuma corrida ativa',
            });
            return;
        }
        memory_store_1.memoryStore.currentRide.status = 'cancelled';
        memory_store_1.memoryStore.currentRide.cancelReason = req.body.reason || 'Cancelada';
        memory_store_1.memoryStore.currentRide.cancelledBy =
            req.body.cancelledBy || req.body.canceledBy || 'system';
        memory_store_1.memoryStore.currentRide.canceledBy =
            req.body.canceledBy || req.body.cancelledBy || 'system';
        memory_store_1.memoryStore.currentRide.cancelledAt = new Date().toISOString();
        memory_store_1.memoryStore.currentRide.updatedAt = new Date().toISOString();
        memory_store_1.memoryStore.rideHistory.unshift(memory_store_1.memoryStore.currentRide);
        const cancelledRide = memory_store_1.memoryStore.currentRide;
        emitRideUpdate(io, cancelledRide);
        memory_store_1.memoryStore.currentRide = null;
        setTimeout(() => {
            emitRideCleared(io);
        }, 900);
        res.json({
            success: true,
            message: 'Corrida cancelada',
            ride: cancelledRide,
        });
    });
}
