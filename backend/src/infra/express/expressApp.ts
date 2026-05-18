import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import usersRoutes from './routes/usersRoutes';

const expressApp = express();

expressApp.use(express.json());
expressApp.use(cors());

if (process.env.NODE_ENV !== 'test') expressApp.use(morgan('short'));

expressApp.use('/users', usersRoutes);

export default expressApp;
