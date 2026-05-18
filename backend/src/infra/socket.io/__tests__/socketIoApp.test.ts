import { createServer } from 'http';
import { type AddressInfo } from 'net';
import { type Socket as ClientSocket, io as clientIo } from 'socket.io-client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createSocketIoApp } from '../socketIoApp';

const ASSIGN_AUTOMATIC_FREE_PORT = 0;

describe('socketIoApp', () => {
  let assignedPort: number;
  let clientSocket: ClientSocket;

  beforeAll(async () => {
    const httpServer = createServer();
    createSocketIoApp(httpServer);

    // Run the server on an automatically assigned free port and listen for connections
    await new Promise<void>((resolve) => httpServer.listen(ASSIGN_AUTOMATIC_FREE_PORT, resolve));
    assignedPort = (httpServer.address() as AddressInfo).port;

    // Connect the client socket to the server
    clientSocket = clientIo(`http://localhost:${assignedPort}`);
    await new Promise<void>((resolve) => clientSocket.on('connect', resolve));
  });

  afterAll(() => {
    clientSocket.disconnect();
  });

  it('should connect successfully', () => {
    expect(clientSocket.connected).toBe(true);
  });
});
