import * as mongoose from 'mongoose';

export const SettingsSchema = new mongoose.Schema({
  colors: {
    topBarColor: String,
    backgroundColor: String,
    iconColor: String,
    textColor: String,
    completeBtnColor: String,
  },
});
