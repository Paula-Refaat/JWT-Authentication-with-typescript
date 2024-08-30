import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import RateLimit, { rateLimit } from 'express-rate-limit';
import errorMiddleware from './middlewares/error.middleware';

const PORT = 3000;

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

app.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World', data: req.body });
});

app.get('/', (req: Request, res: Response) => {
  throw new Error('error exits');
  res.json({ message: 'Hello World' });
});

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
