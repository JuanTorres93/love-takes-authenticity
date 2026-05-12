import { ValidationDomainError } from '../../common/domainErrors';
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
    if (!props.birthDate) throw new ValidationDomainError('UserProfile: birthDate is required');

    const entityProps: UserProfileProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),

      name: Text.create(props.name, userProfileNameTextOptions),
      bio: Text.create(props.bio, userProfileBioTextOptions),

      imagesUrls: props.imagesUrls.map((url) => Text.create(url, userProfileImageUrlTextOptions)),

      corePersonalValues: props.corePersonalValues.map((value) => CorePersonalValue.create(value)),

      birthDate: DomainDate.create(props.birthDate),

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new UserProfile(entityProps);
  }

  toCreateProps(): UserProfileCreateProps {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      bio: this.bio,
      imagesUrls: this.imagesUrls,
      corePersonalValues: this.corePersonalValues,
      birthDate: this.birthDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
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

  get birthDate() {
    return this.props.birthDate.value;
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

  birthDate: Date;

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

  birthDate: DomainDate;

  createdAt: DomainDate;
  updatedAt: DomainDate;
};
