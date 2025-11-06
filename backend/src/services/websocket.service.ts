import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initializeWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['polling', 'websocket']
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('authenticate', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log('🔐 User authenticated:', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  return io;
};

export const notifyUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const notifyAll = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};
