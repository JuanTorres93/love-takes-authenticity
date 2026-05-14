import { UserMatchesRepo } from '../../../domain/repos/UserMatchesRepo.port';
import { NotFoundApplicationError } from '../../common/applicationErrors';
import { UserMatchesDTO, toUserMatchesDTO } from '../../dtos/UserMatchesDTO';

export type BlockUserUsecaseRequest = {
  userId: string;
  userToBlockId: string;
};

export class BlockUserUsecase {
  constructor(private userMatchesRepo: UserMatchesRepo) {}

  async execute(request: BlockUserUsecaseRequest): Promise<UserMatchesDTO> {
    const [userMatches, userToBlockMatches] = await Promise.all([
      this.userMatchesRepo.getByUserId(request.userId),

      this.userMatchesRepo.getByUserId(request.userToBlockId),
    ]);

    if (!userMatches || !userToBlockMatches) {
      throw new NotFoundApplicationError('UserMatches not found');
    }

    userMatches.block(request.userToBlockId);

    await this.userMatchesRepo.save(userMatches);

    return toUserMatchesDTO(userMatches);
  }
}
