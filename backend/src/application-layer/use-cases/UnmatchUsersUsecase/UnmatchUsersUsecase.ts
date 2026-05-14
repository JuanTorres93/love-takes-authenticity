import { createTestUserMatches } from '../../../../tests/createEntitiesTest/userMatchesCreate';
import { UserMatchesRepo } from '../../../domain/repos/UserMatchesRepo.port';
import { NotFoundApplicationError } from '../../common/applicationErrors';
import { toUserMatchesDTO } from '../../dtos/UserMatchesDTO';
import { TransactionContext } from '../../services/TransactionContext.port';
import { ObjectWithUserMatches } from '../common/types';

export type UnmatchUsersUsecaseRequest = {
  oneUserId: string;
  anotherUserId: string;
};

export class UnmatchUsersUsecase {
  constructor(
    private userMatchesRepo: UserMatchesRepo,
    private transactionContext: TransactionContext,
  ) {}

  async execute(request: UnmatchUsersUsecaseRequest): Promise<ObjectWithUserMatches> {
    const [oneUserMatches, anotherUserMatches] = await Promise.all([
      this.userMatchesRepo.getByUserId(request.oneUserId),

      this.userMatchesRepo.getByUserId(request.anotherUserId),
    ]);

    if (!oneUserMatches || !anotherUserMatches)
      throw new NotFoundApplicationError('UserMatches not found');

    oneUserMatches.unmatch(request.anotherUserId);
    anotherUserMatches.unmatch(request.oneUserId);

    // TODO IMPORTANT: Create a test file to test transactions when a database connection is implemented.
    await this.transactionContext.run(async () => {
      await Promise.all([
        this.userMatchesRepo.save(oneUserMatches),

        this.userMatchesRepo.save(anotherUserMatches),
      ]);
    });

    const returnObject: ObjectWithUserMatches = {
      [request.oneUserId]: toUserMatchesDTO(oneUserMatches),
      [request.anotherUserId]: toUserMatchesDTO(anotherUserMatches),
    };

    return returnObject;
  }
}
