import dotenv   from 'dotenv';
import bluebird from 'bluebird';
import mongoose from 'mongoose';
import Stocks   from './Stocks.model';

dotenv.config();
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGODB_URI);

export const database = mongoose.connection;
export const Stock = Stocks;
