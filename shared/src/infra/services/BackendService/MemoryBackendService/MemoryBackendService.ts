import { BackendService } from '../../../../application-layer/services/BackendService.port';

export class MemoryBackendService implements BackendService {
  async sendMessage(senderId: string, conversationId: string, message: string): Promise<void> {
    console.log(`Message sent by ${senderId} in conversation ${conversationId}: ${message}`);
  }
}
