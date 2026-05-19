export interface BackendService {
  sendMessage: (senderId: string, conversationId: string, message: string) => Promise<void>;
}
