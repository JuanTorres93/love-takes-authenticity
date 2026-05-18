import { MemoryConversationsRepo } from '../../infra/repos/Memory/MemoryConversationsRepo';
import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';

export const AppConversationsRepo = injectFor_ProductionDevelopment_Test(
  MemoryConversationsRepo,
  MemoryConversationsRepo,
);
