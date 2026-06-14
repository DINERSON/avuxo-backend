import { Server } from 'socket.io';

import { memoryStore } from '../storage/memory.store';

export let globalIO: Server;

const chatMessagesByRide: Record<string, any[]> = {};

function rideKey(value: any) {
  if (value && typeof value === 'object') {
    return String(value.rideId || value.id || '').trim();
  }

  return String(value || '').trim();
}

function getRideById(rideId: any) {
  const id = rideKey(rideId);

  if (!id) return null;

  return (
    (memoryStore.activeRides as any)?.[id] ||
    memoryStore.ridesDatabase?.find(
      (ride: any) => String(ride.rideId || ride.id) === id,
    ) ||
    null
  );
}

function getCurrentRide(rideId?: any) {
  const id = rideKey(rideId);

  if (id) {
    return getRideById(id);
  }

  return memoryStore.currentRide || null;
}

function getChatList(rideId: any) {
  const id = rideKey(rideId);

  if (!id) {
    return [];
  }

  const ride = getRideById(id) as any;

  if (ride) {
    if (!Array.isArray(ride.chat)) {
      ride.chat = [];
    }

    return ride.chat;
  }

  if (!chatMessagesByRide[id]) {
    chatMessagesByRide[id] = [];
  }

  return chatMessagesByRide[id];
}

function emitChat(io: Server, rideId: any) {
  const id = rideKey(rideId);

  if (!id) return;

  const messages = getChatList(id);

  const payload = {
    success: true,
    rideId: id,
    messages,
    chat: messages,
  };

  io.to(`ride-${id}`).emit('chat:updated', payload);
  io.to('admin').emit('chat:updated', payload);
  io.to('admins').emit('chat:updated', payload);
}

function joinRideRoom(socket: any, data: any) {
  const rideId = rideKey(data);

  if (!rideId) return null;

  socket.join(`ride-${rideId}`);

  return rideId;
}

function emitRideCurrent(socket: any, rideId?: any) {
  const id = rideKey(rideId);
  const ride = getCurrentRide(id);

  socket.emit('ride:current', {
    success: true,
    rideId: id || ride?.rideId || ride?.id || null,
    ride,
  });
}

function emitChatCurrent(socket: any, rideId?: any) {
  const id = rideKey(rideId);

  if (!id) {
    socket.emit('chat:updated', {
      success: true,
      rideId: null,
      messages: [],
      chat: [],
    });
    return;
  }

  socket.emit('chat:updated', {
    success: true,
    rideId: id,
    messages: getChatList(id),
    chat: getChatList(id),
  });
}

function getDriverId(data: any) {
  if (data && typeof data === 'object') {
    return String(data.driverId || data.id || '').trim();
  }

  return String(data || '').trim();
}

function getPassengerId(data: any) {
  if (data && typeof data === 'object') {
    return String(data.passengerId || data.uid || data.id || '').trim();
  }

  return String(data || '').trim();
}

