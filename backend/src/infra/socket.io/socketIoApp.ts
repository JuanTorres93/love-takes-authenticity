import { createServer } from 'http';
import { Server } from 'socket.io';

type HttpServer = ReturnType<typeof createServer>;

export function createSocketIoApp(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
