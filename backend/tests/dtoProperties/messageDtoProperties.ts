import { getGetters } from '../../src/application-layer/dtos/__tests__/_getGettersUtil';
import { Message } from '../../src/domain/entities/message/Message';
import { messageTestCreateProps } from '../createEntitiesTest/messageCreate';

const sampleMessage = Message.create({
  ...messageTestCreateProps,
});

const allMessageGetters = getGetters(sampleMessage);

export const messageDTOProperties = [...allMessageGetters];
