import { conversationTestCreateProps } from '../../../../../tests/createEntitiesTest/conversationCreate';
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
      expect(conversation.messages).toEqual(validConversationProps.messages);
    });
  });
});
