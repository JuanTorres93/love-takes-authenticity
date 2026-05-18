import { Conversation } from '../../src/domain/entities/conversation/Conversation';
import { User } from '../../src/domain/entities/user/User';
import { createTestConversation } from '../createEntitiesTest/conversationCreate';
import { createTestUser } from '../createEntitiesTest/userCreate';

export function createEmptyTestConversationAndUsers(): {
  conversation: Conversation;
  user: User;
  anotherUser: User;
} {
  const user = createTestUser();
  const anotherUser = createTestUser({
    id: 'another-user-id',
  });
  const conversation = createTestConversation({
    messages: [],
  });

  return { conversation, user, anotherUser };
}
