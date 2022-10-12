import { ref } from "vue";
import { defineStore } from "pinia";
import { Pagination } from "@/interfaces/state.interface";
import { Dream, DreamDate } from "@/interfaces/dream.interface";
import { server } from "@/utils/server";
import axios from "axios";

export const useDreamStore = defineStore(
  "dreams",
  () => {
    const limit = ref(40);
    const dreams = ref([] as Dream[]);
    const dates = ref([] as DreamDate[]);
    const dreamsCount = ref(0);
    const currentTab = ref(0);

    async function getDreamsCount(): Promise<void> {
      await axios
        .get(`${server.baseURL}/getDreamsCount`)
        .then((data) => (dreamsCount.value = data.data));
    }
    async function getDreamsForPage(payload: Pagination): Promise<void> {
      await axios
        .get(`${server.baseURL}/getDreams/${payload.skip}-${payload.limit}`)
        .then((data) => (dreams.value = data.data));
    }
    async function getDream(payload: Dream): Promise<Dream> {
      return await axios
        .get(`${server.baseURL}/getDream/${payload._id}`)
        .then((result) => result.data);
    }
    async function searchDreams(payload: string): Promise<void> {
      await axios
        .get(`${server.baseURL}/searchDreams?target=${payload}`)
        .then((result) => {
          dreamsCount.value = result.data.count;
          dreams.value = result.data.dreams;
        });
    }
    async function addDream(payload: Dream): Promise<void> {
      await axios.post(`${server.baseURL}/addDream`, payload);
    }
    async function updateDream(payload: Dream): Promise<void> {
      return await axios.put(
        `${server.baseURL}/updateDream?dreamID=${payload._id}`,
        payload
      );
    }
    async function deleteDreams(payload: Dream[]): Promise<void> {
      await axios.post(`${server.baseURL}/deleteDreams`, payload);
    }
    async function getDreamDates(): Promise<void> {
      await axios
        .get(`${server.baseURL}/getDreamDates`)
        .then((result) => (dates.value = result.data));
    }

    return {
      limit,
      dreams,
      dates,
      dreamsCount,
      currentTab,
      getDreamsCount,
      getDreamsForPage,
      getDream,
      searchDreams,
      addDream,
      updateDream,
      deleteDreams,
      getDreamDates,
    };
  },
  { persist: { storage: sessionStorage } }
);
