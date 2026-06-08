import { Express } from 'express';
import { Server } from 'socket.io';

import { memoryStore } from '../storage/memory.store';

const AVUXO_FEE_PER_FINISHED_RIDE = 0.5;

function emitRideUpdate(io: Server, ride: any) {
  io.emit('ride:update', {
    success: true,
    ride,
  });
}

function emitRideCleared(io: Server) {
  io.emit('ride:update', {
    success: true,
    ride: null,
  });
}

function ensureWalletStore() {
  const store = memoryStore as any;

  if (!store.driverWallets) {
    store.driverWallets = {};
  }

  if (!store.walletTransactions) {
    store.walletTransactions = [];
  }

  return store;
}

function chargeDriverRideFee(ride: any) {
  const store = ensureWalletStore();

  const driverId =
    ride?.driver?.id ||
    ride?.driver?.driverId ||
    ride?.driverId ||
    'driver-avuxo';

  const driverName =
    ride?.driver?.fullName ||
    ride?.driver?.name ||
    'Motorista AVUXO';

  if (!store.driverWallets[driverId]) {
    store.driverWallets[driverId] = {
      driverId,
      driverName,
      balance: 0,
      totalFees: 0,
      transactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const transaction = {
    id: Date.now(),
    type: 'ride_fee',
    title: 'Taxa AVUXO por corrida',
    description: 'Desconto automático de R$ 0,50 por corrida finalizada',
    amount: -AVUXO_FEE_PER_FINISHED_RIDE,
    fee: AVUXO_FEE_PER_FINISHED_RIDE,
    rideId: ride?.id || ride?.rideId || Date.now(),
    driverId,
    driverName,
    createdAt: new Date().toISOString(),
  };

  store.driverWallets[driverId].balance =
    Number(store.driverWallets[driverId].balance || 0) -
    AVUXO_FEE_PER_FINISHED_RIDE;

  store.driverWallets[driverId].totalFees =
    Number(store.driverWallets[driverId].totalFees || 0) +
    AVUXO_FEE_PER_FINISHED_RIDE;

  store.driverWallets[driverId].updatedAt = new Date().toISOString();
  store.driverWallets[driverId].transactions.unshift(transaction);
  store.walletTransactions.unshift(transaction);

  ride.avuxoFee = AVUXO_FEE_PER_FINISHED_RIDE;
  ride.driverWalletBalanceAfterFee = store.driverWallets[driverId].balance;
  ride.walletTransaction = transaction;

  return {
    wallet: store.driverWallets[driverId],
    transaction,
  };
}

export function registerRideRoutes(app: Express, io: Server) {
  app.get('/ride/current', (_req, res) => {
    res.json({
      success: true,
      ride: memoryStore.currentRide,
    });
  });

  app.get('/ride/history', (_req, res) => {
    res.json({
      success: true,
      rides: memoryStore.rideHistory,
    });
  });

  app.get('/driver/wallet/:driverId', (req, res) => {
    const store = ensureWalletStore();
    const driverId = req.params.driverId;

    const wallet =
      store.driverWallets[driverId] || {
        driverId,
        balance: 0,
        totalFees: 0,
        transactions: [],
      };

    res.json({
      success: true,
      wallet,
    });
  });

app.post('/driver/wallet/:driverId/payment', (req, res) => {
  const store = ensureWalletStore();

  const driverId = String(req.params.driverId);
  const amount = Number(req.body.amount || 0);

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valor do pagamento inválido.',
    });
  }

  if (!store.driverWallets[driverId]) {
    store.driverWallets[driverId] = {
      driverId,
      balance: 0,
      totalFees: 0,
      transactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const transaction = {
    id: Date.now(),
    type: 'payment',
    title: 'Pagamento de dívida AVUXO',
    description: req.body.note || 'Pagamento PIX confirmado pelo admin',
    amount,
    method: req.body.method || 'PIX',
    driverId,
    createdAt: new Date().toISOString(),
  };

  store.driverWallets[driverId].balance =
    Number(store.driverWallets[driverId].balance || 0) + amount;

  store.driverWallets[driverId].updatedAt = new Date().toISOString();
  store.driverWallets[driverId].transactions.unshift(transaction);
  store.walletTransactions.unshift(transaction);

  io.emit('wallet:update', {
    success: true,
    wallet: store.driverWallets[driverId],
    transaction,
  });

  return res.json({
    success: true,
    message: 'Pagamento confirmado com sucesso.',
    wallet: store.driverWallets[driverId],
    transaction,
  });
});

  app.get('/wallet/transactions', (_req, res) => {
    const store = ensureWalletStore();

    res.json({
      success: true,
      transactions: store.walletTransactions,
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
      destinationName:
        req.body.destinationName ||
        req.body.destinationLabel ||
        'Destino AVUXO',
      destinationLabel:
        req.body.destinationLabel ||
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

      requestedAt: req.body.requestedAt || new Date().toISOString(),

      passenger: {
        uid: req.body.passenger?.uid || '',
        name: req.body.passenger?.name || 'Passageiro',
        fullName:
          req.body.passenger?.fullName ||
          req.body.passenger?.name ||
          'Passageiro',
        photo: req.body.passenger?.photo || '',
        email: req.body.passenger?.email || '',
        phone: req.body.passenger?.phone || '',
        rating: Number(req.body.passenger?.rating || 5),
      },

      status: 'pending',

      avuxoFee: 0,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      chat: [],
    };

    memoryStore.currentRide = ride as any;
    memoryStore.ridesDatabase.unshift(ride as any);

    emitRideUpdate(io, memoryStore.currentRide);

    io.to('drivers').emit('ride:available', {
      success: true,
      ride: memoryStore.currentRide,
    });

    res.json({
      success: true,
      message: 'Corrida solicitada com sucesso',
      ride,
    });
  });

  app.post('/ride/accept', (req, res) => {
    if (!memoryStore.currentRide) {
      res.status(404).json({
        success: false,
        message: 'Nenhuma corrida disponível',
      });
      return;
    }

    memoryStore.currentRide.status = 'accepted';
    memoryStore.currentRide.updatedAt = new Date().toISOString();

    memoryStore.currentRide.driver = {
      id: req.body.driverId || req.body.id || Date.now(),
      driverId: req.body.driverId || req.body.id || Date.now(),
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

    emitRideUpdate(io, memoryStore.currentRide);

    res.json({
      success: true,
      message: 'Corrida aceita',
      ride: memoryStore.currentRide,
    });
  });

  app.post('/ride/arrived', (_req, res) => {
    if (!memoryStore.currentRide) {
      res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
      return;
    }

    memoryStore.currentRide.status = 'arriving';
    memoryStore.currentRide.updatedAt = new Date().toISOString();

    emitRideUpdate(io, memoryStore.currentRide);

    res.json({
      success: true,
      message: 'Motorista chegando',
      ride: memoryStore.currentRide,
    });
  });

  app.post('/ride/start', (_req, res) => {
    if (!memoryStore.currentRide) {
      res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
      return;
    }

    memoryStore.currentRide.status = 'in_progress';
    memoryStore.currentRide.updatedAt = new Date().toISOString();

    emitRideUpdate(io, memoryStore.currentRide);

    res.json({
      success: true,
      message: 'Corrida iniciada',
      ride: memoryStore.currentRide,
    });
  });

  app.post('/ride/finish', (_req, res) => {
    if (!memoryStore.currentRide) {
      res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
      return;
    }

    memoryStore.currentRide.status = 'finished';
    memoryStore.currentRide.finishedAt = new Date().toISOString();
    memoryStore.currentRide.updatedAt = new Date().toISOString();

    const walletResult = chargeDriverRideFee(memoryStore.currentRide);

    memoryStore.rideHistory.unshift(memoryStore.currentRide);

    if (memoryStore.rideHistory.length > 200) {
      memoryStore.rideHistory = memoryStore.rideHistory.slice(0, 200);
    }

    const finishedRide = memoryStore.currentRide;

    emitRideUpdate(io, finishedRide);

    io.emit('wallet:update', {
      success: true,
      wallet: walletResult.wallet,
      transaction: walletResult.transaction,
    });

    memoryStore.currentRide = null;

    setTimeout(() => {
      emitRideCleared(io);
    }, 900);

    res.json({
      success: true,
      message: 'Corrida finalizada',
      ride: finishedRide,
      wallet: walletResult.wallet,
      transaction: walletResult.transaction,
    });
  });

  app.post('/ride/cancel', (req, res) => {
    if (!memoryStore.currentRide) {
      res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
      return;
    }

    memoryStore.currentRide.status = 'cancelled';
    memoryStore.currentRide.cancelReason = req.body.reason || 'Cancelada';
    memoryStore.currentRide.cancelledBy =
      req.body.cancelledBy || req.body.canceledBy || 'system';
    memoryStore.currentRide.canceledBy =
      req.body.canceledBy || req.body.cancelledBy || 'system';
    memoryStore.currentRide.cancelledAt = new Date().toISOString();
    memoryStore.currentRide.updatedAt = new Date().toISOString();

    memoryStore.rideHistory.unshift(memoryStore.currentRide);

    const cancelledRide = memoryStore.currentRide;

    emitRideUpdate(io, cancelledRide);

    memoryStore.currentRide = null;

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