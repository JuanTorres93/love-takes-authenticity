import { Message } from '../../../domain/entities/message/Message';
import { ConversationsRepo } from '../../../domain/repos/ConversationsRepo.port';
import { NotFoundApplicationError } from '../../common/applicationErrors';
import { MessageDTO, toMessageDTO } from '../../dtos/MessageDTO';
import { IdGenerator } from '../../services/IdGenerator.port';

export type SendMessageUsecaseRequest = {
  senderId: string;
  conversationId: string;
  content: string;
};

export class SendMessageUsecase {
  constructor(
    private conversationsRepo: ConversationsRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(request: SendMessageUsecaseRequest): Promise<MessageDTO> {
    const conversation = await this.conversationsRepo.getById(request.conversationId);

    if (!conversation) {
      throw new NotFoundApplicationError('The conversation was not found');
    }

    const newMessage = Message.create({
      id: this.idGenerator.generateId(),
      senderId: request.senderId,
      conversationId: request.conversationId,
      content: request.content,
      sentAt: new Date(),
    });

    conversation.addMessage(newMessage);

    await this.conversationsRepo.save(conversation);

    return toMessageDTO(newMessage);
  }
}
