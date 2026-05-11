import { Message } from '../../domain/entities/message/Message';

export type MessageDTO = {
  id: string;
  content: string;
  senderId: string;
  sentAt: string;
};

export function toMessageDTO(message: Message): MessageDTO {
  return {
    id: message.id,
    content: message.content,
    senderId: message.senderId,
    sentAt: message.sentAt.toISOString(),
  };
}
