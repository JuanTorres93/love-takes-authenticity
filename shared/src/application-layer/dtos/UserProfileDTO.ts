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
