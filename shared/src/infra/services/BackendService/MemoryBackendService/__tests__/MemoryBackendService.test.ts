import { MemoryBackendService } from '../MemoryBackendService';

describe('MemoryBackendService', () => {
  let backendService: MemoryBackendService;

  beforeEach(() => {
    backendService = new MemoryBackendService();
  });

  it('Placeholder test', async () => {
    expect(true).toBe(true);
  });
});
