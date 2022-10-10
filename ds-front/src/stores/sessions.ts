import { defineStore } from "pinia";
import { Session } from "@/interfaces/session.interface";
import { server } from "@/utils/server";
import axios from "axios";

export const useSessionStore = defineStore("sessions", {
  state: () => ({
    limit: 40,
    sessions: [] as Session[],
    currentTab: 0,
  }),
  getters: {
    gSessions: (state): Session[] => state.sessions,
    gCurrentTab: (state): number => state.currentTab,
  },
  actions: {
    async getAllSessions(): Promise<void> {
      await axios
        .get(`${server.baseURL}/getSessions/0-${this.limit}`)
        .then((data) => (this.sessions = data.data));
    },
    async loadMoreSessions(payload: Record<string, number>): Promise<void> {
      await axios
        .get(`${server.baseURL}/getSessions/${payload.skip}-${payload.limit}`)
        .then((data) => {
          for (let i = 0, n = data.data.length; i < n; i++) {
            this.sessions.push(data.data[i]);
          }
        });
    },
    async getSession(payload: Session): Promise<Session> {
      return await axios
        .get(`${server.baseURL}/getSession/${payload._id}`)
        .then((result) => result.data);
    },
    async addSession(payload: Session): Promise<void> {
      await axios.post(`${server.baseURL}/addSession`, payload);
    },
    async updateSession(payload: Session): Promise<void> {
      return await axios.put(
        `${server.baseURL}/updateSession?sessionID=${payload._id}`,
        payload
      );
    },
    async deleteSessions(payload: Session[]): Promise<void> {
      await axios.post(`${server.baseURL}/deleteSessions`, payload);
    },
    async updateCurrentTab(payload: number): Promise<void> {
      this.currentTab = payload;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
