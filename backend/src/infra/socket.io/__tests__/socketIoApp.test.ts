import { createServer } from 'http';
import { AddressInfo } from 'net';
import { Socket, io as clientIo } from 'socket.io-client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createEmptyTestConversationAndUsers } from '../../../../tests/createCombinedEntities/createEmptyTestConversationAndUsers';
import { SendMessageUsecaseRequest } from '../../../application-layer/use-cases/SendMessageUsecase/SendMessageUsecase';
import { AppConversationsRepo } from '../../../interface-adapters/repos/AppConversationsRepo';
import { AppUsersRepo } from '../../../interface-adapters/repos/AppUsersRepo';
import { createSocketIoApp } from '../socketIoApp';

const ASSIGN_AUTOMATIC_FREE_PORT = 0;

describe('socketIoApp', () => {
  let assignedPort: number;
  let clientSocket: Socket;

  let validRequest: SendMessageUsecaseRequest;

  beforeAll(async () => {
    const httpServer = createServer();
    createSocketIoApp(httpServer);

    // Run the server on an automatically assigned free port and listen for connections
    await new Promise<void>((resolve) => httpServer.listen(ASSIGN_AUTOMATIC_FREE_PORT, resolve));
    assignedPort = (httpServer.address() as AddressInfo).port;

    // Connect the client socket to the server
    clientSocket = clientIo(`http://localhost:${assignedPort}`);
    await new Promise<void>((resolve) => clientSocket.on('connect', resolve));

    // Seed data
    AppUsersRepo.clearAllForTesting();
    AppConversationsRepo.clearAllForTesting();

    const { conversation, user, anotherUser } = createEmptyTestConversationAndUsers();

    await AppUsersRepo.save(user);
    await AppUsersRepo.save(anotherUser);
    await AppConversationsRepo.save(conversation);

    validRequest = {
      senderId: user.id,
      conversationId: conversation.id,
      content: 'Hello, this is a test message!',
    };
  });

  afterAll(() => {
    clientSocket.disconnect();
  });

  it('should connect successfully', () => {
    expect(clientSocket.connected).toBe(true);
  });

  it('should send a message to a conversation', async () => {
    // Listen for the message on the client side
    const messagePromise = new Promise<string>((resolve) => {
      clientSocket.on('message', (message: string) => {
        resolve(message);
      });
    });

    // Emit a message from the client to the server
    clientSocket.emit('sendMessage', validRequest);

    // Wait for the message to be received and assert it
    const receivedMessage = await messagePromise;
    expect(receivedMessage).toBe(validRequest.content);
  });
});
