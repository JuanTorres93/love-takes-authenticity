import { getGetters } from '../../src/application-layer/dtos/__tests__/_getGettersUtil';
import { UserProfile } from '../../src/domain/entities/userprofile/UserProfile';
import { userProfileTestCreateProps } from '../createEntitiesTest/userProfileCreate';

const sampleUserProfile = UserProfile.create({
  ...userProfileTestCreateProps,
});

const allUserProfileGetters = getGetters(sampleUserProfile);

export const userProfileDTOProperties = [...allUserProfileGetters];
