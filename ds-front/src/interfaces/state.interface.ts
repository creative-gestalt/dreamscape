import { Dream } from "@/interfaces/dream.interface";
import { Settings } from "@/interfaces/settings.interface";
import { Session } from "@/interfaces/session.interface";

export interface State {
  limit: number;
  dreams: Dream[];
  dreamsCount: number;
  dates: string[];
  sessions: Session[];
  settings: Settings;
  loading: boolean;
  currentTab: number;
}

export interface Pagination {
  skip: number;
  limit: number;
}
