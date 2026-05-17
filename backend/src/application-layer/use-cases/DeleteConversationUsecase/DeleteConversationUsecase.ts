import { ConversationsRepo } from '../../../domain/repos/ConversationsRepo.port';
import { NotFoundApplicationError } from '../../common/applicationErrors';
import { ConversationDTO, toConversationDTO } from '../../dtos/ConversationDTO';

export type DeleteConversationUsecaseRequest = {
  conversationId: string;
};

export class DeleteConversationUsecase {
  constructor(private conversationRepo: ConversationsRepo) {}

  async execute(request: DeleteConversationUsecaseRequest): Promise<ConversationDTO> {
    const conversation = await this.conversationRepo.getById(request.conversationId);

    if (!conversation) {
      throw new NotFoundApplicationError(
        `Conversation with id ${request.conversationId} not found`,
      );
    }

    await this.conversationRepo.deleteById(request.conversationId);

    return toConversationDTO(conversation);
  }
}
