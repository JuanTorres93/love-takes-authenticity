import { BlockUserUsecase } from '../../application-layer/use-cases/BlockUserUsecase/BlockUserUsecase';
import { AppUserMatchesRepo } from '../repos/AppUserMatchesRepo';

export const AppBlockUserUsecase = new BlockUserUsecase(AppUserMatchesRepo);
