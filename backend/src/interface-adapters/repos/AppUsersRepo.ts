import { MemoryUsersRepo } from '../../infra/repos/Memory/MemoryUsersRepo';
import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';

export const AppUsersRepo = injectFor_ProductionDevelopment_Test(MemoryUsersRepo, MemoryUsersRepo);
