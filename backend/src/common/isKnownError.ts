import { isApplicationError } from '../application-layer/common/applicationErrors';
import { isDomainError } from '../domain/common/domainErrors';

export function isKnownError(error: Error): boolean {
  return isDomainError(error) || isApplicationError(error);
}
