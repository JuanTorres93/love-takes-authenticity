import { CreateConversationUsecase } from '../../application-layer/use-cases/CreateConversationUsecase/CreateConversationUsecase';
import { AppConversationsRepo } from '../repos/AppConversationsRepo';
import { AppUsersRepo } from '../repos/AppUsersRepo';
import { AppIdGenerator } from '../services/AppIdGenerator';

export const AppCreateConversationUsecase = new CreateConversationUsecase(
  AppConversationsRepo,
  AppUsersRepo,
  AppIdGenerator,
);
