import { Conversation } from '../entities/conversation/Conversation';

export interface ConversationsRepo {
  getAll(): Promise<Conversation[]>;
  getById(id: string): Promise<Conversation | null>;
  getByParticipantId(participantId: string): Promise<Conversation[]>;

  save(conversation: Conversation): Promise<void>;

  deleteById(id: string): Promise<void>;
}
