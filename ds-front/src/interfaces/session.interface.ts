export interface Session {
  _id?: string;
  date: string;
  session: SessionParts;
  user?: string;
}

export interface SessionParts {
  entity: string;
  qas: QA[];
  time: string;
}

export interface QA {
  question: string;
  answer: string;
}
