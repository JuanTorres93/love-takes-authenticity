import { TextOptions } from '../../value-objects/Text/Text';

export const userProfileNameTextOptions: TextOptions = {
  canBeEmpty: false,
  maxLength: 100,
};
export const userProfileDescriptionTextOptions: TextOptions = {
  canBeEmpty: true,
  maxLength: 500,
};
export const userProfileImageUrlTextOptions: TextOptions = {
  canBeEmpty: false,
  maxLength: 300,
};
