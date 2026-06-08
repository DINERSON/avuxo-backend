import { Server } from 'socket.io';

import { memoryStore } from '../storage/memory.store';

export let globalIO: Server;

const chatMessages: any[] = [];

function emitChat(io: Server) {
  io.emit('chat:updated', {
    success: true,
    messages: chatMessages,
    chat: chatMessages,
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

      socket.emit('ride:current', {
        success: true,
        ride: memoryStore.currentRide || null,
      });
    });

    socket.on('driver:offline', (data) => {
      console.log('🔴 Driver offline:', data);
      socket.leave('drivers');
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

    socket.on('ride:get-current', () => {
      socket.emit('ride:current', {
        success: true,
        ride: memoryStore.currentRide || null,
      });
    });

    socket.on('driver:location', (data) => {
      const ride = memoryStore.currentRide as any;

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

      io.emit('driver:location', {
        success: true,
        driver: ride?.driver || data,
        ride,
      });

      io.emit('ride:tracking', {
        success: true,
        driver: ride?.driver || data,
        ride,
      });
    });

    socket.on('chat:get', () => {
      socket.emit('chat:updated', {
        success: true,
        messages: chatMessages,
        chat: chatMessages,
      });
    });

    socket.on('chat:send', (message) => {
      const text = String(message?.message ?? message?.text ?? '').trim();

      if (!text) return;

      const sender = String(
        message?.sender ??
          message?.from ??
          message?.role ??
          'passenger',
      );

      const msg = {
        id: Date.now(),
        sender,
        from: sender,
        role: sender,
        message: text,
        text,
        createdAt: message?.createdAt ?? new Date().toISOString(),
      };

      chatMessages.push(msg);
      emitChat(io);
    });

    socket.on('chat:message', (message) => {
      const text = String(message?.message ?? message?.text ?? '').trim();

      if (!text) return;

      const sender = String(
        message?.sender ??
          message?.from ??
          message?.role ??
          'passenger',
      );

      const msg = {
        id: Date.now(),
        sender,
        from: sender,
        role: sender,
        message: text,
        text,
        createdAt: message?.createdAt ?? new Date().toISOString(),
      };

      chatMessages.push(msg);
      emitChat(io);
    });

    socket.on('chat:clear', () => {
      chatMessages.length = 0;
      emitChat(io);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔴 Socket desconectado:', socket.id, reason);
    });
  });
}