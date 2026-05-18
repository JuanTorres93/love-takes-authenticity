import request from 'supertest';

import expressApp from '../../expressApp';

describe('Users Routes', () => {
  describe('GET /users', () => {
    it('should return status 200', async () => {
      const response = await request(expressApp).get('/users');

      expect(response.status).toBe(200);
    });
  });
});
