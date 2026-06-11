import { Express } from 'express';
import { Server } from 'socket.io';

import { memoryStore } from '../storage/memory.store';

const AVUXO_FEE_PER_FINISHED_RIDE = 0.5;

function rideKey(rideId: any) {
  return String(rideId || '');
}

function getRide(req: any) {
  const id =
    req.params?.rideId ||
    req.body?.rideId ||
    req.query?.rideId;

  if (id && (memoryStore.activeRides as any)[rideKey(id)]) {
    return (memoryStore.activeRides as any)[rideKey(id)];
  }

  return memoryStore.currentRide;
}

function saveRide(ride: any) {
  const id = rideKey(ride.rideId || ride.id);

  (memoryStore.activeRides as any)[id] = ride;

  memoryStore.currentRide = ride as any;

  if (!memoryStore.ridesDatabase.some((r: any) => String(r.rideId || r.id) === id)) {
    memoryStore.ridesDatabase.unshift(ride as any);
  }
}

function removeAvailableRide(rideId: any) {
  const id = rideKey(rideId);

  memoryStore.availableRides = memoryStore.availableRides.filter(
    (ride: any) => String(ride.rideId || ride.id) !== id,
  );
}

function emitRideUpdate(io: Server, ride: any, eventName = 'ride:update') {
  const id = rideKey(ride?.rideId || ride?.id);

  const payload = {
    success: true,
    rideId: id,
    ride,
  };

  io.emit(eventName, payload);
  io.emit('ride:update', payload);
  io.emit('ride:updated', payload);
  io.emit('ride:current', payload);

  if (id) {
    io.to(`ride-${id}`).emit(eventName, payload);
    io.to(`ride-${id}`).emit('ride:update', payload);
    io.to(`ride-${id}`).emit('ride:updated', payload);
    io.to(`ride-${id}`).emit('ride:current', payload);
  }
}

function emitRideCleared(io: Server, rideId?: any) {
  const id = rideKey(rideId);

  const payload = {
    success: true,
    rideId: id,
    ride: null,
  };

  io.emit('ride:update', payload);
  io.emit('ride:current', payload);

  if (id) {
    io.to(`ride-${id}`).emit('ride:update', payload);
    io.to(`ride-${id}`).emit('ride:current', payload);
  }
}

function emitChatCleared(io: Server, rideId?: any) {
  const id = rideKey(rideId);

  const payload = {
    success: true,
    rideId: id,
    messages: [],
    chat: [],
  };

  io.emit('chat:updated', payload);

  if (id) {
    io.to(`ride-${id}`).emit('chat:updated', payload);
  }
}

function ensureStore() {
  const store = memoryStore as any;

  if (!store.activeRides) {
    store.activeRides = {};
  }

  if (!store.availableRides) {
    store.availableRides = [];
  }

  if (!store.driverWallets) {
    store.driverWallets = {};
  }

  if (!store.walletTransactions) {
    store.walletTransactions = [];
  }

  if (!store.rideHistory) {
    store.rideHistory = [];
  }

  if (!store.ridesDatabase) {
    store.ridesDatabase = [];
  }

  if (!store.rideReviews) {
    store.rideReviews = [];
  }

  if (!store.driverReviews) {
    store.driverReviews = [];
  }

  return store;
}

