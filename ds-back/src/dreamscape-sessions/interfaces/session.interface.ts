import { Document } from 'mongoose';

export interface Session extends Document {
  readonly date: string;
  readonly session: Record<string, any>;
}
