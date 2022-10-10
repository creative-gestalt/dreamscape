export interface Dream {
  _id?: string;
  date: string;
  dreams: SubDream[];
  keywords: string[];
}

export interface SubDream {
  subDream: string;
  time: string;
}

export interface DreamDate {
  _id?: string;
  date: string;
}
