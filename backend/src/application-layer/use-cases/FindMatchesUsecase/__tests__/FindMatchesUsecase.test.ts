import { createTestUserProfile } from '../../../../../tests/createEntitiesTest/userProfileCreate';
import { userProfileDTOProperties } from '../../../../../tests/dtoProperties/userProfileDtoProperties';
import { UserProfile } from '../../../../domain/entities/userprofile/UserProfile';
import { allCorePersonalValues } from '../../../../domain/value-objects/CorePersonalValue/ValidCorePersonalValues';
import { MemoryUserProfilesRepo } from '../../../../infra/repos/Memory/MemoryUserProfilesRepo';
import { TwoValuesSharedDummyMatchAlgorithm } from '../../../../infra/services/MatchAlgorithm/TwoValuesSharedDummyMatchAlgorithm/TwoValuesSharedDummyMatchAlgorithm';
import { NotFoundApplicationError } from '../../../common/applicationErrors';
import { FindMatchesUsecase, FindMatchesUsecaseRequest } from '../FindMatchesUsecase';

describe('FindMatchesUsecase', () => {
  let userProfilesRepo: MemoryUserProfilesRepo;
  let matchAlgorithm: TwoValuesSharedDummyMatchAlgorithm;

  let usecase: FindMatchesUsecase;

  let userProfile: UserProfile;

  let validRequest: FindMatchesUsecaseRequest;

  beforeEach(async () => {
    userProfilesRepo = new MemoryUserProfilesRepo();
    matchAlgorithm = new TwoValuesSharedDummyMatchAlgorithm();

    usecase = new FindMatchesUsecase(userProfilesRepo, matchAlgorithm);

    userProfile = await initializeUserProfilesRepoWithTestData(userProfilesRepo);

    validRequest = {
      userId: userProfile.userId,
    };
  });

  describe('Execution', () => {
    it('should return array of UserProfileDTO', async () => {
      const result = await usecase.execute(validRequest);

      expect(Array.isArray(result)).toBe(true);

      for (const userProfile of result) {
        expect(userProfile).not.toBeInstanceOf(UserProfile);

        for (const prop of userProfileDTOProperties) {
          expect(userProfile).toHaveProperty(prop);
        }
      }
    });

    it('should return matches that share at least 2 core personal values', async () => {
      const result = await usecase.execute(validRequest);

      expect(result.length).toBe(1);

      const match = result[0];

      expect(match.userId).toBe('user2');
    });

    it('should not match itself', async () => {
      const result = await usecase.execute(validRequest);

      for (const match of result) {
        expect(match.userId).not.toBe(userProfile.userId);
      }
    });

    it('should return empty array if no matches found', async () => {
      const requestForUser3 = {
        userId: 'user3',
      };

      const result = await usecase.execute(requestForUser3);

      expect(result).toEqual([]);
    });

    it('should return empty array if no candidate profiles found', async () => {
      // Clear all profiles and add just the user profile
      await userProfilesRepo
        .getAll()
        .then((profiles) =>
          Promise.all(profiles.map((profile) => userProfilesRepo.deleteByUserId(profile.userId))),
        );

      await userProfilesRepo.save(userProfile);

      const result = await usecase.execute(validRequest);

      expect(result).toEqual([]);
    });
  });

  describe('Errors', () => {
    it('should throw error if user profile does not exist', async () => {
      const invalidRequest = {
        userId: 'non-existent-id',
      };

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(NotFoundApplicationError);

      await expect(usecase.execute(invalidRequest)).rejects.toThrow(/User profile not found/);
    });
  });
});

async function initializeUserProfilesRepoWithTestData(userProfilesRepo: MemoryUserProfilesRepo) {
  const userProfile1 = createTestUserProfile({
    userId: 'user1',
    corePersonalValues: [allCorePersonalValues[0], allCorePersonalValues[1]],
  });

  const userProfile2 = createTestUserProfile({
    userId: 'user2',
    corePersonalValues: [allCorePersonalValues[0], allCorePersonalValues[1]],
  });

  const userProfile3 = createTestUserProfile({
    userId: 'user3',
    corePersonalValues: [allCorePersonalValues[2], allCorePersonalValues[3]],
  });

  const userProfile4 = createTestUserProfile({
    userId: 'user4',
    corePersonalValues: [allCorePersonalValues[3], allCorePersonalValues[4]],
  });

  await Promise.all([
    userProfilesRepo.save(userProfile1),
    userProfilesRepo.save(userProfile2),
    userProfilesRepo.save(userProfile3),
    userProfilesRepo.save(userProfile4),
  ]);

  return userProfile1;
}
