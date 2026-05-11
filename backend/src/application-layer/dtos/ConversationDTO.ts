import { Conversation } from '../../domain/entities/conversation/Conversation';
import { MessageDTO, toMessageDTO } from './MessageDTO';

export type ConversationDTO = {
  id: string;
  participantIds: string[];
  messages: MessageDTO[];
  createdAt: Date;
  updatedAt: Date;
};

export function toConversationDTO(conversation: Conversation): ConversationDTO {
  return {
    id: conversation.id,
    participantIds: conversation.participantIds,
    messages: conversation.messages.map(toMessageDTO),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}