function chargeDriverRideFee(ride: any) {
  const store = ensureStore();

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
  ensureStore();

  app.get('/ride/current', (_req, res) => {
    res.json({
      success: true,
      ride: memoryStore.currentRide || null,
    });
  });

  app.get('/ride/:rideId', (req, res) => {
    const rideId = rideKey(req.params.rideId);
    const ride = (memoryStore.activeRides as any)[rideId];

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Corrida não encontrada.',
      });
    }

    return res.json({
      success: true,
      ride,
    });
  });

  app.get('/rides/active', (_req, res) => {
    res.json({
      success: true,
      rides: Object.values(memoryStore.activeRides || {}),
    });
  });

  app.get('/ride/available', (_req, res) => {
    res.json({
      success: true,
      rides: memoryStore.availableRides || [],
      ride: memoryStore.availableRides?.[0] || null,
    });
  });

  app.get('/ride/history', (_req, res) => {
    res.json({
      success: true,
      rides: memoryStore.rideHistory || [],
    });
  });

  app.get('/driver/wallet/:driverId', (req, res) => {
    const store = ensureStore();
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
    const store = ensureStore();

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
    const store = ensureStore();

    res.json({
      success: true,
      transactions: store.walletTransactions,
    });
  });

  app.post('/ride/request', (req, res) => {
    const now = Date.now();

    const ride = {
      id: now,
      rideId: now,

      originLat: Number(req.body.originLat || req.body.pickupLat || 0),
      originLng: Number(req.body.originLng || req.body.pickupLng || 0),

      destLat: Number(req.body.destLat || req.body.destinationLat || 0),
      destLng: Number(req.body.destLng || req.body.destinationLng || 0),

      originName:
        req.body.originName ||
        req.body.pickupAddress ||
        req.body.originAddress ||
        'Origem AVUXO',

      destinationName:
        req.body.destinationName ||
        req.body.destinationLabel ||
        req.body.destinationAddress ||
        'Destino AVUXO',

      destinationLabel:
        req.body.destinationLabel ||
        req.body.destinationName ||
        req.body.destinationAddress ||
        'Destino AVUXO',

      price: Number(req.body.price || req.body.fare || req.body.total || 0),
      fare: Number(req.body.fare || req.body.price || req.body.total || 0),
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

      declinedDrivers: [],
      status: 'pending',
      avuxoFee: 0,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      chat: [],
    };

    saveRide(ride);

    memoryStore.availableRides.unshift(ride as any);

    io.to('drivers').emit('ride:available', {
      success: true,
      rideId: ride.rideId,
      ride,
    });

    io.to('drivers').emit('ride:available:list', {
      success: true,
      rides: memoryStore.availableRides,
    });

    emitRideUpdate(io, ride, 'ride:requested');

    res.json({
      success: true,
      message: 'Corrida solicitada com sucesso',
      ride,
    });
  });

  app.post('/ride/accept', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida disponível',
      });
    }

    ride.status = 'accepted';
    ride.acceptedAt = new Date().toISOString();
    ride.updatedAt = new Date().toISOString();

    ride.driver = {
      id: req.body.driverId || req.body.id || Date.now(),
      driverId: req.body.driverId || req.body.id || Date.now(),
      name: req.body.name || req.body.fullName || 'Motorista AVUXO',
      fullName: req.body.fullName || req.body.name || 'Motorista AVUXO',
      phone: req.body.phone || '',
      vehicle:
        req.body.vehicle ||
        req.body.car ||
        req.body.carModel ||
        req.body.vehicleName ||
        'Veículo AVUXO',
      car:
        req.body.car ||
        req.body.vehicle ||
        req.body.carModel ||
        'Veículo AVUXO',
      carBrand: req.body.carBrand || req.body.brand || '',
      carModel: req.body.carModel || req.body.model || '',
      carColor: req.body.carColor || req.body.color || '',
      plate:
        req.body.plate ||
        req.body.carPlate ||
        req.body.licensePlate ||
        '',
      carPlate:
        req.body.carPlate ||
        req.body.plate ||
        req.body.licensePlate ||
        '',
      photo:
        req.body.photo ||
        req.body.driverPhoto ||
        req.body.profilePhoto ||
        '',
      driverPhoto:
        req.body.driverPhoto ||
        req.body.photo ||
        req.body.profilePhoto ||
        '',
      vehiclePhoto:
        req.body.vehiclePhoto ||
        req.body.carPhoto ||
        req.body.vehicleImage ||
        '',
      carPhoto:
        req.body.carPhoto ||
        req.body.vehiclePhoto ||
        req.body.vehicleImage ||
        '',
      rating: Number(req.body.rating || req.body.driverRating || 5),
      lat: Number(req.body.lat || req.body.latitude || 0),
      lng: Number(req.body.lng || req.body.longitude || 0),
      bearing: Number(req.body.bearing || 0),
      eta: req.body.eta || 'Chegando em instantes',
      updatedAt: new Date().toISOString(),
    };

    saveRide(ride);
    removeAvailableRide(ride.rideId || ride.id);

    emitRideUpdate(io, ride, 'ride:accepted');

    io.to('drivers').emit('ride:available:list', {
      success: true,
      rides: memoryStore.availableRides,
    });

    res.json({
      success: true,
      message: 'Corrida aceita',
      ride,
    });
  });

  app.post('/ride/decline', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida disponível',
      });
    }

    const driverId =
      req.body.driverId ||
      req.body.id ||
      req.body.driver?.id ||
      'driver-avuxo';

    if (!Array.isArray(ride.declinedDrivers)) {
      ride.declinedDrivers = [];
    }

    if (!ride.declinedDrivers.includes(driverId)) {
      ride.declinedDrivers.push(driverId);
    }

    ride.status = 'pending';
    ride.updatedAt = new Date().toISOString();

    saveRide(ride);

    io.to('drivers').emit('ride:available', {
      success: true,
      rideId: ride.rideId || ride.id,
      ride,
      declinedBy: driverId,
    });

    emitRideUpdate(io, ride, 'ride:declined');

    res.json({
      success: true,
      message: 'Corrida recusada por este motorista',
      ride,
    });
  });

  app.post('/ride/arrived', (_req, res) => {
    const req: any = _req;
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
    }

    ride.status = 'arriving';
    ride.arrivedAt = new Date().toISOString();
    ride.updatedAt = new Date().toISOString();

    saveRide(ride);
    emitRideUpdate(io, ride, 'ride:arrived');

    res.json({
      success: true,
      message: 'Motorista chegou ao passageiro',
      ride,
    });
  });

  app.post('/ride/start', (_req, res) => {
    const req: any = _req;
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
    }

    ride.status = 'in_progress';
    ride.startedAt = new Date().toISOString();
    ride.updatedAt = new Date().toISOString();

    saveRide(ride);
    emitRideUpdate(io, ride, 'ride:started');

    res.json({
      success: true,
      message: 'Corrida iniciada',
      ride,
    });
  });

  app.post('/ride/finish', (_req, res) => {
    const req: any = _req;
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
    }

    ride.status = 'finished';
    ride.finishedAt = new Date().toISOString();
    ride.updatedAt = new Date().toISOString();

    const walletResult = chargeDriverRideFee(ride);

    memoryStore.rideHistory.unshift(ride as any);

    if (memoryStore.rideHistory.length > 200) {
      memoryStore.rideHistory = memoryStore.rideHistory.slice(0, 200);
    }

    delete (memoryStore.activeRides as any)[rideKey(ride.rideId || ride.id)];
    removeAvailableRide(ride.rideId || ride.id);

    if (
      memoryStore.currentRide &&
      String(memoryStore.currentRide.rideId || memoryStore.currentRide.id) ===
        String(ride.rideId || ride.id)
    ) {
      memoryStore.currentRide = null;
    }

    emitRideUpdate(io, ride, 'ride:finished');

    io.emit('wallet:update', {
      success: true,
      wallet: walletResult.wallet,
      transaction: walletResult.transaction,
    });

    emitChatCleared(io, ride.rideId || ride.id);

    setTimeout(() => {
      emitRideCleared(io, ride.rideId || ride.id);
    }, 1200);

    res.json({
      success: true,
      message: 'Corrida finalizada',
      ride,
      wallet: walletResult.wallet,
      transaction: walletResult.transaction,
    });
  });

  app.post('/ride/cancel', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
    }

    ride.status = 'cancelled';
    ride.cancelReason = req.body.reason || 'Cancelada';
    ride.cancelledBy =
      req.body.cancelledBy || req.body.canceledBy || 'system';
    ride.canceledBy =
      req.body.canceledBy || req.body.cancelledBy || 'system';
    ride.cancelledAt = new Date().toISOString();
    ride.updatedAt = new Date().toISOString();

    memoryStore.rideHistory.unshift(ride as any);

    delete (memoryStore.activeRides as any)[rideKey(ride.rideId || ride.id)];
    removeAvailableRide(ride.rideId || ride.id);

    if (
      memoryStore.currentRide &&
      String(memoryStore.currentRide.rideId || memoryStore.currentRide.id) ===
        String(ride.rideId || ride.id)
    ) {
      memoryStore.currentRide = null;
    }

    emitRideUpdate(io, ride, 'ride:cancelled');
    emitChatCleared(io, ride.rideId || ride.id);

    setTimeout(() => {
      emitRideCleared(io, ride.rideId || ride.id);
    }, 1200);

    res.json({
      success: true,
      message: 'Corrida cancelada',
      ride,
    });
  });

  app.post('/ride/review', (req, res) => {
    const store = ensureStore();

    const review = {
      id: Date.now(),
      rideId: req.body.rideId || req.body.id || null,
      rating: Number(req.body.rating || 5),
      comment: req.body.comment || '',
      from: 'passenger',
      to: 'driver',
      createdAt: new Date().toISOString(),
    };

    store.rideReviews.unshift(review);

    io.emit('ride:reviewed', {
      success: true,
      review,
    });

    res.json({
      success: true,
      message: 'Avaliação enviada com sucesso',
      review,
    });
  });

  app.post('/ride/driver-review', (req, res) => {
    const store = ensureStore();

    const review = {
      id: Date.now(),
      rideId: req.body.rideId || req.body.id || null,
      rating: Number(req.body.rating || 5),
      comment: req.body.comment || '',
      from: 'driver',
      to: 'passenger',
      createdAt: new Date().toISOString(),
    };

    store.driverReviews.unshift(review);

    io.emit('ride:driver-reviewed', {
      success: true,
      review,
    });

    res.json({
      success: true,
      message: 'Avaliação do passageiro enviada com sucesso',
      review,
    });
  });
}