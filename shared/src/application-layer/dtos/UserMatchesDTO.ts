export type UserMatchesDTO = {
  id: string;

  userId: string;

  currentlyMatchedUserIds: string[];
  unmatchedUserIds: string[];
  blockedUserIds: string[];

  createdAt: Date;
  updatedAt: Date;
};
