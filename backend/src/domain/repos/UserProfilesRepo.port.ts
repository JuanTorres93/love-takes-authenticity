import { UserProfile } from '../entities/userprofile/UserProfile';

export interface UserProfilesRepo {
  getAll(): Promise<UserProfile[]>;
  getByUserId(userId: string): Promise<UserProfile | null>;

  save(userProfile: UserProfile): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;
}
