import { conversationTestCreateProps } from '../../../../../tests/createEntitiesTest/conversationCreate';
import { createTestMessage } from '../../../../../tests/createEntitiesTest/messageCreate';
import { PermissionDomainError, ValidationDomainError } from '../../../common/domainErrors';
import { Conversation, ConversationCreateProps } from '../Conversation';

describe('Conversation', () => {
  let conversation: Conversation;
  let validConversationProps: ConversationCreateProps;

  beforeEach(() => {
    validConversationProps = {
      ...conversationTestCreateProps,
    };

    conversation = Conversation.create(validConversationProps);
  });

  it('should create a valid conversation', () => {
    expect(conversation).toBeInstanceOf(Conversation);
  });

  describe('Behaviour', () => {
    it('should order messages chronologically on creation', async () => {
      const newConversation = Conversation.create({
        ...validConversationProps,
        messages: [
          createTestMessage({
            overrideProps: {
              content: 'Newest message',
              sentAt: new Date(), // Sent now
            },
          }),
          createTestMessage({
            overrideProps: {
              content: 'Oldest message',
              sentAt: new Date(Date.now() - 2000), // Sent 2 seconds ago
            },
          }),
          createTestMessage({
            overrideProps: {
              content: 'Second message',
              sentAt: new Date(Date.now() - 1000), // Sent 1 second ago
            },
          }),
        ],
      });

      const messages = newConversation.messages;

      expect(messages[0].content).toBe('Newest message');
      expect(messages[1].content).toBe('Second message');
      expect(messages[2].content).toBe('Oldest message');
    });

    it('should add a new message', async () => {
      const newMessage = createTestMessage();

      const messageCountBefore = conversation.messages.length;

      conversation.addMessage(newMessage);

      const messageCountAfter = conversation.messages.length;

      expect(messageCountAfter).toBe(messageCountBefore + 1);
    });

    it('should sort messages on addition', async () => {
      const newMessage = createTestMessage({
        overrideProps: {
          content: 'Newest message',
          sentAt: new Date(), // Sent now
        },
      });

      conversation.addMessage(newMessage);

      const messages = conversation.messages;

      expect(messages[0].content).toBe('Newest message');
    });
  });

  describe('Getters', () => {
    it('should return the correct id', () => {
      expect(conversation.id).toBe(validConversationProps.id);
    });

    it('should return array of participants ids', () => {
      expect(conversation.participantIds).toEqual([
        validConversationProps.oneParticipantId,
        validConversationProps.anotherParticipantId,
      ]);
    });

    it('should return an array of messages', async () => {
      expect(Array.isArray(conversation.messages)).toBe(true);
    });
  });

  describe('Errors', () => {
    it('should throw error if trying to add something other than a Message', async () => {
      expect(() => {
        // @ts-expect-error
        conversation.addMessage({});
      }).toThrow(ValidationDomainError);

      expect(() => {
        // @ts-expect-error
        conversation.addMessage({});
      }).toThrow(/Conversation: you can only add instances of Message/);
    });
  });

  it('should throw error if a no participant tries to send a message', async () => {
    const nonParticipantId = 'non-participant-id';
    const newMessage = createTestMessage({
      overrideProps: {
        senderId: nonParticipantId,
      },
    });

    expect(() => {
      conversation.addMessage(newMessage);
    }).toThrow(PermissionDomainError);

    expect(() => {
      conversation.addMessage(newMessage);
    }).toThrow(/Conversation: only participants can send messages/);
  });
});
