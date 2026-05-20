import { ApplicationBackendService } from '../ApplicationBackendService';

describe('ApplicationBackendService', () => {
  let backendService: ApplicationBackendService;

  beforeEach(() => {
    backendService = new ApplicationBackendService();
  });

  it('should return socket response data', async () => {
    const response = await backendService.sendMessage(
      'senderId',
      'conversationId',
      'Hello, World!',
    );

    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('data');
  });
});
