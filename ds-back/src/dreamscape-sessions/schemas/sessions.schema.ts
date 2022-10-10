import * as mongoose from 'mongoose';

export const SessionsSchema = new mongoose.Schema({
  date: String,
  session: Object,
});
