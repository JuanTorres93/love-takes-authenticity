import { SocketResponseData } from 'shared';
import { Socket } from 'socket.io';

import { isKnownError } from '../../../common/isKnownError';

export function handleSocketIoErrors(emitWithAckCallback: Function, error: Error): void {
  const response: SocketResponseData<string> = {
    status: 'error',
    data: 'An unexpected error occurred.',
  };

  if (isKnownError(error)) {
    response.data = error.message;
  }

  emitWithAckCallback(response);
}
