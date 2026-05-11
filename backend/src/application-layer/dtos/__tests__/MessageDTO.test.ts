import { createTestMessage } from '../../../../tests/createEntitiesTest/messageCreate';
import { messageDTOProperties } from '../../../../tests/dtoProperties/messageDtoProperties';
import { Message } from '../../../domain/entities/message/Message';
import { MessageDTO, toMessageDTO } from '../MessageDTO';

describe('MessageDTO', () => {
  let message: Message;
  let messageDTO: MessageDTO;

  beforeEach(() => {
    message = createTestMessage();
  });

  describe('toMessageDTO', () => {
    beforeEach(() => {
      messageDTO = toMessageDTO(message);
    });

    it('should have a prop for each message getter', async () => {
      for (const getter of messageDTOProperties) {
        expect(messageDTO).toHaveProperty(getter);
      }
    });

    it('should convert dates to ISO 8601 strings', () => {
      expect(typeof messageDTO.sentAt).toBe('string');
      expect(() => new Date(messageDTO.sentAt)).not.toThrow();
    });
  });
});
