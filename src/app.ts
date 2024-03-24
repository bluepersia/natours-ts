import express from 'express';
const app = express ();
import cookies from 'cookie-parser';
import tourRouter from './routes/tourRoutes';
import globalErrorHandler from './controller/errorController';
import AppError from './util/AppError';

app.use (cookies ());

app.use (express.json({limit: '10kb'}));


app.use ('/api/v1/tours', tourRouter);


app.all ('*', () => {throw new AppError ('Route not found!', 404)});

app.use (globalErrorHandler);

export default app;