import { createServer } from 'http';
import { Server } from 'socket.io';

import { SendMessageUsecaseRequest } from '../../application-layer/use-cases/SendMessageUsecase/SendMessageUsecase';
import { AppSendMessageUsecase } from '../../interface-adapters/use-cases/AppSendMessageUsecase';

type HttpServer = ReturnType<typeof createServer>;

export function createSocketIoApp(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    connectionStateRecovery: {},
  });

  io.on('connection', (socket) => {
    socket.on('sendMessage', async (request: SendMessageUsecaseRequest) => {
      const message = await AppSendMessageUsecase.execute(request);

      socket.emit('message', message.content);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
