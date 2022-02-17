import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import nodemon from 'nodemon';
import cors from 'cors';
import dotenv from 'dotenv';

import instrumentRoutes from './routes/instrument.js';
import userRoutes from './routes/users.js';


const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

app.use('/instruments', instrumentRoutes);
app.use('/users', userRoutes);

//connect the db:
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));