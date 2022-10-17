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
      _id: "",
      colors: {
        topBarColor: "#333333",
        backgroundColor: "#111111",
        iconColor: "#000000",
        textColor: "#fff",
        completeBtnColor: "#007707",
      },
    } as Settings);
    const loading = ref(false);

    function gDate(): string {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(now.getTime() - offsetMs);
      return dateLocal.toISOString();
    }
    async function reset(): Promise<void> {
      settings.colors = {
        topBarColor: "#333333",
        backgroundColor: "#111111",
        iconColor: "#000000",
        textColor: "#fff",
        completeBtnColor: "#007707",
      } as Colors;
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
      value: string
    ): Promise<void> {
      settings.colors[attribute as keyof Colors] = value;
      settings.colors = (
        await axios.put(
          `${server.baseURL}/updateSettings/${settings._id}`,
          settings
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
      gDate,
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
  }
);
