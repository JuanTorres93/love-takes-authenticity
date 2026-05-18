import dotenv from 'dotenv';
import { createServer } from 'http';

import expressApp from './express/expressApp';
import { createSocketIoApp } from './socket.io/socketIoApp';

dotenv.config();

const port = process.env.PORT || 3000;

const httpServer = createServer(expressApp);

export const io = createSocketIoApp(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