export function registerSocket(io: Server) {
  globalIO = io;

  io.on('connection', (socket) => {
    console.log('🟢 Socket conectado:', socket.id);

    socket.emit('server:ready', {
      success: true,
      message: 'AVUXO realtime conectado',
    });

    socket.on('join:admin', () => {
      socket.join('admin');
      socket.join('admins');
      socket.join('admin-room');

      console.log('👑 Admin conectado realtime');
    });

    socket.on('admin:join', () => {
      socket.join('admin');
      socket.join('admins');
      socket.join('admin-room');

      console.log('👑 Admin conectado realtime');
    });

    socket.on('join:ride', (data) => {
      const rideId = joinRideRoom(socket, data);

      if (!rideId) return;

      emitRideCurrent(socket, rideId);
      emitChatCurrent(socket, rideId);

      console.log('🚖 Socket entrou na sala:', `ride-${rideId}`);
    });

    socket.on('ride:join', (data) => {
      const rideId = joinRideRoom(socket, data);

      if (!rideId) return;

      emitRideCurrent(socket, rideId);
      emitChatCurrent(socket, rideId);

      console.log('🚖 Socket entrou na sala:', `ride-${rideId}`);
    });

    socket.on('join:driver', (data) => {
      const driverId = getDriverId(data);

      if (!driverId) return;

      socket.join(`driver-${driverId}`);

      console.log('🚗 Driver conectado:', driverId);
    });

    socket.on('driver:join', (data) => {
      const driverId = getDriverId(data);

      if (!driverId) return;

      socket.join(`driver-${driverId}`);

      console.log('🚗 Driver conectado:', driverId);
    });

    socket.on('driver:online', (data) => {
      const driverId = getDriverId(data);

      if (!driverId) return;

      socket.data.driverId = driverId;
      socket.data.driverOnline = true;

      socket.join('drivers');
      socket.join(`driver-${driverId}`);

      const driver = memoryStore.driversDatabase?.find(
        (item: any) => String(item.id) === String(driverId),
      );

      if (driver) {
        driver.online = true;
      }

      console.log('🟢 Driver online:', driverId);

      socket.emit('ride:available:list', {
        success: true,
        rides: memoryStore.availableRides || [],
      });
    });

    socket.on('driver:offline', (data) => {
      const driverId = getDriverId(data) || socket.data.driverId;

      if (driverId) {
        const driver = memoryStore.driversDatabase?.find(
          (item: any) => String(item.id) === String(driverId),
        );

        if (driver) {
          driver.online = false;
        }

        socket.leave(`driver-${driverId}`);
      }

      socket.data.driverOnline = false;
      socket.leave('drivers');

      console.log('🔴 Driver offline:', driverId || socket.id);
    });

    socket.on('join:passenger', (data) => {
      const passengerId = getPassengerId(data);

      if (!passengerId) return;

      socket.join('passengers');
      socket.join(`passenger-${passengerId}`);

      console.log('🧍 Passageiro conectado:', passengerId);
    });

    socket.on('passenger:join', (data) => {
      const passengerId = getPassengerId(data);

      if (!passengerId) return;

      socket.join('passengers');
      socket.join(`passenger-${passengerId}`);

      console.log('🧍 Passageiro conectado:', passengerId);
    });

    socket.on('ride:get-current', (data) => {
      const rideId = rideKey(data);

      if (rideId) {
        socket.join(`ride-${rideId}`);
      }

      emitRideCurrent(socket, rideId);
    });

    socket.on('driver:location', (data) => {
      const rideId = rideKey(data?.rideId || data?.ride?.rideId);

      if (!rideId) return;

      const ride = getRideById(rideId) as any;

      if (!ride) return;

      const driverId =
        data?.driverId ||
        ride.driver?.driverId ||
        ride.driver?.id ||
        ride.driverId ||
        socket.data.driverId ||
        '';

      const lat = Number(data?.lat ?? data?.latitude ?? 0);
      const lng = Number(data?.lng ?? data?.longitude ?? 0);

      if (!lat || !lng) return;

      ride.driver = {
        ...(ride.driver || {}),
        id: driverId,
        driverId,
        lat,
        lng,
        latitude: lat,
        longitude: lng,
        bearing: Number(data?.bearing ?? ride.driver?.bearing ?? 0),
        updatedAt: new Date().toISOString(),
      };

      ride.driverId = driverId;
      ride.updatedAt = new Date().toISOString();

      (memoryStore.activeRides as any)[String(ride.rideId || ride.id)] = ride;

      const payload = {
        success: true,
        rideId,
        driverId,
        lat,
        lng,
        latitude: lat,
        longitude: lng,
        bearing: ride.driver.bearing,
        updatedAt: ride.driver.updatedAt,
        driver: ride.driver,
        ride,
      };

      io.to(`ride-${rideId}`).emit('driver:location', payload);
      io.to(`ride-${rideId}`).emit('ride:tracking', payload);
    });

    socket.on('chat:get', (data) => {
      const rideId = rideKey(data);

      if (!rideId) {
        socket.emit('chat:updated', {
          success: true,
          rideId: null,
          messages: [],
          chat: [],
        });
        return;
      }

      socket.join(`ride-${rideId}`);
      emitChatCurrent(socket, rideId);
    });

    socket.on('chat:send', (message) => {
      const text = String(message?.message ?? message?.text ?? '').trim();
      const rideId = rideKey(message?.rideId);

      if (!text || !rideId) return;

      socket.join(`ride-${rideId}`);

      const sender = String(
        message?.sender ?? message?.from ?? message?.role ?? 'passenger',
      );

      const msg = {
        id: Date.now(),
        rideId,
        sender,
        from: sender,
        role: sender,
        message: text,
        text,
        createdAt: message?.createdAt ?? new Date().toISOString(),
      };

      const chat = getChatList(rideId);
      chat.push(msg);

      const ride = getRideById(rideId) as any;

      if (ride) {
        ride.chat = chat;
        ride.updatedAt = new Date().toISOString();
        (memoryStore.activeRides as any)[String(ride.rideId || ride.id)] = ride;
      }

      emitChat(io, rideId);
    });

    socket.on('chat:clear', (data) => {
      const rideId = rideKey(data);

      if (!rideId) return;

      chatMessagesByRide[rideId] = [];

      const ride = getRideById(rideId) as any;

      if (ride) {
        ride.chat = [];
        ride.updatedAt = new Date().toISOString();
        (memoryStore.activeRides as any)[String(ride.rideId || ride.id)] = ride;
      }

      emitChat(io, rideId);
    });

    socket.on('disconnect', (reason) => {
      const driverId = socket.data.driverId;

      if (driverId) {
        const driver = memoryStore.driversDatabase?.find(
          (item: any) => String(item.id) === String(driverId),
        );

        if (driver) {
          driver.online = false;
        }
      }

      socket.leave('drivers');

      console.log('🔴 Socket desconectado:', socket.id, reason);
    });
  });
}