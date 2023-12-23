import express, { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import httpStatus from 'http-status';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1', router)

const test: RequestHandler =(req, res) =>{
  const a = 10;
  res.status(httpStatus.OK).json({
    data: a
  })
}

app.get('/test', test);



app.get('/', (req: Request, res: Response) => {
  res.send('PH University');
});

app.use(globalErrorHandler);

app.use(notFound)

export default app;
