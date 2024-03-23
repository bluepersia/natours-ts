require ('dotenv').config ({path:'./config.env'})
import app from './app';
import mongoose from 'mongoose';

mongoose.connect (process.env.DATABASE!.replace ('<PASSWORD>', process.env.DATABASE_PASSWORD!)).then (() => console.log ('Mongoose connected.'));

const port = process.env.PORT || 3000;
app.listen (port, () => console.log ('App listening on port ', port));
