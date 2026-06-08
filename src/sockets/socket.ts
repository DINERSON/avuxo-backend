import { Server } from 'socket.io';

export let globalIO: Server;

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
      socket.join('drivers');
      socket.join('driver-' + driverId);

      console.log('🚗 Driver conectado:', driverId);
      console.log('📡 Driver entrou na sala drivers');
    });

    socket.on('driver:online', (data) => {
      console.log('🟢 Driver online:', data);
    });

    socket.on('driver:offline', (data) => {
      console.log('🔴 Driver offline:', data);
      socket.leave('drivers');
    });

    socket.on('join:passenger', (passengerId) => {
      socket.join('passenger-' + passengerId);
      console.log('🧍 Passageiro conectado:', passengerId);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket desconectado:', socket.id);
    });
  });
}