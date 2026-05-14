import { Conversation } from '../entities/conversation/Conversation';

export interface ConversationsRepo {
  getAll(): Promise<Conversation[]>;
  getById(id: string): Promise<Conversation | null>;
  getByParticipantId(participantId: string): Promise<Conversation[]>;
  existsBetweenParticipants(participantId: string, otherParticipantId: string): Promise<boolean>;

  save(conversation: Conversation): Promise<void>;

  deleteById(id: string): Promise<void>;
}
