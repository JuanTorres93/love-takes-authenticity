import { createTestUserMatches } from '../../../../../tests/createEntitiesTest/userMatchesCreate';
import { userMatchesDTOProperties } from '../../../../../tests/dtoProperties/userMatchesDtoProperties';
import { UserMatches } from '../../../../domain/entities/usermatches/UserMatches';
import { MemoryUserMatchesRepo } from '../../../../infra/repos/Memory/MemoryUserMatchesRepo';
import { NotFoundApplicationError } from '../../../common/applicationErrors';
import { BlockUserUsecase, BlockUserUsecaseRequest } from '../BlockUserUsecase';

describe('BlockUserUsecase', () => {
  let userMatchesRepo: MemoryUserMatchesRepo;
  let usecase: BlockUserUsecase;

  let userMatches: UserMatches;
  let otherUserMatches: UserMatches;

  let validRequest: BlockUserUsecaseRequest;

  beforeEach(async () => {
    userMatchesRepo = new MemoryUserMatchesRepo();
    usecase = new BlockUserUsecase(userMatchesRepo);

    userMatches = createTestUserMatches();
    otherUserMatches = createTestUserMatches({
      id: 'other-matches-id',
      userId: 'other-user-id',
    });

    await userMatchesRepo.save(userMatches);
    await userMatchesRepo.save(otherUserMatches);

    validRequest = {
      userId: userMatches.userId,
      userToBlockId: otherUserMatches.userId,
    };

    // Ensure the users are not blocked before executing the usecase
    expect(userMatches.blockedUserIds).not.toContain(validRequest.userToBlockId);
    expect(otherUserMatches.blockedUserIds).not.toContain(validRequest.userId);
  });

  describe('Execution', () => {
    it('should return UserMatchesDTO', async () => {
      const result = await usecase.execute(validRequest);

      expect(result).not.toBeInstanceOf(UserMatches);
      for (const prop of userMatchesDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should add the userToBlockId to the blockedUserIds list of the user', async () => {
      const result = await usecase.execute(validRequest);

      expect(result.blockedUserIds).toContain(validRequest.userToBlockId);
    });

    it('should not add the userId to the blockedUserIds list of the userToBlock', async () => {
      const result = await usecase.execute(validRequest);

      expect(result.blockedUserIds).not.toContain(validRequest.userId);
    });
  });

  describe('Side effects', () => {
    it('should save the updated UserMatches in the repo', async () => {
      await usecase.execute(validRequest);

      const updatedUserMatches = await userMatchesRepo.getByUserId(validRequest.userId);
      const updatedOtherUserMatches = await userMatchesRepo.getByUserId(validRequest.userToBlockId);

      expect(updatedUserMatches!.blockedUserIds).toContain(validRequest.userToBlockId);
      expect(updatedOtherUserMatches!.blockedUserIds).not.toContain(validRequest.userId);
    });
  });

  describe('Errors', () => {
    it('should throw error if at least one of the UserMatches does not exist', async () => {
      const invalidRequests: BlockUserUsecaseRequest[] = [
        {
          userId: 'non-existent-user-id',
          userToBlockId: otherUserMatches.userId,
        },
        {
          userId: userMatches.userId,
          userToBlockId: 'non-existent-user-to-block-id',
        },
      ];

      for (const request of invalidRequests) {
        await expect(usecase.execute(request)).rejects.toThrow(NotFoundApplicationError);

        await expect(usecase.execute(request)).rejects.toThrow(/UserMatches.*not found/);
      }
    });
  });
});
