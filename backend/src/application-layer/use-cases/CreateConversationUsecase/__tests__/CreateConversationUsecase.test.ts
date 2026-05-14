import {
  anotherParticipantId,
  createTestConversation,
} from '../../../../../tests/createEntitiesTest/conversationCreate';
import { createTestUser } from '../../../../../tests/createEntitiesTest/userCreate';
import { conversationDTOProperties } from '../../../../../tests/dtoProperties/conversationDtoProperties';
import { Conversation } from '../../../../domain/entities/conversation/Conversation';
import { User } from '../../../../domain/entities/user/User';
import { MemoryConversationsRepo } from '../../../../infra/repos/Memory/MemoryConversationsRepo';
import { MemoryUsersRepo } from '../../../../infra/repos/Memory/MemoryUsersRepo';
import { CryptoUUIDIdGenerator } from '../../../../infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator';
import { NotFoundApplicationError } from '../../../common/applicationErrors';
import {
  CreateConversationUsecase,
  CreateConversationUsecaseRequest,
} from '../CreateConversationUsecase';

describe('CreateConversationUsecase', () => {
  let conversationsRepo: MemoryConversationsRepo;
  let usersRepo: MemoryUsersRepo;

  let idGenerator: CryptoUUIDIdGenerator;

  let usecase: CreateConversationUsecase;

  let user: User;
  let otherUser: User;
  let conversation: Conversation;

  let validRequest: CreateConversationUsecaseRequest;

  beforeEach(async () => {
    conversationsRepo = new MemoryConversationsRepo();
    usersRepo = new MemoryUsersRepo();
    idGenerator = new CryptoUUIDIdGenerator();

    usecase = new CreateConversationUsecase(conversationsRepo, usersRepo, idGenerator);

    user = createTestUser();
    otherUser = createTestUser({ id: anotherParticipantId });

    conversation = createTestConversation();

    await usersRepo.save(user);
    await usersRepo.save(otherUser);

    validRequest = {
      userId: user.id,
      otherUserId: otherUser.id,
    };
  });

  describe('Execution', () => {
    it('should return ConversationDTO', async () => {
      const conversation = await usecase.execute(validRequest);

      expect(conversation).not.toBeInstanceOf(Conversation);
      for (const prop of conversationDTOProperties) {
        expect(conversation).toHaveProperty(prop);
      }
    });

    it('should have correct participants ids', async () => {
      const conversation = await usecase.execute(validRequest);

      expect(conversation.participantIds).toEqual(expect.arrayContaining([user.id, otherUser.id]));
    });

    it('should generate a different id for different conversations', async () => {
      const conversation1 = await usecase.execute(validRequest);

      const newUser = createTestUser({ id: 'new-user-id' });
      await usersRepo.save(newUser);

      const conversation2 = await usecase.execute({
        userId: user.id,
        otherUserId: newUser.id,
      });

      expect(conversation1.id).not.toBe(conversation2.id);
    });

    it('should not have any messages', async () => {
      const conversation = await usecase.execute(validRequest);

      expect(conversation.messages).toEqual([]);
    });
  });

  describe('Side effects', () => {
    it('should persist conversation in repository', async () => {
      const conversation = await usecase.execute(validRequest);

      const persistedConversation = await conversationsRepo.getById(conversation.id);
      expect(persistedConversation).not.toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if at least one user does not exist', async () => {
      const invalidRequests: CreateConversationUsecaseRequest[] = [
        {
          userId: 'nonExistingUserId',
          otherUserId: otherUser.id,
        },
        {
          userId: user.id,
          otherUserId: 'nonExistingUserId',
        },
      ];
      for (const request of invalidRequests) {
        await expect(usecase.execute(request)).rejects.toThrow(NotFoundApplicationError);

        await expect(usecase.execute(request)).rejects.toThrow(/User.*not found/i);
      }
    });

    it('should throw error if conversation between users already exists', async () => {
      await conversationsRepo.save(conversation);

      await expect(usecase.execute(validRequest)).rejects.toThrow(/Conversation.*already exists/i);
    });
  });
});
