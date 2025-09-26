import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import routes from './routes';
import errorMiddleware from './middleware/error.middleware';
import config from './config';
const PORT: Number = parseInt(config.port as string, 10) || 8000;

// create instant from server
const app: Application = express();
app.use(express.json()); // for parsing application/json
app.use(morgan('common'));

app.use(helmet()); // security
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // include rate limit headers in the response (default is false)
    legacyHeaders: false, // disable the `X-RateLimit-*` headers (default is true)
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  }),
);
app.get("/", (req, res) => {
    res.status(200).json({
      message: "DONNNNNNNNNNNNNNNNNNNE"
    });
})
app.use('/api/v1', routes);

// // test db
// db.connect().then((client) => {
//   client
//     .query('SELECT  NOW()')
//     .then((res) => {
//       client.release();
//       console.log(res.rows);
//     })
//     .catch((err) => {
//       client.release();
//       console.log(err.stack);
//     });
// });

app.use(errorMiddleware);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'you are lost , read api doc to find your way back home',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
