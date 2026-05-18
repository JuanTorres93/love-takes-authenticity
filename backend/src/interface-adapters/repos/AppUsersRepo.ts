import { MemoryUsersRepo } from '../../infra/repos/Memory/MemoryUsersRepo';
import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';

export const AppUsersRepo = await injectFor_ProductionDevelopment_Test(
  MemoryUsersRepo,
  MemoryUsersRepo,
);
