import { createTestUserProfile } from '../../../../../../tests/createEntitiesTest/userProfileCreate';
import { UserProfile } from '../../../../../domain/entities/userprofile/UserProfile';
import { allCorePersonalValues } from '../../../../../domain/value-objects/CorePersonalValue/ValidCorePersonalValues';
import { TwoValuesSharedDummyMatchAlgorithm } from '../TwoValuesSharedDummyMatchAlgorithm';

describe('TwoValuesSharedDummyMatchAlgorithm', () => {
  let matchAlgorithm: TwoValuesSharedDummyMatchAlgorithm;

  let userProfile: UserProfile;
  let otherUserProfile: UserProfile;

  beforeEach(() => {
    userProfile = createTestUserProfile({
      corePersonalValues: [
        allCorePersonalValues[0],
        allCorePersonalValues[1],
        allCorePersonalValues[2],
      ],
    });
    otherUserProfile = createTestUserProfile({
      id: 'other-profile-id',
      userId: 'other-user-id',
      corePersonalValues: [allCorePersonalValues[0], allCorePersonalValues[1]],
    });

    matchAlgorithm = new TwoValuesSharedDummyMatchAlgorithm();
  });

  it('should return true if both user profiles share at least two core personal values', () => {
    const result = matchAlgorithm.isMatch(userProfile, otherUserProfile);
    expect(result).toBe(true);
  });

  it('should return false if both user profiles do not share at least two core personal values', () => {
    const anotherUserProfileWithDifferentValues = createTestUserProfile({
      id: 'another-profile-id',
      userId: 'another-user-id',
      corePersonalValues: [allCorePersonalValues[0], allCorePersonalValues[3]],
    });

    const result = matchAlgorithm.isMatch(userProfile, anotherUserProfileWithDifferentValues);

    expect(result).toBe(false);
  });

  it('should return false if both user profiles do not share any core personal values', () => {
    const anotherUserProfileWithNoSharedValues = createTestUserProfile({
      id: 'another-profile-id',
      userId: 'another-user-id',
      corePersonalValues: [allCorePersonalValues[9]],
    });

    const result = matchAlgorithm.isMatch(userProfile, anotherUserProfileWithNoSharedValues);

    expect(result).toBe(false);
  });

  it('should return true if both user profiles share more than two core personal values', () => {
    const anotherUserProfileWithMoreSharedValues = createTestUserProfile({
      id: 'another-profile-id',
      userId: 'another-user-id',
      corePersonalValues: [
        allCorePersonalValues[0],
        allCorePersonalValues[1],
        allCorePersonalValues[2],
        allCorePersonalValues[3],
      ],
    });

    const result = matchAlgorithm.isMatch(userProfile, anotherUserProfileWithMoreSharedValues);

    expect(result).toBe(true);
  });
});
