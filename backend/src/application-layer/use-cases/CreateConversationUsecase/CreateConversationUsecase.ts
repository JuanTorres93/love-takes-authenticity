import { ConversationDTO } from 'shared';

import { Conversation } from '../../../domain/entities/conversation/Conversation';
import { ConversationsRepo } from '../../../domain/repos/ConversationsRepo.port';
import { UsersRepo } from '../../../domain/repos/UsersRepo.port';
import {
  AlreadyExistsApplicationError,
  NotFoundApplicationError,
} from '../../common/applicationErrors';
import { toConversationDTO } from '../../dtos/ConversationDTO';
import { IdGenerator } from '../../services/IdGenerator.port';

export type CreateConversationUsecaseRequest = {
  userId: string;
  otherUserId: string;
};

export class CreateConversationUsecase {
  constructor(
    private conversationsRepo: ConversationsRepo,
    private usersRepo: UsersRepo,

    private idGenerator: IdGenerator,
  ) {}

  async execute(request: CreateConversationUsecaseRequest): Promise<ConversationDTO> {
    const [user, otherUser, conversationExists] = await Promise.all([
      this.usersRepo.getById(request.userId),
      this.usersRepo.getById(request.otherUserId),

      this.conversationsRepo.existsBetweenParticipants(request.userId, request.otherUserId),
    ]);

    if (!user || !otherUser) {
      throw new NotFoundApplicationError('One or more users not found');
    }

    if (conversationExists) {
      throw new AlreadyExistsApplicationError('Conversation between these users already exists');
    }

    const conversation = Conversation.create({
      id: this.idGenerator.generateId(),

      oneParticipantId: user.id,
      anotherParticipantId: otherUser.id,

      messages: [],

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.conversationsRepo.save(conversation);

    return toConversationDTO(conversation);
  }
}
