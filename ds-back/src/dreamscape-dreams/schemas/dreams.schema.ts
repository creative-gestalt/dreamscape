import * as mongoose from 'mongoose';

export const DreamsSchema = new mongoose.Schema({
  date: String,
  dreams: Array,
  keywords: Array,
});
