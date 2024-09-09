import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import RateLimit, { rateLimit } from 'express-rate-limit';
import errorMiddleware from './middlewares/error.middleware';
import config from './config';
// import db from './database';
import routes from './routes';

const PORT = config.port || 3000;

const app: Application = express();

app.use(express.json());

app.use(morgan('common'));

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later',
  }),
);

app.use('/api/v1', routes);

app.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World', data: req.body });
});

app.get('/', (req: Request, res: Response) => {
  throw new Error('error exits');
  res.json({ message: 'Hello World' });
});

// test db
// db.connect().then((client) => {
//   return client
//     .query('SELECT NOW()')
//     .then((res) => {
//       client.release();
//       console.log('Connected to the database', res.rows[0].now);
//     })
//     .catch((err) => {
//       client.release();
//       console.log(err.sta);
//     });
// });

app.use(errorMiddleware);

// If APIS NotFound
app.use('*', (_req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: 'Ohh, you are lost, read the API docs to find your way' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
