import { ConversationDTO } from 'shared';

import { Conversation } from '../../domain/entities/conversation/Conversation';
import { toMessageDTO } from './MessageDTO';

export function toConversationDTO(conversation: Conversation): ConversationDTO {
  return {
    id: conversation.id,
    participantIds: conversation.participantIds,
    messages: conversation.messages.map(toMessageDTO),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}
