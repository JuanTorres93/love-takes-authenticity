import { createTestConversation } from '../../../../../tests/createEntitiesTest/conversationCreate';
import { messageDTOProperties } from '../../../../../tests/dtoProperties/messageDtoProperties';
import { Conversation } from '../../../../domain/entities/conversation/Conversation';
import { Message } from '../../../../domain/entities/message/Message';
import { MemoryConversationsRepo } from '../../../../infra/repos/Memory/MemoryConversationsRepo';
import { CryptoUUIDIdGenerator } from '../../../../infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { NotFoundApplicationError } from '../../../common/applicationErrors';
import { SendMessageUsecase, SendMessageUsecaseRequest } from '../SendMessageUsecase';

describe('SendMessageUsecase', () => {
  let conversationsRepo: MemoryConversationsRepo;
  let idGenerator: CryptoUUIDIdGenerator;

  let usecase: SendMessageUsecase;
  let conversation: Conversation;

  let validRequest: SendMessageUsecaseRequest;

  beforeEach(async () => {
    conversationsRepo = new MemoryConversationsRepo();
    idGenerator = new CryptoUUIDIdGenerator();

    usecase = new SendMessageUsecase(conversationsRepo, idGenerator);

    conversation = createTestConversation();

    const senderId = conversation.participantIds[0];

    validRequest = {
      senderId: senderId,
      conversationId: conversation.id,
      content: 'Hello, this is a new message',
    };

    await conversationsRepo.save(conversation);
  });

  describe('Execution', () => {
    it('should return MessageDTO', async () => {
      const result = await usecase.execute(validRequest);

      expect(result).not.toBeInstanceOf(Message);

      for (const prop of messageDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should create different ids for different messages', async () => {
      const firstResult = await usecase.execute(validRequest);

      const secondResult = await usecase.execute(validRequest);

      expect(firstResult.id).not.toBe(secondResult.id);
    });

    it('should set correct senderId', async () => {
      const result = await usecase.execute(validRequest);

      expect(result.senderId).toBe(validRequest.senderId);
    });

    it('should set correct content', async () => {
      const result = await usecase.execute(validRequest);

      expect(result.content).toBe(validRequest.content);
    });

    it('should set correct conversationId', async () => {
      const result = await usecase.execute(validRequest);

      expect(result.conversationId).toBe(validRequest.conversationId);
    });

    it('should set sentAt to a recent date', async () => {
      const result = await usecase.execute(validRequest);

      const now = new Date();
      const sentAt = new Date(result.sentAt);

      // Check if sentAt is within the last 5 seconds
      expect(sentAt.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(sentAt.getTime()).toBeGreaterThanOrEqual(now.getTime() - 5000);
    });
  });

  describe('Side effects', () => {
    it('should persist message in conversation', async () => {
      const initialConversation = await conversationsRepo.getById(conversation.id);

      const initialMessageCount = initialConversation!.messages.length;

      await usecase.execute(validRequest);

      const updatedConversation = await conversationsRepo.getById(conversation.id);

      const updatedMessageCount = updatedConversation!.messages.length;

      expect(updatedMessageCount).toBe(initialMessageCount + 1);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundApplicationError if conversation not found', async () => {
      const invalidRequest = { ...validRequest, conversationId: 'non-existent-id' };

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(NotFoundApplicationError);

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(/conversation.*not found/);
    });

    it('should throw error if sender does not belong to conversation', async () => {
      // NOTE: This error is thrown in the domain layer
      const invalidRequest = { ...validRequest, senderId: 'user-not-in-conversation' };

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(Error);
    });
  });
});
