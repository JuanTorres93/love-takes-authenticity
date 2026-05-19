import { UserDTO } from 'shared';

import { createTestUser } from '../../../../tests/createEntitiesTest/userCreate';
import { userDTOProperties } from '../../../../tests/dtoProperties/userDtoProperties';
import { User } from '../../../domain/entities/user/User';
import { toUserDTO } from '../UserDTO';

describe('UserDTO', () => {
  let user: User;
  let userDTO: UserDTO;

  beforeEach(() => {
    user = createTestUser();
  });

  describe('toUserDTO', () => {
    beforeEach(() => {
      userDTO = toUserDTO(user);
    });

    it('should have a prop for each user getter except hashedPassword', async () => {
      for (const getter of userDTOProperties) {
        expect(userDTO).toHaveProperty(getter);
      }

      // Ensure password is not included in the DTO
      expect(userDTO).not.toHaveProperty('hashedPassword');
      expect(userDTO).not.toHaveProperty('password');

      // no properties that contain "pass"
      for (const key in userDTO) {
        expect(key.toLowerCase()).not.toContain('pass');
      }
    });

    it('should convert dates to ISO 8601 strings', () => {
      expect(typeof userDTO.createdAt).toBe('string');
      expect(typeof userDTO.updatedAt).toBe('string');
      expect(() => new Date(userDTO.createdAt)).not.toThrow();
      expect(() => new Date(userDTO.updatedAt)).not.toThrow();
    });
  });
});
