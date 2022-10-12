import { ref } from "vue";
import { defineStore } from "pinia";
import { Session } from "@/interfaces/session.interface";
import { server } from "@/utils/server";
import axios from "axios";

export const useSessionStore = defineStore(
  "sessions",
  () => {
    const limit = ref(40);
    const sessions = ref([] as Session[]);
    const currentTab = ref(0);

    async function getAllSessions(): Promise<void> {
      await axios
        .get(`${server.baseURL}/getSessions/0-${limit.value}`)
        .then((data) => (sessions.value = data.data));
    }
    async function loadMoreSessions(
      payload: Record<string, number>
    ): Promise<void> {
      await axios
        .get(`${server.baseURL}/getSessions/${payload.skip}-${payload.limit}`)
        .then((data) => {
          for (let i = 0, n = data.data.length; i < n; i++) {
            sessions.value.push(data.data[i]);
          }
        });
    }
    async function getSession(payload: Session): Promise<Session> {
      return await axios
        .get(`${server.baseURL}/getSession/${payload._id}`)
        .then((result) => result.data);
    }
    async function addSession(payload: Session): Promise<void> {
      await axios.post(`${server.baseURL}/addSession`, payload);
    }
    async function updateSession(payload: Session): Promise<void> {
      return await axios.put(
        `${server.baseURL}/updateSession?sessionID=${payload._id}`,
        payload
      );
    }
    async function deleteSessions(payload: Session[]): Promise<void> {
      await axios.post(`${server.baseURL}/deleteSessions`, payload);
    }

    return {
      limit,
      sessions,
      currentTab,
      getAllSessions,
      loadMoreSessions,
      getSession,
      addSession,
      updateSession,
      deleteSessions,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
