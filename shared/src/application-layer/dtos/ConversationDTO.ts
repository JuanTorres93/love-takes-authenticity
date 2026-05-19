import { MessageDTO } from './MessageDTO';

export type ConversationDTO = {
  id: string;
  participantIds: string[];
  messages: MessageDTO[];
  createdAt: Date;
  updatedAt: Date;
};
