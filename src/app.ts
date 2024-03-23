import express from 'express';
const app = express ();
import tourRouter from './routes/tourRoutes';

app.use (express.json({limit: '10kb'}));


app.use ('/api/v1/tours', tourRouter);

export default app;