import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  console.log('GET /users');

  res.send('GET /users');
});

export default router;
