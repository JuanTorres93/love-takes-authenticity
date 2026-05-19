import { createServer } from 'http';
import { SOCKET_EVENTS } from 'shared';
import { Server } from 'socket.io';

import { SendMessageUsecaseRequest } from '../../application-layer/use-cases/SendMessageUsecase/SendMessageUsecase';
import { AppSendMessageUsecase } from '../../interface-adapters/use-cases/AppSendMessageUsecase';
import { SocketResponseData } from './common/SocketResponseData';
import { handleSocketIoErrors } from './common/handleSocketIoErrors';

type HttpServer = ReturnType<typeof createServer>;

const { SEND_MESSAGE, GET_MESSAGE } = SOCKET_EVENTS;

export function createSocketIoApp(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    connectionStateRecovery: {},
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on(SEND_MESSAGE, async (request: SendMessageUsecaseRequest) => {
      try {
        const sentMessage = await AppSendMessageUsecase.execute(request);

        const response: SocketResponseData<string> = {
          status: 'success',
          data: sentMessage.content,
        };

        socket.emit(GET_MESSAGE, response);
      } catch (error) {
        handleSocketIoErrors(socket, GET_MESSAGE, error as Error);
      }
    });
  });

  return io;
}
