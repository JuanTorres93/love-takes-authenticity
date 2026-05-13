import { UserProfile } from '../../domain/entities/userprofile/UserProfile';

export interface MatchAlgorithm {
  isMatch(userProfile: UserProfile, otherUserProfile: UserProfile): boolean;
}
