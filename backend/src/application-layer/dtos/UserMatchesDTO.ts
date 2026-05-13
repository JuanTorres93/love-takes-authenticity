import { UserMatches } from '../../domain/entities/usermatches/UserMatches';

export type UserMatchesDTO = {
  id: string;

  userId: string;

  currentlyMatchedUserIds: string[];
  unmatchedUserIds: string[];
  blockedUserIds: string[];

  createdAt: Date;
  updatedAt: Date;
};

export function toUserMatchesDTO(userMatches: UserMatches): UserMatchesDTO {
  return {
    id: userMatches.id,

    userId: userMatches.userId,

    currentlyMatchedUserIds: userMatches.currentlyMatchedUserIds,
    unmatchedUserIds: userMatches.unmatchedUserIds,
    blockedUserIds: userMatches.blockedUserIds,

    createdAt: userMatches.createdAt,
    updatedAt: userMatches.updatedAt,
  };
}
