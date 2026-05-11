import { Message } from '../../domain/entities/message/Message';

export type MessageDTO = {
  id: string;
  senderId: string;
  conversationId: string;

  content: string;

  sentAt: string;
};

export function toMessageDTO(message: Message): MessageDTO {
  return {
    id: message.id,
    senderId: message.senderId,
    conversationId: message.conversationId,

    content: message.content,

    sentAt: message.sentAt.toISOString(),
  };
}
