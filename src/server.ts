process.on ('uncaughtException', err =>
{
    console.log ('UNCAUGHT EXCEPTION. SHUTTING DOWN...');

    console.error (err);

    process.exit (1);
});

require ('dotenv').config ({path:'./config.env'})
import app from './app';
import mongoose from 'mongoose';

mongoose.connect (process.env.DATABASE!.replace ('<PASSWORD>', process.env.DATABASE_PASSWORD!)).then (() => console.log ('Mongoose connected.'));

const port = process.env.PORT || 3000;
const server = app.listen (port, () => console.log ('App listening on port ', port));


process.on ('unhandledRejection', err =>
{
    console.log ('UNHANDLED REJECTION. SHUTTING DOWN...');

    console.error (err);

    server.close (() => process.exit (1));
});