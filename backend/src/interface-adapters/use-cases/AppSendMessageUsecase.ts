import { SendMessageUsecase } from '../../application-layer/use-cases/SendMessageUsecase/SendMessageUsecase';
import { AppConversationsRepo } from '../repos/AppConversationsRepo';
import { AppIdGenerator } from '../services/AppIdGenerator';

export const AppSendMessageUsecase = new SendMessageUsecase(AppConversationsRepo, AppIdGenerator);
