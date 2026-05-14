import { createTestUserMatches } from '../../../../../tests/createEntitiesTest/userMatchesCreate';
import { userMatchesDTOProperties } from '../../../../../tests/dtoProperties/userMatchesDtoProperties';
import { UserMatches } from '../../../../domain/entities/usermatches/UserMatches';
import { MemoryUserMatchesRepo } from '../../../../infra/repos/Memory/MemoryUserMatchesRepo';
import { MemoryTransactionContext } from '../../../../infra/services/TransactionContext/MemoryTransactionContext/MemoryTransactionContext';
import { NotFoundApplicationError } from '../../../common/applicationErrors';
import { UnmatchUsersUsecase, UnmatchUsersUsecaseRequest } from '../UnmatchUsersUsecase';

describe('UnmatchUsersUsecase', () => {
  let userMatchesRepo: MemoryUserMatchesRepo;
  let transactionContext: MemoryTransactionContext;

  let usecase: UnmatchUsersUsecase;

  let userMatches: UserMatches;
  let anotherUserMatches: UserMatches;

  let validRequest: UnmatchUsersUsecaseRequest;

  beforeEach(async () => {
    userMatchesRepo = new MemoryUserMatchesRepo();
    transactionContext = new MemoryTransactionContext();

    usecase = new UnmatchUsersUsecase(userMatchesRepo, transactionContext);

    userMatches = createTestUserMatches();
    anotherUserMatches = createTestUserMatches({
      id: 'another-matches-id',
      userId: 'another-user-id',
    });

    // Match the users
    userMatches.match(anotherUserMatches.userId);
    anotherUserMatches.match(userMatches.userId);

    await userMatchesRepo.save(userMatches);
    await userMatchesRepo.save(anotherUserMatches);

    validRequest = {
      oneUserId: userMatches.userId,
      anotherUserId: anotherUserMatches.userId,
    };

    // Ensure the users are matched before executing the usecase
    expect(userMatches.currentlyMatchedUserIds).toContain(validRequest.anotherUserId);
    expect(anotherUserMatches.currentlyMatchedUserIds).toContain(validRequest.oneUserId);
  });

  describe('Execution', () => {
    it('should return object with userIds as keys and UserProfilesDTO as values', async () => {
      const result = await usecase.execute(validRequest);

      expect(Object.keys(result).length).toBe(2);

      for (const key of Object.keys(result)) {
        expect(result).not.toBeInstanceOf(UserMatches);

        for (const prop of userMatchesDTOProperties) {
          const userProfile = result[key];

          expect(userProfile).toHaveProperty(prop);
        }
      }
    });

    it('should remove from matched list in both users', async () => {
      const result = await usecase.execute(validRequest);

      const updatedOneUserMatches = result[validRequest.oneUserId];
      const updatedAnotherUserMatches = result[validRequest.anotherUserId];

      expect(updatedOneUserMatches!.currentlyMatchedUserIds).not.toContain(
        validRequest.anotherUserId,
      );
      expect(updatedAnotherUserMatches!.currentlyMatchedUserIds).not.toContain(
        validRequest.oneUserId,
      );
    });

    it('should add to unmatched list in both users', async () => {
      const result = await usecase.execute(validRequest);

      const updatedOneUserMatches = result[validRequest.oneUserId];
      const updatedAnotherUserMatches = result[validRequest.anotherUserId];

      expect(updatedOneUserMatches!.unmatchedUserIds).toContain(validRequest.anotherUserId);
      expect(updatedAnotherUserMatches!.unmatchedUserIds).toContain(validRequest.oneUserId);
    });
  });

  describe('Side effects', () => {
    it('should persist changes in the repository', async () => {
      await usecase.execute(validRequest);

      const persistedOneUserMatches = await userMatchesRepo.getByUserId(validRequest.oneUserId);
      const persistedAnotherUserMatches = await userMatchesRepo.getByUserId(
        validRequest.anotherUserId,
      );

      expect(persistedOneUserMatches!.currentlyMatchedUserIds).not.toContain(
        validRequest.anotherUserId,
      );
      expect(persistedAnotherUserMatches!.currentlyMatchedUserIds).not.toContain(
        validRequest.oneUserId,
      );

      expect(persistedOneUserMatches!.unmatchedUserIds).toContain(validRequest.anotherUserId);
      expect(persistedAnotherUserMatches!.unmatchedUserIds).toContain(validRequest.oneUserId);
    });
  });

  describe('Errors', () => {
    it('should throw error if at least one userMatches does not exist', async () => {
      const invalidRequests = [
        {
          oneUserId: 'non-existent-user-id',
          anotherUserId: 'another-non-existent-user-id',
        },
        {
          oneUserId: userMatches.userId,
          anotherUserId: 'non-existent-user-id',
        },
      ];

      for (const request of invalidRequests) {
        await expect(usecase.execute(request)).rejects.toThrow(NotFoundApplicationError);

        await expect(usecase.execute(request)).rejects.toThrow(/UserMatches.*not found/);
      }
    });
  });
});
