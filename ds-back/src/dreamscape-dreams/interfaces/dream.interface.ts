import { Document } from 'mongoose';

export interface Dream extends Document {
  readonly date: string;
  readonly dreams: Record<string, string>[];
  readonly keywords: string[];
}
