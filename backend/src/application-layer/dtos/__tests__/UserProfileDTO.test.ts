import { createTestUserProfile } from '../../../../tests/createEntitiesTest/userProfileCreate';
import { userProfileDTOProperties } from '../../../../tests/dtoProperties/userProfileDtoProperties';
import { UserProfile } from '../../../domain/entities/userprofile/UserProfile';
import { UserProfileDTO, toUserProfileDTO } from '../UserProfileDTO';

describe('UserProfileDTO', () => {
  let userProfile: UserProfile;
  let userProfileDTO: UserProfileDTO;

  beforeEach(() => {
    userProfile = createTestUserProfile();
  });

  describe('toUserDTO', () => {
    beforeEach(() => {
      userProfileDTO = toUserProfileDTO(userProfile);
    });

    it('should have a prop for each UserProfile getter', async () => {
      for (const getter of userProfileDTOProperties) {
        expect(userProfileDTO).toHaveProperty(getter);
      }
    });

    it('should convert dates to ISO 8601 strings', () => {
      expect(typeof userProfileDTO.createdAt).toBe('string');
      expect(typeof userProfileDTO.updatedAt).toBe('string');
      expect(() => new Date(userProfileDTO.createdAt)).not.toThrow();
      expect(() => new Date(userProfileDTO.updatedAt)).not.toThrow();
    });
  });
});
