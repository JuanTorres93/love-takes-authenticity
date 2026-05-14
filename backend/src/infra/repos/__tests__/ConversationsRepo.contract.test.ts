import {
  anotherParticipantId,
  createTestConversation,
  oneParticipantId,
} from '../../../../tests/createEntitiesTest/conversationCreate';
import { Conversation } from '../../entities/conversation/Conversation';
import { MemoryConversationsRepo } from '../Memory/MemoryConversationsRepo';

const repos = [
  { name: 'MemoryConversationsRepo', repoClass: MemoryConversationsRepo },
  // Add more repo implementations here as needed
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo: InstanceType<typeof repoClass>;
    let conversation: Conversation;

    beforeEach(async () => {
      conversation = createTestConversation();

      repo = new repoClass();

      await repo.save(conversation);
    });

    describe('getAll', () => {
      it('should return all conversations', async () => {
        const conversations = await repo.getAll();

        expect(conversations).toEqual([conversation]);
      });

      it('should return an empty array if no conversations are saved', async () => {
        const emptyRepo = new repoClass();

        const conversations = await emptyRepo.getAll();

        expect(conversations).toEqual([]);
      });
    });

    describe('save', () => {
      it('should save a conversation', async () => {
        const newConversation = createTestConversation({
          id: 'new-conversation-id',
        });

        const conversationsBefore = await repo.getAll();
        expect(conversationsBefore).not.toContain(newConversation);

        await repo.save(newConversation);

        const conversationsAfter = await repo.getAll();

        expect(conversationsAfter).toContain(newConversation);
        expect(conversationsAfter.length).toBe(conversationsBefore.length + 1);
      });

      it('should update a conversation if it already existed', async () => {
        const updatedConversation = createTestConversation({ messages: [] });

        const conversationsBefore = await repo.getAll();
        expect(conversationsBefore).toContain(conversation);

        await repo.save(updatedConversation);

        const conversationsAfter = await repo.getAll();

        expect(conversationsAfter).toContain(updatedConversation);
        expect(conversationsAfter.length).toBe(conversationsBefore.length);
      });
    });

    describe('getById', () => {
      it('should return a conversation by id', async () => {
        const foundConversation = await repo.getById(conversation.id);

        expect(foundConversation).toEqual(conversation);
      });

      it('should return null if conversation is not found', async () => {
        const foundConversation = await repo.getById('non-existent-id');

        expect(foundConversation).toBeNull();
      });
    });

    describe('getByParticipantId', () => {
      it('should return conversations for a given participant id', async () => {
        const conversations = await repo.getByParticipantId(oneParticipantId);

        expect(conversations).toContain(conversation);
      });

      it('should return an empty array if no conversations exist for the given participant id', async () => {
        const conversations = await repo.getByParticipantId('non-existent-participant-id');

        expect(conversations).toEqual([]);
      });

      it('should also return conversations for the other participant', async () => {
        const conversations = await repo.getByParticipantId(anotherParticipantId);

        expect(conversations).toContain(conversation);
      });
    });

    describe('existsBetweenParticipants', () => {
      it('should return true if a conversation exists between the given participant ids', async () => {
        const exists = await repo.existsBetweenParticipants(oneParticipantId, anotherParticipantId);

        expect(exists).toBe(true);
      });

      it('should return false if no conversation exists between the given participant ids', async () => {
        const exists = await repo.existsBetweenParticipants(
          oneParticipantId,
          'non-existent-participant-id',
        );

        expect(exists).toBe(false);
      });
    });

    describe('deleteById', () => {
      it('should delete a conversation by id', async () => {
        await repo.deleteById(conversation.id);

        const foundConversation = await repo.getById(conversation.id);
        expect(foundConversation).toBeNull();
      });

      it('should do nothing if conversation is not found', async () => {
        const conversationsBefore = await repo.getAll();

        await repo.deleteById('non-existent-id');

        const conversationsAfter = await repo.getAll();
        expect(conversationsAfter).toEqual(conversationsBefore);
      });
    });
  });
});
