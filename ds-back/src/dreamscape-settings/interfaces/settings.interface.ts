import { Document } from 'mongoose';

export interface Settings extends Document {
  readonly colors: {
    readonly topBarColor: string;
    readonly backgroundColor: string;
    readonly iconColor: string;
    readonly textColor: string;
    readonly completeBtnColor: string;
  };
}
