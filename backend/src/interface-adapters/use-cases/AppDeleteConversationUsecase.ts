import { DeleteConversationUsecase } from '../../application-layer/use-cases/DeleteConversationUsecase/DeleteConversationUsecase';
import { AppConversationsRepo } from '../repos/AppConversationsRepo';

export const AppDeleteConversationUsecase = new DeleteConversationUsecase(AppConversationsRepo);
