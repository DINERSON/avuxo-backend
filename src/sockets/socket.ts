import { Server } from 'socket.io';

export let globalIO: Server;

const chatMessages: any[] = [];

export function registerSocket(io: Server) {
  globalIO = io;

  io.on('connection', (socket) => {
    console.log('🟢 Socket conectado:', socket.id);

    socket.emit('server:ready', {
      success: true,
      message: 'AVUXO realtime conectado',
    });

    socket.on('join:admin', () => {
      socket.join('admin-room');
      console.log('👑 Admin conectado realtime');
    });

    socket.on('join:driver', (driverId) => {
      const safeDriverId = driverId || 'driver-avuxo';

      socket.join('drivers');
      socket.join('driver-' + safeDriverId);

      console.log('🚗 Driver conectado:', safeDriverId);
      console.log('📡 Driver entrou na sala drivers');
    });

    socket.on('driver:join', (driverId) => {
      const safeDriverId = driverId || 'driver-avuxo';

      socket.join('drivers');
      socket.join('driver-' + safeDriverId);

      console.log('🚗 Driver conectado:', safeDriverId);
      console.log('📡 Driver entrou na sala drivers');
    });

    socket.on('driver:online', (data) => {
      console.log('🟢 Driver online:', data);

      socket.join('drivers');
    });

    socket.on('driver:offline', (data) => {
      console.log('🔴 Driver offline:', data);

      socket.leave('drivers');
    });

    socket.on('join:passenger', (passengerId) => {
      const safePassengerId = passengerId || 'passenger-avuxo';

      socket.join('passengers');
      socket.join('passenger-' + safePassengerId);

      console.log('🧍 Passageiro conectado:', safePassengerId);
    });

    socket.on('passenger:join', (passengerId) => {
      const safePassengerId = passengerId || 'passenger-avuxo';

      socket.join('passengers');
      socket.join('passenger-' + safePassengerId);

      console.log('🧍 Passageiro conectado:', safePassengerId);
    });

    socket.on('chat:get', () => {
      socket.emit('chat:updated', {
        success: true,
        messages: chatMessages,
        chat: chatMessages,
      });
    });

    socket.on('chat:send', (message) => {
      const text = String(
        message?.message ?? message?.text ?? '',
      ).trim();

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
        createdAt:
          message?.createdAt ??
          new Date().toISOString(),
      };

      chatMessages.push(msg);

      io.emit('chat:updated', {
        success: true,
        messages: chatMessages,
        chat: chatMessages,
      });
    });

    socket.on('chat:message', (message) => {
      const text = String(
        message?.message ?? message?.text ?? '',
      ).trim();

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
        createdAt:
          message?.createdAt ??
          new Date().toISOString(),
      };

      chatMessages.push(msg);

      io.emit('chat:updated', {
        success: true,
        messages: chatMessages,
        chat: chatMessages,
      });
    });

    socket.on('chat:clear', () => {
      chatMessages.length = 0;

      io.emit('chat:updated', {
        success: true,
        messages: [],
        chat: [],
      });
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket desconectado:', socket.id);
    });
  });
}