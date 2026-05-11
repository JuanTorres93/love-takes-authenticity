import { UserProfile } from '../../domain/entities/userprofile/UserProfile';

export type UserProfileDTO = {
  id: string;
  userId: string;

  name: string;
  bio: string;

  imagesUrls: string[];
  corePersonalValues: string[];

  birthDate: string;

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

    birthDate: userProfile.birthDate.toISOString(),

    createdAt: userProfile.createdAt.toISOString(),
    updatedAt: userProfile.updatedAt.toISOString(),
  };
}
