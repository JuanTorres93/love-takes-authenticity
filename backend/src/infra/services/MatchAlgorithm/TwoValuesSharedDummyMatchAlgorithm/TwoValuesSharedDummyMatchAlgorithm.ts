import { MatchAlgorithm } from '../../../../application-layer/services/MatchAlgorithm.port';
import { UserProfile } from '../../../../domain/entities/userprofile/UserProfile';

export class TwoValuesSharedDummyMatchAlgorithm implements MatchAlgorithm {
  isMatch(userProfile: UserProfile, otherUserProfile: UserProfile): boolean {
    const sharedValues = userProfile.corePersonalValues.filter((value: string) =>
      otherUserProfile.corePersonalValues.includes(value),
    );

    return sharedValues.length >= 2;
  }
}
