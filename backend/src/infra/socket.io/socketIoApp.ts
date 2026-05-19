import { createServer } from 'http';
import { Server } from 'socket.io';

import { SendMessageUsecaseRequest } from '../../application-layer/use-cases/SendMessageUsecase/SendMessageUsecase';
import { AppSendMessageUsecase } from '../../interface-adapters/use-cases/AppSendMessageUsecase';
import { SocketResponseData } from './common/SocketResponseData';
import { handleSocketIoErrors } from './common/handleSocketIoErrors';

type HttpServer = ReturnType<typeof createServer>;

export function createSocketIoApp(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    connectionStateRecovery: {},
  });

  io.on('connection', (socket) => {
    socket.on('sendMessage', async (request: SendMessageUsecaseRequest) => {
      try {
        const sentMessage = await AppSendMessageUsecase.execute(request);

        const response: SocketResponseData<string> = {
          status: 'success',
          data: sentMessage.content,
        };

        socket.emit('getMessage', response);
      } catch (error) {
        handleSocketIoErrors(socket, 'getMessage', error as Error);
      }
    });
  });

  return io;
}
