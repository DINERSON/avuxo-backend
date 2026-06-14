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
  const id = rideKey(rideId) || 'global';

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
  const id = rideKey(rideId) || 'global';
  const messages = getChatList(id);

  const payload = {
    success: true,
    rideId: id,
    messages,
    chat: messages,
  };

  io.to(`ride-${id}`).emit('chat:updated', payload);
  io.to(`ride-${id}`).emit('chat:update', payload);
  io.to(`ride-${id}`).emit('chat:message', payload);

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
  const id = rideKey(rideId) || 'global';

  socket.emit('chat:updated', {
    success: true,
    rideId: id,
    messages: getChatList(id),
    chat: getChatList(id),
  });
}

export function registerSocket(io: Server) {
  globalIO = io;

  io.on('connection', (socket) => {
    console.log('🟢 Socket conectado:', socket.id);

    socket.emit('server:ready', {
      success: true,
      message: 'AVUXO realtime conectado',
    });

    emitRideCurrent(socket);

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
      const driverId =
        typeof data === 'object'
          ? data?.driverId || data?.id || 'driver-avuxo'
          : data || 'driver-avuxo';

      socket.join('drivers');
      socket.join(`driver-${driverId}`);

      console.log('🚗 Driver conectado:', driverId);
    });

    socket.on('driver:join', (data) => {
      const driverId =
        typeof data === 'object'
          ? data?.driverId || data?.id || 'driver-avuxo'
          : data || 'driver-avuxo';

      socket.join('drivers');
      socket.join(`driver-${driverId}`);

      console.log('🚗 Driver conectado:', driverId);
    });

    socket.on('driver:online', (data) => {
      const driverId = data?.driverId || data?.id || 'driver-avuxo';

      socket.join('drivers');
      socket.join(`driver-${driverId}`);

      console.log('🟢 Driver online:', driverId);

      socket.emit('ride:available:list', {
        success: true,
        rides: memoryStore.availableRides || [],
      });

      emitRideCurrent(socket);
    });

    socket.on('driver:offline', (data) => {
      const driverId = data?.driverId || data?.id || 'driver-avuxo';

      console.log('🔴 Driver offline:', driverId);

      socket.leave('drivers');
      socket.leave(`driver-${driverId}`);
    });

    socket.on('join:passenger', (data) => {
      const passengerId =
        typeof data === 'object'
          ? data?.passengerId || data?.uid || data?.id || 'passenger-avuxo'
          : data || 'passenger-avuxo';

      socket.join('passengers');
      socket.join(`passenger-${passengerId}`);

      console.log('🧍 Passageiro conectado:', passengerId);
    });

    socket.on('passenger:join', (data) => {
      const passengerId =
        typeof data === 'object'
          ? data?.passengerId || data?.uid || data?.id || 'passenger-avuxo'
          : data || 'passenger-avuxo';

      socket.join('passengers');
      socket.join(`passenger-${passengerId}`);

      console.log('🧍 Passageiro conectado:', passengerId);

      emitRideCurrent(socket);
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
      const ride = getCurrentRide(rideId) as any;

      if (ride) {
        ride.driver = {
          ...(ride.driver || {}),
          id: data?.driverId || ride.driver?.id || ride.driverId || 'driver-avuxo',
          driverId:
            data?.driverId ||
            ride.driver?.driverId ||
            ride.driverId ||
            'driver-avuxo',
          lat: Number(data?.lat ?? data?.latitude ?? ride.driver?.lat ?? 0),
          lng: Number(data?.lng ?? data?.longitude ?? ride.driver?.lng ?? 0),
          latitude: Number(data?.lat ?? data?.latitude ?? ride.driver?.lat ?? 0),
          longitude: Number(data?.lng ?? data?.longitude ?? ride.driver?.lng ?? 0),
          bearing: Number(data?.bearing ?? ride.driver?.bearing ?? 0),
          updatedAt: new Date().toISOString(),
        };

        ride.updatedAt = new Date().toISOString();

        if (ride.rideId || ride.id) {
          (memoryStore.activeRides as any)[String(ride.rideId || ride.id)] = ride;
        }
      }

      const finalRideId = rideKey(rideId || ride?.rideId || ride?.id);

      const payload = {
        success: true,
        rideId: finalRideId || null,
        driverId: data?.driverId || ride?.driverId || 'driver-avuxo',
        lat: Number(data?.lat ?? data?.latitude ?? 0),
        lng: Number(data?.lng ?? data?.longitude ?? 0),
        latitude: Number(data?.lat ?? data?.latitude ?? 0),
        longitude: Number(data?.lng ?? data?.longitude ?? 0),
        bearing: Number(data?.bearing ?? 0),
        updatedAt: new Date().toISOString(),
        driver: ride?.driver || data,
        ride,
      };

      if (finalRideId) {
        io.to(`ride-${finalRideId}`).emit('driver:location', payload);
        io.to(`ride-${finalRideId}`).emit('ride:tracking', payload);
        io.to(`ride-${finalRideId}`).emit('ride:update', {
          success: true,
          rideId: finalRideId,
          ride,
        });
      }
    });

    socket.on('chat:get', (data) => {
      const rideId = rideKey(data) || 'global';

      if (rideId !== 'global') {
        socket.join(`ride-${rideId}`);
      }

      emitChatCurrent(socket, rideId);
    });

    socket.on('chat:send', (message) => {
      const text = String(message?.message ?? message?.text ?? '').trim();

      if (!text) return;

      const rideId = rideKey(message?.rideId) || 'global';

      if (rideId !== 'global') {
        socket.join(`ride-${rideId}`);
      }

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

    socket.on('chat:message', (message) => {
      const text = String(message?.message ?? message?.text ?? '').trim();

      if (!text) return;

      const rideId = rideKey(message?.rideId) || 'global';

      if (rideId !== 'global') {
        socket.join(`ride-${rideId}`);
      }

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
      const rideId = rideKey(data) || 'global';

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
      console.log('🔴 Socket desconectado:', socket.id, reason);
    });
  });
}