import { ApplicationBackendService } from '../ApplicationBackendService';

describe('ApplicationBackendService', () => {
  let backendService: ApplicationBackendService;

  beforeEach(() => {
    backendService = new ApplicationBackendService();
  });

  it('should send message', async () => {
    await backendService.sendMessage('senderId', 'conversationId', 'Hello, World!');
  });
});
