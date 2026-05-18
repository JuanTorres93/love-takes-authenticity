import { UnmatchUsersUsecase } from '../../application-layer/use-cases/UnmatchUsersUsecase/UnmatchUsersUsecase';
import { AppUserMatchesRepo } from '../repos/AppUserMatchesRepo';
import { AppTransactionContext } from '../services/AppTransactionContext';

export const AppUnmatchUsersUsecase = new UnmatchUsersUsecase(
  AppUserMatchesRepo,
  AppTransactionContext,
);
