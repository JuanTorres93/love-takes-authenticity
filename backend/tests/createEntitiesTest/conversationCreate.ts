import {
  Conversation,
  ConversationCreateProps,
} from '../../src/domain/entities/conversation/Conversation';
import { createTestMessage } from './messageCreate';
import { testUserId } from './userCreate';

export const oneParticipantId = testUserId;
export const anotherParticipantId = 'another-user-id';

export const conversationTestCreateProps: ConversationCreateProps = {
  id: 'conversation-id',
  oneParticipantId,
  anotherParticipantId,
  messages: [
    createTestMessage({
      senderId: anotherParticipantId,
      content: 'Hello from participant 2',
      sentAt: new Date(),
    }),
    createTestMessage({
      senderId: oneParticipantId,
      content: 'Hello from participant 1',
      // Sent 1 second before the other message
      sentAt: new Date(Date.now() - 1000),
    }),
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestConversation(
  overrideProps?: Partial<ConversationCreateProps>,
): Conversation {
  const props = { ...conversationTestCreateProps, ...overrideProps };

  return Conversation.create(props);
}
