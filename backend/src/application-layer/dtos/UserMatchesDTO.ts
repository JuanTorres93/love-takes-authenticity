import { UserMatchesDTO } from 'shared';

import { UserMatches } from '../../domain/entities/usermatches/UserMatches';

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
