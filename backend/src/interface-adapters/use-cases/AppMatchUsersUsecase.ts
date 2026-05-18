import { MatchUsersUsecase } from '../../application-layer/use-cases/MatchUsersUsecase/MatchUsersUsecase';
import { AppUserMatchesRepo } from '../repos/AppUserMatchesRepo';
import { AppTransactionContext } from '../services/AppTransactionContext';

export const AppMatchUsersUsecase = new MatchUsersUsecase(
  AppUserMatchesRepo,
  AppTransactionContext,
);
