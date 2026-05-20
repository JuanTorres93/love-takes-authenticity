import { SocketResponseData } from 'shared';

export interface BackendService {
  sendMessage: (
    senderId: string,
    conversationId: string,
    message: string,
  ) => Promise<SocketResponseData<string>>;
}
