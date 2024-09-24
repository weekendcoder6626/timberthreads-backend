// Import the express in typescript file
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import tokenAuth from './middlewares/token-auth';
import mongoose from 'mongoose';
import { authRouter } from './routers/auth.route';

import './database/models/export';
import { userRouter } from './routers/user.route';
import { productRouter } from './routers/product.route';
import { devRouter } from './dev/dev.router';

dotenv.config();
 
// Initialize the express engine
const app: express.Application = express();

const clientOptions: mongoose.ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const database_uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tt.i6762.mongodb.net/?appName=${process.env.MONGO_APPNAME}`;

mongoose.connect(database_uri, clientOptions).then((v) => console.log(`Connected - ${process.env.MONGO_USER}`)).catch(() => console.error("Error!"));

const logger = (req: any, res: any, next: any) => {

    let current_datetime = new Date();

    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();

    let method = req.method;

    let url = req.url;

    let log = `[${formatted_date}] ${method}:${url}`;

    console.log(log);

    next();
};

app.use(cors())

app.use(logger);

app.use(express.json());
 
// middlewares
app.use(tokenAuth);
// app.use(adminAuth);

// API - V1
export const apiV1Router = express.Router();
app.use('/api/v1', apiV1Router);

apiV1Router.use('/auth', authRouter);
apiV1Router.use('/user', userRouter);
apiV1Router.use('/product', productRouter);
apiV1Router.use('/dev', devRouter);

// Server setup
app.listen(process.env.PORT, () => {
    console.log(`TypeScript with Express 
         PORT: ${process.env.PORT}`);
});
