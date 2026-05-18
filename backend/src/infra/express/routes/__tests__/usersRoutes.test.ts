import request from 'supertest';

import app from '../../app';

describe('Users Routes', () => {
  describe('GET /users', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
    });
  });
});
