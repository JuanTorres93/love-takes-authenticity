import { Conversation } from '../../../domain/entities/conversation/Conversation';
import { ConversationsRepo } from '../../../domain/repos/ConversationsRepo.port';

export class MemoryConversationsRepo implements ConversationsRepo {
  private conversations: Map<string, Conversation> = new Map();

  async save(conversation: Conversation): Promise<void> {
    this.conversations.set(conversation.id, conversation);
  }

  async getAll() {
    return [...Array.from(this.conversations.values())];
  }

  async getById(id: string) {
    const conversation = this.conversations.get(id);

    if (!conversation) {
      return null;
    }

    return Conversation.create(conversation.toCreateProps());
  }

  async getByParticipantId(participantId: string) {
    return [
      ...Array.from(this.conversations.values()).filter((conversation) =>
        conversation.participantIds.includes(participantId),
      ),
    ];
  }

  async existsBetweenParticipants(
    participantId: string,
    otherParticipantId: string,
  ): Promise<boolean> {
    return [...Array.from(this.conversations.values())].some((conversation) => {
      const participantIds = conversation.participantIds;

      return participantIds.includes(participantId) && participantIds.includes(otherParticipantId);
    });
  }

  async deleteById(id: string): Promise<void> {
    this.conversations.delete(id);
  }

  clearAllForTesting() {
    this.conversations.clear();
  }
}
