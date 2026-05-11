import {
  UserProfile,
  UserProfileCreateProps,
} from '../../src/domain/entities/userprofile/UserProfile';
import { allCorePersonalValues } from '../../src/domain/value-objects/CorePersonalValue/ValidCorePersonalValues';
import { testUserId } from './userCreate';

export const userProfileTestCreateProps: UserProfileCreateProps = {
  id: 'userProfile-id',
  userId: testUserId,

  name: 'Test User',
  bio: 'This is a test user profile',

  imagesUrls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  corePersonalValues: allCorePersonalValues.slice(0, 3),

  birthDate: new Date('1990-01-01'),

  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestUserProfile(
  overrideProps: Partial<UserProfileCreateProps> = {},
): UserProfile {
  const props = { ...userProfileTestCreateProps, ...overrideProps };

  return UserProfile.create(props);
}
