import { CorePersonalValue } from '../../value-objects/CorePersonalValue/CorePersonalValue';
import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Id } from '../../value-objects/Id/Id';
import { Text } from '../../value-objects/Text/Text';
import {
  userProfileBioTextOptions,
  userProfileImageUrlTextOptions,
  userProfileNameTextOptions,
} from './valueObjectsOptions';

export class UserProfile {
  private constructor(private readonly props: UserProfileProps) {}

  static create(props: UserProfileCreateProps): UserProfile {
    const entityProps: UserProfileProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),

      name: Text.create(props.name, userProfileNameTextOptions),
      bio: Text.create(props.bio, userProfileBioTextOptions),

      imagesUrls: props.imagesUrls.map((url) => Text.create(url, userProfileImageUrlTextOptions)),

      corePersonalValues: props.corePersonalValues.map((value) => CorePersonalValue.create(value)),

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new UserProfile(entityProps);
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get name() {
    return this.props.name.value;
  }

  get bio() {
    return this.props.bio.value;
  }

  get imagesUrls() {
    return this.props.imagesUrls.map((url) => url.value);
  }

  get corePersonalValues() {
    return this.props.corePersonalValues.map((corePersonalValue) => corePersonalValue.value);
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}

export type UserProfileCreateProps = {
  id: string;
  userId: string;

  name: string;
  bio: string;

  imagesUrls: string[];
  corePersonalValues: string[];

  createdAt: Date;
  updatedAt: Date;
};

export type UserProfileProps = {
  id: Id;
  userId: Id;

  name: Text;
  bio: Text;

  imagesUrls: Text[];
  corePersonalValues: CorePersonalValue[];

  createdAt: DomainDate;
  updatedAt: DomainDate;
};
