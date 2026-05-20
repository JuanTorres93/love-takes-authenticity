import dotenv from 'dotenv';
import { ConversationDTO, MessageDTO, SocketResponseData, UserDTO } from 'shared';
import { SOCKET_EVENTS } from 'shared';
import { io } from 'socket.io-client';

import { BackendService } from '../../../application-layer/services/BackendService.port';

const { SEND_MESSAGE, GET_MESSAGE } = SOCKET_EVENTS;

dotenv.config();

export class ApplicationBackendService implements BackendService {
  private serverUrl: string;
  private socket: ReturnType<typeof io> | null = null;

  constructor() {
    const envServerUrl = process.env.SERVER_URL_NO_TRAILING_SLASH;
    if (!envServerUrl) {
      throw new Error('SERVER_URL_NO_TRAILING_SLASH is not defined in environment variables');
    }

    this.serverUrl = envServerUrl;
  }

  async sendMessage(
    senderId: string,
    conversationId: string,
    message: string,
  ): Promise<SocketResponseData<string>> {
    await this.connectWebSocket();

    const request = {
      senderId,
      conversationId,
      content: message,
    };

    const response: SocketResponseData<string> = await this.socket?.emitWithAck(
      SEND_MESSAGE,
      request,
    );

    return response;
  }

  private connectWebSocket(): Promise<void> {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.socket = io(this.serverUrl);

      this.socket.on('connect', () => {
        console.log('Connected to backend via WebSocket');
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from backend WebSocket');
        this.socket = null;
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.socket = null;
        reject(error);
      });
    });
  }
}
