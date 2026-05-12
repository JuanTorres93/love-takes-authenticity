import { messageTestCreateProps } from '../../../../../tests/createEntitiesTest/messageCreate';
import { Message, MessageCreateProps } from '../Message';

describe('Message', () => {
  let message: Message;
  let validMessageProps: MessageCreateProps;

  beforeEach(() => {
    validMessageProps = {
      ...messageTestCreateProps,
    };
    message = Message.create(validMessageProps);
  });

  it('should create a valid message', () => {
    expect(message).toBeInstanceOf(Message);
  });

  it('should convert to create props', async () => {
    const createProps = message.toCreateProps();

    expect(createProps).toEqual({
      ...messageTestCreateProps,
    });
  });

  describe('Getters', () => {
    it('should have an id', async () => {
      expect(message.id).toBeDefined();

      expect(message.id).toBe(messageTestCreateProps.id);
    });

    it('should have a senderId', async () => {
      expect(message.senderId).toBeDefined();

      expect(message.senderId).toBe(messageTestCreateProps.senderId);
    });

    it('should have a conversationId', async () => {
      expect(message.conversationId).toBeDefined();

      expect(message.conversationId).toBe(messageTestCreateProps.conversationId);
    });

    it('should have a content', async () => {
      expect(message.content).toBeDefined();

      expect(message.content).toBe(messageTestCreateProps.content);
    });

    it('should have a sentAt timestamp', async () => {
      expect(message.sentAt).toBeDefined();
      expect(message.sentAt).toBe(messageTestCreateProps.sentAt);
    });
  });
});
