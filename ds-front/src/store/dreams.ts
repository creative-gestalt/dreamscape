import { ref } from "vue";
import { defineStore } from "pinia";
import { Dream, DreamDate } from "@/interfaces/dream.interface";
import { server } from "@/utils/server";
import axios from "axios";

export const useDreamStore = defineStore(
  "dreams",
  () => {
    const limit = ref(40);
    const todaysDream = ref({} as Dream);
    const dates = ref([] as DreamDate[]);
    const years = ref([] as string[]);
    const dreamsCount = ref(0);
    const currentTab = ref(0);

    async function getDreamsCount(): Promise<void> {
      await axios.get(`${server.baseURL}/getDreamsCount`).then((data) => {
        dreamsCount.value = data.data.count;
        years.value = data.data.years;
      });
    }
    async function setTodaysDream(payload: Dream): Promise<void> {
      todaysDream.value = payload;
    }
    async function getDreamDates(year: string): Promise<void> {
      await axios
        .get(`${server.baseURL}/getDreamDates/${year}`)
        .then((result) => (dates.value = result.data));
    }

    return {
      limit,
      todaysDream,
      dates,
      years,
      dreamsCount,
      currentTab,
      getDreamsCount,
      getDreamDates,
      setTodaysDream,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
);
