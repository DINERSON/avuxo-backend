import { Express } from 'express';
import { Server } from 'socket.io';

import { memoryStore } from '../storage/memory.store';

const AVUXO_FEE_PER_FINISHED_RIDE = 0.5;

function rideKey(rideId: any) {
  return String(rideId || '').trim();
}

function money(value: any) {
  const parsed = Number(value || 0);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Number(parsed.toFixed(2));
}

function now() {
  return new Date().toISOString();
}

function transactionId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 99999)}`;
}

function getRequestedRideId(req: any) {
  return rideKey(
    req.params?.rideId ||
      req.body?.rideId ||
      req.query?.rideId ||
      req.body?.id ||
      req.query?.id,
  );
}

function sameRideId(a: any, b: any) {
  return rideKey(a) !== '' && rideKey(a) === rideKey(b);
}

function getRide(req: any) {
  const id = getRequestedRideId(req);

  if (id) {
    const activeRide = (memoryStore.activeRides as any)?.[id];

    if (activeRide) {
      return activeRide;
    }

    const databaseRide = memoryStore.ridesDatabase?.find(
      (ride: any) => sameRideId(ride.rideId || ride.id, id),
    );

    if (databaseRide) {
      return databaseRide;
    }

    if (
      memoryStore.currentRide &&
      sameRideId(
        memoryStore.currentRide.rideId || memoryStore.currentRide.id,
        id,
      )
    ) {
      return memoryStore.currentRide;
    }

    return null;
  }

  const activeRides = Object.values(memoryStore.activeRides || {});

  return activeRides.length > 0 ? activeRides[0] : null;
}

function saveRide(ride: any) {
  const id = rideKey(ride.rideId || ride.id);

  if (!id) return;

  ride.rideId = id;
  ride.id = id;
  ride.updatedAt = now();

  (memoryStore.activeRides as any)[id] = ride;

  if (!memoryStore.currentRide) {
    memoryStore.currentRide = ride as any;
  }

  const exists = memoryStore.ridesDatabase.some(
    (r: any) => String(r.rideId || r.id) === id,
  );

  if (!exists) {
    memoryStore.ridesDatabase.unshift(ride as any);
  }
}

function removeAvailableRide(rideId: any) {
  const id = rideKey(rideId);

  memoryStore.availableRides = memoryStore.availableRides.filter(
    (ride: any) => String(ride.rideId || ride.id) !== id,
  );
}

function removeRideFromHistory(rideId: any) {
  const id = rideKey(rideId);

  memoryStore.rideHistory = memoryStore.rideHistory.filter(
    (ride: any) => String(ride.rideId || ride.id) !== id,
  );
}

function emitToRideRoom(
  io: Server,
  rideId: any,
  eventName: string,
  payload: any,
) {
  const id = rideKey(rideId);

  if (!id) return;

  io.to(`ride-${id}`).emit(eventName, payload);
}

function emitRideUpdate(
  io: Server,
  ride: any,
  eventName = 'ride:update',
) {
  const id = rideKey(ride?.rideId || ride?.id);

  const payload = {
    success: true,
    rideId: id,
    ride,
  };

  io.to('admin').emit(eventName, payload);
  io.to('admins').emit(eventName, payload);

  if (id) {
    emitToRideRoom(io, id, eventName, payload);
    emitToRideRoom(io, id, 'ride:update', payload);
    emitToRideRoom(io, id, 'ride:updated', payload);
    emitToRideRoom(io, id, 'ride:current', payload);
  }
}

function emitRideCleared(io: Server, rideId?: any) {
  const id = rideKey(rideId);

  const payload = {
    success: true,
    rideId: id,
    ride: null,
  };

  io.to('admin').emit('ride:update', payload);
  io.to('admins').emit('ride:update', payload);

  if (id) {
    emitToRideRoom(io, id, 'ride:update', payload);
    emitToRideRoom(io, id, 'ride:current', payload);
    emitToRideRoom(io, id, 'ride:cleared', payload);
  }
}

function emitChatUpdate(io: Server, ride: any) {
  const id = rideKey(ride?.rideId || ride?.id);

  if (!id) return;

  const payload = {
    success: true,
    rideId: id,
    messages: ride?.chat || [],
    chat: ride?.chat || [],
  };

  emitToRideRoom(io, id, 'chat:updated', payload);

  io.to('admin').emit('chat:updated', payload);
  io.to('admins').emit('chat:updated', payload);
}

function emitChatCleared(io: Server, rideId?: any) {
  const id = rideKey(rideId);

  if (!id) return;

  const payload = {
    success: true,
    rideId: id,
    messages: [],
    chat: [],
  };

  emitToRideRoom(io, id, 'chat:updated', payload);

  io.to('admin').emit('chat:updated', payload);
  io.to('admins').emit('chat:updated', payload);
}

function ensureStore() {
  const store = memoryStore as any;

  store.currentRide = store.currentRide || null;
  store.activeRides = store.activeRides || {};
  store.availableRides = store.availableRides || [];

  store.passengerWallets = store.passengerWallets || {};
  store.driverWallets = store.driverWallets || {};
  store.walletTransactions = store.walletTransactions || [];

  store.rideHistory = store.rideHistory || [];
  store.ridesDatabase = store.ridesDatabase || [];
  store.rideReviews = store.rideReviews || [];
  store.driverReviews = store.driverReviews || [];

  return store;
}

function getPassengerId(ride: any) {
  return String(
    ride?.passenger?.uid ||
      ride?.passenger?.id ||
      ride?.passengerId ||
      ride?.passenger?.phone ||
      '',
  ).trim();
}

function getDriverId(ride: any) {
  return String(
    ride?.driver?.id ||
      ride?.driver?.driverId ||
      ride?.driverId ||
      '',
  ).trim();
}

function createPassengerWallet(passengerId: string) {
  const store = ensureStore();

  if (!store.passengerWallets[passengerId]) {
    store.passengerWallets[passengerId] = {
      passengerId,
      balance: 0,
      transactions: [],
      createdAt: now(),
      updatedAt: now(),
    };
  }

  return store.passengerWallets[passengerId];
}

function createDriverWallet(driverId: string, driverName = 'Motorista AVUXO') {
  const store = ensureStore();

  if (!store.driverWallets[driverId]) {
    store.driverWallets[driverId] = {
      driverId,
      driverName,
      balance: 0,
      availableBalance: 0,
      totalEarnings: 0,
      totalFees: 0,
      transactions: [],
      createdAt: now(),
      updatedAt: now(),
    };
  }

  if (!store.driverWallets[driverId].driverName) {
    store.driverWallets[driverId].driverName = driverName;
  }

  return store.driverWallets[driverId];
}

function pushWalletTransaction(wallet: any, transaction: any) {
  const store = ensureStore();

  wallet.transactions = wallet.transactions || [];
  wallet.transactions.unshift(transaction);
  wallet.updatedAt = now();

  store.walletTransactions.unshift(transaction);
}

function processFinishedRideWallet(ride: any) {
  const store = ensureStore();

  const rideId = rideKey(ride?.rideId || ride?.id);
  const passengerId = getPassengerId(ride);
  const driverId = getDriverId(ride);

  const driverName =
    ride?.driver?.fullName || ride?.driver?.name || 'Motorista AVUXO';

  const rideAmount = money(ride?.total || ride?.fare || ride?.price || 0);
  const avuxoFee = money(AVUXO_FEE_PER_FINISHED_RIDE);

  if (!rideId) {
    return {
      success: false,
      status: 400,
      message: 'rideId inválido para finalizar pagamento.',
    };
  }

  if (!passengerId) {
    return {
      success: false,
      status: 400,
      message: 'Passageiro inválido para finalizar pagamento.',
    };
  }

  if (!driverId) {
    return {
      success: false,
      status: 400,
      message: 'Motorista inválido para finalizar pagamento.',
    };
  }

  if (rideAmount <= 0) {
    return {
      success: false,
      status: 400,
      message: 'Valor da corrida inválido.',
    };
  }

  const passengerWallet = createPassengerWallet(passengerId);
  const driverWallet = createDriverWallet(driverId, driverName);

  if (money(passengerWallet.balance) < rideAmount) {
    return {
      success: false,
      status: 400,
      message: 'Saldo insuficiente. Adicione saldo para finalizar a corrida.',
      passengerWallet,
    };
  }

  if (money(driverWallet.balance) < avuxoFee) {
    return {
      success: false,
      status: 400,
      message:
        'Motorista sem saldo suficiente para pagar a taxa AVUXO. Adicione saldo na carteira.',
      driverWallet,
    };
  }

  const alreadyPaid = store.walletTransactions.some(
    (item: any) =>
      String(item.rideId || '') === rideId &&
      String(item.type || '') === 'ride_payment',
  );

  if (alreadyPaid) {
    return {
      success: true,
      alreadyProcessed: true,
      passengerWallet,
      driverWallet,
      transactions: [],
    };
  }

  passengerWallet.balance = money(passengerWallet.balance - rideAmount);

  const passengerTransaction = {
    id: transactionId('passenger-ride-payment'),
    userId: passengerId,
    userType: 'passenger',
    type: 'ride_payment',
    title: 'Pagamento de corrida',
    amount: -rideAmount,
    description: 'Pagamento da corrida com saldo AVUXO',
    rideId,
    passengerId,
    driverId,
    createdAt: now(),
  };

  pushWalletTransaction(passengerWallet, passengerTransaction);

  driverWallet.balance = money(driverWallet.balance + rideAmount);
  driverWallet.availableBalance = money(
    Number(driverWallet.availableBalance || 0) + rideAmount,
  );
  driverWallet.totalEarnings = money(
    Number(driverWallet.totalEarnings || 0) + rideAmount,
  );

  const earningTransaction = {
    id: transactionId('driver-ride-earning'),
    userId: driverId,
    userType: 'driver',
    type: 'ride_earning',
    title: 'Ganho de corrida',
    amount: rideAmount,
    description: 'Valor recebido pela corrida finalizada',
    rideId,
    passengerId,
    driverId,
    createdAt: now(),
  };

  pushWalletTransaction(driverWallet, earningTransaction);

  driverWallet.balance = money(driverWallet.balance - avuxoFee);
  driverWallet.availableBalance = money(
    Number(driverWallet.availableBalance || 0) - avuxoFee,
  );
  driverWallet.totalFees = money(Number(driverWallet.totalFees || 0) + avuxoFee);

  const feeTransaction = {
    id: transactionId('driver-avuxo-fee'),
    userId: driverId,
    userType: 'driver',
    type: 'avuxo_fee',
    title: 'Taxa AVUXO',
    amount: -avuxoFee,
    description: 'Taxa AVUXO descontada por corrida finalizada',
    rideId,
    passengerId,
    driverId,
    createdAt: now(),
  };

  pushWalletTransaction(driverWallet, feeTransaction);

  ride.avuxoFee = avuxoFee;
  ride.passengerPaidAmount = rideAmount;
  ride.driverEarningAmount = rideAmount;
  ride.driverWalletBalanceAfterFee = driverWallet.balance;
  ride.walletTransaction = feeTransaction;
  ride.walletTransactions = [
    passengerTransaction,
    earningTransaction,
    feeTransaction,
  ];

  return {
    success: true,
    passengerWallet,
    driverWallet,
    transactions: [
      passengerTransaction,
      earningTransaction,
      feeTransaction,
    ],
  };
}

export function registerRideRoutes(app: Express, io: Server) {
  ensureStore();

  app.get('/ride/current', (req, res) => {
    const ride = getRide(req);

    return res.json({
      success: true,
      ride: ride || null,
    });
  });

  app.get('/rides/active', (_req, res) => {
    return res.json({
      success: true,
      rides: Object.values(memoryStore.activeRides || {}),
    });
  });

  app.get('/ride/available', (_req, res) => {
    return res.json({
      success: true,
      rides: memoryStore.availableRides || [],
      ride: memoryStore.availableRides?.[0] || null,
    });
  });

  app.get('/ride/history', (_req, res) => {
    return res.json({
      success: true,
      rides: memoryStore.rideHistory || [],
    });
  });

  app.get('/ride/:rideId', (req, res) => {
    const ride = getRide(req);

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

  app.post('/ride/request', (req, res) => {
    const nowMs = Date.now();
    const incomingRideId = rideKey(req.body.rideId || req.body.id || nowMs);

    const passengerId = String(
      req.body.passenger?.uid ||
        req.body.passenger?.id ||
        req.body.passengerId ||
        req.body.passengerPhone ||
        req.body.phone ||
        '',
    ).trim();

    const price = money(req.body.price || req.body.fare || req.body.total || 0);
    const passengerWallet = passengerId
      ? createPassengerWallet(passengerId)
      : null;

    if (!passengerId) {
      return res.status(400).json({
        success: false,
        message: 'Passageiro inválido para solicitar corrida.',
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor da corrida inválido.',
      });
    }

    if (money(passengerWallet?.balance || 0) < price) {
      return res.status(400).json({
        success: false,
        message: 'Saldo insuficiente. Adicione saldo para solicitar a corrida.',
        wallet: passengerWallet,
      });
    }

    const ride = {
      id: incomingRideId,
      rideId: incomingRideId,

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

      price,
      fare: money(req.body.fare || req.body.price || req.body.total || 0),
      total: money(req.body.total || req.body.price || req.body.fare || 0),

      distanceKm: Number(req.body.distanceKm || 0),
      distanceText: req.body.distanceText || '',
      eta: req.body.eta || '',

      rideType: req.body.rideType || 'Carro',
      paymentMethod: req.body.paymentMethod || 'wallet',
      platform: req.body.platform || 'passenger_app',

      requestedAt: req.body.requestedAt || now(),

      passenger: {
        uid: passengerId,
        id: passengerId,
        name:
          req.body.passenger?.name ||
          req.body.passengerName ||
          'Passageiro',
        fullName:
          req.body.passenger?.fullName ||
          req.body.passenger?.name ||
          req.body.passengerName ||
          'Passageiro',
        photo: req.body.passenger?.photo || req.body.passengerPhoto || '',
        email: req.body.passenger?.email || req.body.passengerEmail || '',
        phone: req.body.passenger?.phone || req.body.passengerPhone || '',
        rating: Number(req.body.passenger?.rating || 5),
      },

      passengerId,

      declinedDrivers: [],
      status: 'pending',
      avuxoFee: 0,

      createdAt: now(),
      updatedAt: now(),

      chat: [],
    };

    saveRide(ride);
    removeAvailableRide(ride.rideId);
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

    io.to('admin').emit('ride:available', {
      success: true,
      rideId: ride.rideId,
      ride,
    });

    io.to('admins').emit('ride:available', {
      success: true,
      rideId: ride.rideId,
      ride,
    });

    emitRideUpdate(io, ride, 'ride:requested');

    return res.json({
      success: true,
      message: 'Corrida solicitada com sucesso',
      rideId: ride.rideId,
      ride,
      wallet: passengerWallet,
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

    if (ride.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: 'Essa corrida não está mais disponível.',
        ride,
      });
    }

    const driverId = String(
      req.body.driverId || req.body.id || req.body.phone || '',
    ).trim();

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: 'Motorista inválido para aceitar corrida.',
      });
    }

    const driverWallet = createDriverWallet(
      driverId,
      req.body.fullName || req.body.name || 'Motorista AVUXO',
    );

    if (money(driverWallet.balance) < AVUXO_FEE_PER_FINISHED_RIDE) {
      return res.status(403).json({
        success: false,
        message:
          'Adicione saldo na carteira para começar a receber corridas.',
        wallet: driverWallet,
      });
    }

    ride.status = 'accepted';
    ride.acceptedAt = now();
    ride.updatedAt = now();

    ride.driver = {
      id: driverId,
      driverId,

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
      latitude: Number(req.body.lat || req.body.latitude || 0),
      longitude: Number(req.body.lng || req.body.longitude || 0),

      bearing: Number(req.body.bearing || 0),
      eta: req.body.eta || 'Chegando em instantes',

      updatedAt: now(),
    };

    ride.driverId = driverId;

    saveRide(ride);
    removeAvailableRide(ride.rideId || ride.id);

    emitRideUpdate(io, ride, 'ride:accepted');

    io.to('drivers').emit('ride:available:list', {
      success: true,
      rides: memoryStore.availableRides,
    });

    return res.json({
      success: true,
      message: 'Corrida aceita',
      rideId: ride.rideId || ride.id,
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

    if (ride.status !== 'pending') {
      return res.status(409).json({
        success: false,
        message: 'Essa corrida não pode mais ser recusada.',
        ride,
      });
    }

    const driverId = String(
      req.body.driverId ||
        req.body.id ||
        req.body.driver?.id ||
        'driver-avuxo',
    );

    if (!Array.isArray(ride.declinedDrivers)) {
      ride.declinedDrivers = [];
    }

    if (!ride.declinedDrivers.includes(driverId)) {
      ride.declinedDrivers.push(driverId);
    }

    ride.status = 'pending';
    ride.updatedAt = now();

    saveRide(ride);

    emitRideUpdate(io, ride, 'ride:declined');

    return res.json({
      success: true,
      message: 'Corrida recusada por este motorista',
      rideId: ride.rideId || ride.id,
      ride,
    });
  });

  app.post('/ride/arrived', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
    }

    if (ride.status !== 'accepted' && ride.status !== 'arriving') {
      return res.status(409).json({
        success: false,
        message: 'A corrida precisa estar aceita para marcar chegada.',
        ride,
      });
    }

    ride.status = 'arriving';
    ride.arrivedAt = now();
    ride.updatedAt = now();

    saveRide(ride);
    emitRideUpdate(io, ride, 'ride:arrived');

    return res.json({
      success: true,
      message: 'Motorista chegou ao passageiro',
      rideId: ride.rideId || ride.id,
      ride,
    });
  });

  app.post('/ride/start', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
    }

    if (ride.status !== 'accepted' && ride.status !== 'arriving') {
      return res.status(409).json({
        success: false,
        message: 'A corrida precisa estar aceita para iniciar.',
        ride,
      });
    }

    ride.status = 'in_progress';
    ride.startedAt = now();
    ride.updatedAt = now();

    saveRide(ride);
    emitRideUpdate(io, ride, 'ride:started');

    return res.json({
      success: true,
      message: 'Corrida iniciada',
      rideId: ride.rideId || ride.id,
      ride,
    });
  });

  app.post('/ride/finish', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma corrida ativa',
      });
    }

    if (ride.status !== 'in_progress' && ride.status !== 'arriving') {
      return res.status(409).json({
        success: false,
        message: 'A corrida precisa estar em andamento para finalizar.',
        ride,
      });
    }

    const walletResult = processFinishedRideWallet(ride);

    if (!walletResult.success) {
      return res.status(walletResult.status || 400).json({
        success: false,
        message: walletResult.message,
        ride,
        passengerWallet: walletResult.passengerWallet,
        driverWallet: walletResult.driverWallet,
      });
    }

    ride.status = 'finished';
    ride.finishedAt = now();
    ride.updatedAt = now();

    removeRideFromHistory(ride.rideId || ride.id);
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

    io.to('admin').emit('wallet:update', {
      success: true,
      passengerWallet: walletResult.passengerWallet,
      driverWallet: walletResult.driverWallet,
      transactions: walletResult.transactions,
    });

    io.to('admins').emit('wallet:update', {
      success: true,
      passengerWallet: walletResult.passengerWallet,
      driverWallet: walletResult.driverWallet,
      transactions: walletResult.transactions,
    });

    emitToRideRoom(io, ride.rideId || ride.id, 'wallet:update', {
      success: true,
      rideId: ride.rideId || ride.id,
      passengerWallet: walletResult.passengerWallet,
      driverWallet: walletResult.driverWallet,
      transactions: walletResult.transactions,
    });

    emitChatCleared(io, ride.rideId || ride.id);

    setTimeout(() => {
      emitRideCleared(io, ride.rideId || ride.id);
    }, 1200);

    return res.json({
      success: true,
      message: 'Corrida finalizada',
      rideId: ride.rideId || ride.id,
      ride,
      passengerWallet: walletResult.passengerWallet,
      driverWallet: walletResult.driverWallet,
      transactions: walletResult.transactions,
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
    ride.cancelledBy = req.body.cancelledBy || req.body.canceledBy || 'system';
    ride.canceledBy = req.body.canceledBy || req.body.cancelledBy || 'system';
    ride.cancelledAt = now();
    ride.updatedAt = now();

    removeRideFromHistory(ride.rideId || ride.id);
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

    return res.json({
      success: true,
      message: 'Corrida cancelada',
      rideId: ride.rideId || ride.id,
      ride,
    });
  });

  app.get('/chat/current', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.json({
        success: true,
        rideId: getRequestedRideId(req),
        messages: [],
        chat: [],
      });
    }

    if (!Array.isArray(ride.chat)) {
      ride.chat = [];
    }

    return res.json({
      success: true,
      rideId: ride.rideId || ride.id,
      messages: ride.chat,
      chat: ride.chat,
    });
  });

  app.post('/chat/send', (req, res) => {
    const ride = getRide(req) as any;

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Corrida não encontrada para enviar mensagem.',
      });
    }

    if (!Array.isArray(ride.chat)) {
      ride.chat = [];
    }

    const text = String(req.body.text || req.body.message || '').trim();

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem vazia.',
      });
    }

    const sender = req.body.sender || req.body.from || req.body.role || 'system';

    const message = {
      id: Date.now(),
      rideId: ride.rideId || ride.id,
      sender,
      from: sender,
      role: sender,
      message: text,
      text,
      createdAt: req.body.createdAt || now(),
    };

    ride.chat.push(message);
    ride.updatedAt = now();

    saveRide(ride);
    emitChatUpdate(io, ride);

    return res.json({
      success: true,
      rideId: ride.rideId || ride.id,
      message,
      messages: ride.chat,
      chat: ride.chat,
    });
  });

  app.post('/ride/review', (req, res) => {
    const store = ensureStore();

    const rideId = rideKey(req.body.rideId || req.body.id);

    const review = {
      id: Date.now(),
      rideId: rideId || null,
      rating: Number(req.body.rating || 5),
      comment: req.body.comment || '',
      from: 'passenger',
      to: 'driver',
      createdAt: now(),
    };

    store.rideReviews.unshift(review);

    if (rideId) {
      const ride =
        (memoryStore.activeRides as any)[rideId] ||
        memoryStore.rideHistory.find(
          (item: any) => String(item.rideId || item.id) === rideId,
        );

      if (ride) {
        ride.review = review;
      }
    }

    io.to('admin').emit('ride:reviewed', {
      success: true,
      review,
    });

    io.to('admins').emit('ride:reviewed', {
      success: true,
      review,
    });

    return res.json({
      success: true,
      message: 'Avaliação enviada com sucesso',
      review,
    });
  });

  app.post('/ride/driver-review', (req, res) => {
    const store = ensureStore();

    const rideId = rideKey(req.body.rideId || req.body.id);

    const review = {
      id: Date.now(),
      rideId: rideId || null,
      rating: Number(req.body.rating || 5),
      comment: req.body.comment || '',
      from: 'driver',
      to: 'passenger',
      createdAt: now(),
    };

    store.driverReviews.unshift(review);

    io.to('admin').emit('ride:driver-reviewed', {
      success: true,
      review,
    });

    io.to('admins').emit('ride:driver-reviewed', {
      success: true,
      review,
    });

    return res.json({
      success: true,
      message: 'Avaliação do passageiro enviada com sucesso',
      review,
    });
  });
}