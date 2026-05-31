import { Server } from 'socket.io';

export let globalIO: Server;

export function registerSocket(io: Server) {

  globalIO = io;

  io.on('connection', (socket) => {

    console.log(
      '🟢 Socket conectado:',
      socket.id,
    );

    socket.emit('server:ready', {
      success: true,
      message: 'AVUXO realtime conectado',
    });

    socket.on('join:admin', () => {

      socket.join('admin-room');

      console.log(
        '👑 Admin conectado realtime',
      );

    });

    socket.on('join:driver', (driverId) => {

      socket.join(
        'driver-' + driverId,
      );

      console.log(
        '🚗 Driver conectado:',
        driverId,
      );

    });

    socket.on('join:passenger', (passengerId) => {

      socket.join(
        'passenger-' + passengerId,
      );

      console.log(
        '🧍 Passageiro conectado:',
        passengerId,
      );

    });

    socket.on('disconnect', () => {

      console.log(
        '🔴 Socket desconectado:',
        socket.id,
      );

    });

  });

}