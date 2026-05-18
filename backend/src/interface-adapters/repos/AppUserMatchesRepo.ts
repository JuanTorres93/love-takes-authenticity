import { MemoryUserMatchesRepo } from '../../infra/repos/Memory/MemoryUserMatchesRepo';
import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';

export const AppUserMatchesRepo = injectFor_ProductionDevelopment_Test(
  MemoryUserMatchesRepo,
  MemoryUserMatchesRepo,
);
