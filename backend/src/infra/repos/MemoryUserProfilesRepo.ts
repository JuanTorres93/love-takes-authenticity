import { UserProfile } from '../../domain/entities/userprofile/UserProfile';
import { UserProfilesRepo } from '../../domain/repos/UserProfilesRepo.port';

export class MemoryUserProfilesRepo implements UserProfilesRepo {
  private userProfiles: Map<string, UserProfile> = new Map();

  async save(userProfile: UserProfile): Promise<void> {
    this.userProfiles.set(userProfile.userId, userProfile);
  }

  async getAll() {
    return [...Array.from(this.userProfiles.values())];
  }

  async getByUserId(userId: string) {
    const userProfile = this.userProfiles.get(userId);

    if (!userProfile) {
      return null;
    }

    return UserProfile.create(userProfile.toCreateProps());
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.userProfiles.delete(userId);
  }
}
