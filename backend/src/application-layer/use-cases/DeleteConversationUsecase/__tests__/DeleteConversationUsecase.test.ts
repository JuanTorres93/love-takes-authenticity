import { createTestConversation } from '../../../../../tests/createEntitiesTest/conversationCreate';
import { conversationDTOProperties } from '../../../../../tests/dtoProperties/conversationDtoProperties';
import { Conversation } from '../../../../domain/entities/conversation/Conversation';
import { MemoryConversationsRepo } from '../../../../infra/repos/Memory/MemoryConversationsRepo';
import { NotFoundApplicationError } from '../../../common/applicationErrors';
import {
  DeleteConversationUsecase,
  DeleteConversationUsecaseRequest,
} from '../DeleteConversationUsecase';

describe('DeleteConversationUsecase', () => {
  let conversationRepo: MemoryConversationsRepo;

  let usecase: DeleteConversationUsecase;

  let conversation: Conversation;

  let validRequest: DeleteConversationUsecaseRequest;

  beforeEach(async () => {
    conversationRepo = new MemoryConversationsRepo();
    usecase = new DeleteConversationUsecase(conversationRepo);

    conversation = createTestConversation();

    await conversationRepo.save(conversation);

    validRequest = {
      conversationId: conversation.id,
    };
  });

  describe('Execution', () => {
    it('should return ConversationDTO', async () => {
      const result = await usecase.execute(validRequest);

      expect(result).not.toBeInstanceOf(Conversation);
      for (const prop of conversationDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Side effects', () => {
    it('should delete the conversation from the repo', async () => {
      // Ensure conversation exists before executing the usecase
      const existingConversation = await conversationRepo.getById(validRequest.conversationId);
      expect(existingConversation).toBeDefined();

      await usecase.execute(validRequest);

      const deletedConversation = await conversationRepo.getById(validRequest.conversationId);

      expect(deletedConversation).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw error if conversation does not exist', async () => {
      const invalidRequest = {
        conversationId: 'non-existent-conversation-id',
      };

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(NotFoundApplicationError);

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(/Conversation.*not found/);
    });
  });
});
