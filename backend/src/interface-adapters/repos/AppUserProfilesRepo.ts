import { MemoryUserProfilesRepo } from '../../infra/repos/Memory/MemoryUserProfilesRepo';
import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';

export const AppUserProfilesRepo = await injectFor_ProductionDevelopment_Test(
  MemoryUserProfilesRepo,
  MemoryUserProfilesRepo,
);
