import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { Colors, Settings } from "@/interfaces/settings.interface";
import { sleep } from "@/utils/constants";
import { server } from "@/utils/server";
import axios from "axios";
export const useMainStore = defineStore(
  "main",
  () => {
    const settings = reactive({
      colors: {
        // topBarColor: "#222222",
        // backgroundColor: "#111111",
        iconColor: "#00bcd4",
        textColor: "#e91e63",
        completeBtnColor: "#9c27b0",
      },
    } as Settings);
    const loading = ref(false);
    const refreshDreamList = ref(0);

    function mstDate(): string {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(now.getTime() - offsetMs);
      return dateLocal.toISOString();
    }
    async function reset(): Promise<void> {
      settings.colors = {
        // topBarColor: "#222222",
        // backgroundColor: "#111111",
        iconColor: "#00bcd4",
        textColor: "#e91e63",
        completeBtnColor: "#9c27b0",
      } as Colors;
      await updateSettings("iconColor", "#00bcd4");
      await updateSettings("textColor", "#e91e63");
      await updateSettings("completeBtnColor", "#9c27b0");
    }
    async function getSettings(): Promise<void> {
      const result = (await axios.get(`${server.baseURL}/getSettings`)).data;
      if (result) {
        settings._id = result._id;
        settings.colors = result.colors;
      } else {
        settings.colors = (
          await axios.post(`${server.baseURL}/createSettings`, settings)
        ).data.colors;
      }
    }
    async function updateSettings(
      attribute: string,
      value: string,
    ): Promise<void> {
      settings.colors[attribute as keyof Colors] = value;
      settings.colors = (
        await axios.put(
          `${server.baseURL}/updateSettings/${settings._id}`,
          settings,
        )
      ).data.colors;
    }
    async function updateLoading(payload: boolean): Promise<void> {
      loading.value = payload;
      return sleep(500);
    }

    return {
      settings,
      loading,
      refreshDreamList,
      mstDate,
      reset,
      getSettings,
      updateSettings,
      updateLoading,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
);