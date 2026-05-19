import { UserProfileDTO } from 'shared';

import { UserProfilesRepo } from '../../../domain/repos/UserProfilesRepo.port';
import { NotFoundApplicationError } from '../../common/applicationErrors';
import { toUserProfileDTO } from '../../dtos/UserProfileDTO';
import { MatchAlgorithm } from '../../services/MatchAlgorithm.port';

export type FindMatchesUsecaseRequest = {
  userId: string;
};

export class FindMatchesUsecase {
  constructor(
    private userProfilesRepo: UserProfilesRepo,
    private matchAlgorithm: MatchAlgorithm,
  ) {}

  async execute(request: FindMatchesUsecaseRequest): Promise<UserProfileDTO[]> {
    const [userProfile, candidateProfiles] = await Promise.all([
      this.userProfilesRepo.getByUserId(request.userId),

      // TODO: optimize candidate profiles retrieval. When dataset grows, it will be inefficient to retrieve all profiles and filter in memory.
      this.userProfilesRepo.getAll(),
    ]);

    if (!userProfile) {
      throw new NotFoundApplicationError('User profile not found');
    }

    const matches = candidateProfiles.filter((candidateProfile) => {
      if (candidateProfile.userId === userProfile.userId) {
        return false;
      }

      return this.matchAlgorithm.isMatch(userProfile, candidateProfile);
    });

    return matches.map(toUserProfileDTO);
  }
}
