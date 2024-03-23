import express from 'express';
const app = express ();
import tourRouter from './routes/tourRoutes';
import globalErrorHandler from './controller/errorController';

app.use (express.json({limit: '10kb'}));


app.use ('/api/v1/tours', tourRouter);


app.use (globalErrorHandler);

export default app;