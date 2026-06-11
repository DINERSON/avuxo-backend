import { Server } from 'socket.io';

import { memoryStore } from '../storage/memory.store';

export let globalIO: Server;

const chatMessagesByRide: Record<string, any[]> = {};

function getRideById(rideId: any) {
  const safeRideId = String(rideId || '');

  if (!safeRideId) return null;

  return (
    (memoryStore.activeRides as any)?.[safeRideId] ||
    memoryStore.ridesDatabase.find(
      (ride: any) => String(ride.rideId || ride.id) === safeRideId,
    ) ||
    null
  );
}

function getChatList(rideId: any) {
  const safeRideId = String(rideId || 'global');

  if (!chatMessagesByRide[safeRideId]) {
    chatMessagesByRide[safeRideId] = [];
  }

  return chatMessagesByRide[safeRideId];
}

function emitChat(io: Server, rideId: any) {
  const safeRideId = String(rideId || 'global');
  const messages = getChatList(safeRideId);

  io.to(`ride-${safeRideId}`).emit('chat:updated', {
    success: true,
    rideId: safeRideId,
    messages,
    chat: messages,
  });

  io.emit('chat:updated', {
    success: true,
    rideId: safeRideId,
    messages,
    chat: messages,
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

    socket.emit('ride:current', {
      success: true,
      ride: memoryStore.currentRide || null,
    });

    socket.on('join:admin', () => {
      socket.join('admin-room');
      console.log('👑 Admin conectado realtime');
    });

    socket.on('join:ride', (rideId) => {
      const safeRideId = String(rideId || '');

      if (!safeRideId) return;

      socket.join(`ride-${safeRideId}`);

      const ride = getRideById(safeRideId);

      socket.emit('ride:current', {
        success: true,
        rideId: safeRideId,
        ride,
      });

      socket.emit('chat:updated', {
        success: true,
        rideId: safeRideId,
        messages: getChatList(safeRideId),
        chat: getChatList(safeRideId),
      });

      console.log('🚖 Socket entrou na corrida:', safeRideId);
    });

    socket.on('ride:join', (rideId) => {
      const safeRideId = String(rideId || '');

      if (!safeRideId) return;

      socket.join(`ride-${safeRideId}`);

      const ride = getRideById(safeRideId);

      socket.emit('ride:current', {
        success: true,
        rideId: safeRideId,
        ride,
      });

      socket.emit('chat:updated', {
        success: true,
        rideId: safeRideId,
        messages: getChatList(safeRideId),
        chat: getChatList(safeRideId),
      });

      console.log('🚖 Socket entrou na corrida:', safeRideId);
    });

    socket.on('join:driver', (driverId) => {
      const safeDriverId = driverId || 'driver-avuxo';

      socket.join('drivers');
      socket.join(`driver-${safeDriverId}`);

      console.log('🚗 Driver conectado:', safeDriverId);
    });

    socket.on('driver:join', (driverId) => {
      const safeDriverId = driverId || 'driver-avuxo';

      socket.join('drivers');
      socket.join(`driver-${safeDriverId}`);

      console.log('🚗 Driver conectado:', safeDriverId);
    });

    socket.on('driver:online', (data) => {
      const driverId = data?.driverId || 'driver-avuxo';

      socket.join('drivers');
      socket.join(`driver-${driverId}`);

      console.log('🟢 Driver online:', driverId);

      socket.emit('ride:available:list', {
        success: true,
        rides: memoryStore.availableRides || [],
      });

      socket.emit('ride:current', {
        success: true,
        ride: memoryStore.currentRide || null,
      });
    });

    socket.on('driver:offline', (data) => {
      const driverId = data?.driverId || 'driver-avuxo';

      console.log('🔴 Driver offline:', data);

      socket.leave('drivers');
      socket.leave(`driver-${driverId}`);
    });

    socket.on('join:passenger', (passengerId) => {
      const safePassengerId = passengerId || 'passenger-avuxo';

      socket.join('passengers');
      socket.join(`passenger-${safePassengerId}`);

      console.log('🧍 Passageiro conectado:', safePassengerId);
    });

    socket.on('passenger:join', (passengerId) => {
      const safePassengerId = passengerId || 'passenger-avuxo';

      socket.join('passengers');
      socket.join(`passenger-${safePassengerId}`);

      console.log('🧍 Passageiro conectado:', safePassengerId);

      socket.emit('ride:current', {
        success: true,
        ride: memoryStore.currentRide || null,
      });
    });

    socket.on('ride:get-current', (data) => {
      const rideId = data?.rideId || data;

      if (rideId) {
        const ride = getRideById(rideId);

        socket.join(`ride-${rideId}`);

        socket.emit('ride:current', {
          success: true,
          rideId,
          ride,
        });

        return;
      }

      socket.emit('ride:current', {
        success: true,
        ride: memoryStore.currentRide || null,
      });
    });

    socket.on('driver:location', (data) => {
      const rideId = String(data?.rideId || data?.ride?.rideId || '');

      const ride = rideId ? (getRideById(rideId) as any) : memoryStore.currentRide as any;

      if (ride) {
        ride.driver = {
          ...(ride.driver || {}),
          lat: Number(data?.lat ?? data?.latitude ?? ride.driver?.lat ?? 0),
          lng: Number(data?.lng ?? data?.longitude ?? ride.driver?.lng ?? 0),
          bearing: Number(data?.bearing ?? ride.driver?.bearing ?? 0),
          updatedAt: new Date().toISOString(),
        };

        ride.updatedAt = new Date().toISOString();
      }

      const payload = {
        success: true,
        rideId: rideId || ride?.rideId || ride?.id || null,
        driver: ride?.driver || data,
        ride,
      };

      if (payload.rideId) {
        io.to(`ride-${payload.rideId}`).emit('driver:location', payload);
        io.to(`ride-${payload.rideId}`).emit('ride:tracking', payload);
      }

      io.emit('driver:location', payload);
      io.emit('ride:tracking', payload);
    });

    socket.on('chat:get', (data) => {
      const rideId = data?.rideId || data || 'global';

      socket.emit('chat:updated', {
        success: true,
        rideId,
        messages: getChatList(rideId),
        chat: getChatList(rideId),
      });
    });

    socket.on('chat:send', (message) => {
      const text = String(message?.message ?? message?.text ?? '').trim();

      if (!text) return;

      const rideId = String(message?.rideId || 'global');

      const sender = String(
        message?.sender ??
          message?.from ??
          message?.role ??
          'passenger',
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

      getChatList(rideId).push(msg);

      const ride = getRideById(rideId) as any;

      if (ride) {
        if (!Array.isArray(ride.chat)) {
          ride.chat = [];
        }

        ride.chat.push(msg);
        ride.updatedAt = new Date().toISOString();
      }

      emitChat(io, rideId);
    });

    socket.on('chat:message', (message) => {
      const text = String(message?.message ?? message?.text ?? '').trim();

      if (!text) return;

      const rideId = String(message?.rideId || 'global');

      const sender = String(
        message?.sender ??
          message?.from ??
          message?.role ??
          'passenger',
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

      getChatList(rideId).push(msg);

      const ride = getRideById(rideId) as any;

      if (ride) {
        if (!Array.isArray(ride.chat)) {
          ride.chat = [];
        }

        ride.chat.push(msg);
        ride.updatedAt = new Date().toISOString();
      }

      emitChat(io, rideId);
    });

    socket.on('chat:clear', (data) => {
      const rideId = String(data?.rideId || data || 'global');

      chatMessagesByRide[rideId] = [];

      const ride = getRideById(rideId) as any;

      if (ride) {
        ride.chat = [];
        ride.updatedAt = new Date().toISOString();
      }

      emitChat(io, rideId);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔴 Socket desconectado:', socket.id, reason);
    });
  });
}