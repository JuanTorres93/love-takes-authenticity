import { MessageDTO } from 'shared';

import { Message } from '../../domain/entities/message/Message';

export function toMessageDTO(message: Message): MessageDTO {
  return {
    id: message.id,
    senderId: message.senderId,
    conversationId: message.conversationId,

    content: message.content,

    sentAt: message.sentAt.toISOString(),
  };
}
