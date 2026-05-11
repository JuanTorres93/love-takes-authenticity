import { userProfileTestCreateProps } from '../../../../../tests/createEntitiesTest/userProfileCreate';
import { UserProfile, UserProfileCreateProps } from '../UserProfile';

describe('UserProfile', () => {
  let userProfile: UserProfile;
  let validUserProfileProps: UserProfileCreateProps;

  beforeEach(() => {
    validUserProfileProps = {
      ...userProfileTestCreateProps,
    };
    userProfile = UserProfile.create(validUserProfileProps);
  });

  it('should create a valid userProfile', () => {
    expect(userProfile).toBeInstanceOf(UserProfile);
  });

  describe('Properties', () => {
    it('should have a valid id', async () => {
      expect(userProfile.id).not.toBe(undefined);

      expect(userProfile.id).toBe(validUserProfileProps.id);
    });

    it('should have a valid userId', async () => {
      expect(userProfile.userId).not.toBe(undefined);

      expect(userProfile.userId).toBe(validUserProfileProps.userId);
    });

    it('should have a valid name', async () => {
      expect(userProfile.name).not.toBe(undefined);

      expect(userProfile.name).toBe(validUserProfileProps.name);
    });

    it('should have a valid bio', async () => {
      expect(userProfile.bio).not.toBe(undefined);

      expect(userProfile.bio).toBe(validUserProfileProps.bio);
    });

    it('should have an array of imagesUrls', async () => {
      expect(userProfile.imagesUrls).not.toBe(undefined);

      expect(Array.isArray(userProfile.imagesUrls)).toBe(true);

      expect(userProfile.imagesUrls).toStrictEqual(validUserProfileProps.imagesUrls);
    });

    it('should have an array of corePersonalValues', async () => {
      expect(userProfile.corePersonalValues).not.toBe(undefined);

      expect(Array.isArray(userProfile.corePersonalValues)).toBe(true);

      expect(userProfile.corePersonalValues).toStrictEqual(
        validUserProfileProps.corePersonalValues,
      );
    });

    it('should have a valid createdAt', async () => {
      expect(userProfile.createdAt).not.toBe(undefined);

      expect(userProfile.createdAt).toEqual(validUserProfileProps.createdAt);
    });

    it('should have a valid updatedAt', async () => {
      expect(userProfile.updatedAt).not.toBe(undefined);

      expect(userProfile.updatedAt).toEqual(validUserProfileProps.updatedAt);
    });
  });
});
