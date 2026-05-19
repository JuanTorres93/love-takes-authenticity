import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import expressApp from './expressApp';

dotenv.config();

const port = process.env.PORT;

const httpServer = createServer(expressApp);

export const io = new Server(httpServer, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
