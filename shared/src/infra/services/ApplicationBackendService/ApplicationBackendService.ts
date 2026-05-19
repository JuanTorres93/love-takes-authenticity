import dotenv from 'dotenv';
import { ConversationDTO, MessageDTO, UserDTO } from 'shared';
import { io } from 'socket.io-client';

import { BackendService } from '../../../application-layer/services/BackendService.port';

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

  async sendMessage(senderId: string, conversationId: string, message: string): Promise<void> {
    await this.connectWebSocket();

    // TODO keep on implementing
    // TODO run server automatically before running these tests
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
