import { Message, MessageCreateProps } from '../../src/domain/entities/message/Message';
import { testUserId } from './userCreate';

export const messageTestCreateProps: MessageCreateProps = {
  id: 'message-id',
  senderId: testUserId,
  conversationId: 'conversation-id',
  content: 'Hello, this is a test message.',
  sentAt: new Date(),
};

export function createTestMessage({
  overrideProps,
}: { overrideProps?: Partial<MessageCreateProps> } = {}): Message {
  const props = { ...messageTestCreateProps, ...overrideProps };

  return Message.create(props);
}
