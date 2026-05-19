import { ConversationDTO } from 'shared';

import { createTestConversation } from '../../../../tests/createEntitiesTest/conversationCreate';
import { conversationDTOProperties } from '../../../../tests/dtoProperties/conversationDtoProperties';
import { Conversation } from '../../../domain/entities/conversation/Conversation';
import { toConversationDTO } from '../ConversationDTO';

describe('ConversationDTO', () => {
  let conversation: Conversation;
  let entityDTO: ConversationDTO;

  beforeEach(() => {
    conversation = createTestConversation();
  });

  describe('toConversationDTO', () => {
    beforeEach(() => {
      entityDTO = toConversationDTO(conversation);
    });

    it('should have a prop for each conversation getter', () => {
      for (const getter of conversationDTOProperties) {
        expect(entityDTO).toHaveProperty(getter);
      }
    });
  });
});
