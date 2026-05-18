import { FindMatchesUsecase } from '../../application-layer/use-cases/FindMatchesUsecase/FindMatchesUsecase';
import { AppUserProfilesRepo } from '../repos/AppUserProfilesRepo';
import { AppMatchAlgorithm } from '../services/AppMatchAlgorithm';

export const AppFindMatchesUsecase = new FindMatchesUsecase(AppUserProfilesRepo, AppMatchAlgorithm);
