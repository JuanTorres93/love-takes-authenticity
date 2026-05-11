import { getGetters } from '../../src/application-layer/dtos/__tests__/_getGettersUtil';
import { Conversation } from '../../src/domain/entities/conversation/Conversation';
import { conversationTestCreateProps } from '../createEntitiesTest/conversationCreate';

const sampleConversation = Conversation.create({
  ...conversationTestCreateProps,
});

const allConversationGetters = getGetters(sampleConversation);

export const conversationDTOProperties = [...allConversationGetters];
