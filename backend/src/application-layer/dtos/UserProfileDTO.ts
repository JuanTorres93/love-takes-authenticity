import { UserProfile } from '../../domain/entities/userprofile/UserProfile';

export type UserProfileDTO = {
  id: string;
  userId: string;

  name: string;
  bio: string;

  imagesUrls: string[];
  corePersonalValues: string[];

  createdAt: string;
  updatedAt: string;
};

export function toUserProfileDTO(userProfile: UserProfile): UserProfileDTO {
  return {
    id: userProfile.id,
    userId: userProfile.userId,

    name: userProfile.name,
    bio: userProfile.bio,

    imagesUrls: userProfile.imagesUrls,
    corePersonalValues: userProfile.corePersonalValues,

    createdAt: userProfile.createdAt.toISOString(),
    updatedAt: userProfile.updatedAt.toISOString(),
  };
}
