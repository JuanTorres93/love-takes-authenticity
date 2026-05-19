import { UserProfileDTO } from 'shared';

import { UserProfile } from '../../domain/entities/userprofile/UserProfile';

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
