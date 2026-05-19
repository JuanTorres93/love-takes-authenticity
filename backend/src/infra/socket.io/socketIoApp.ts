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
      try {
        const message = await AppSendMessageUsecase.execute(request);

        const response: SocketEmitData<string> = {
          status: 'success',
          data: message.content,
        };
        socket.emit('message', response);
      } catch (error) {
        const response: SocketEmitData<string> = {
          status: 'error',
          data: (error as Error).message,
        };

        socket.emit('message', response);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

type SocketEmitData<T> = {
  status: 'success' | 'error';
  data: T;
};
