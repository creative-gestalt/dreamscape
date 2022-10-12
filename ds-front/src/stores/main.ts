import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { Settings } from "@/interfaces/settings.interface";
import { sleep } from "@/utils/constants";
import { server } from "@/utils/server";
import axios from "axios";

export const useMainStore = defineStore(
  "main",
  () => {
    let settings = reactive({
      colors: {
        topBarColor: "#333333",
        backgroundColor: "#111111",
        iconColor: "#000000",
        textColor: "#fff",
        completeBtnColor: "#007707",
      },
    } as Settings);
    const loading = ref(false);

    const gColors = computed(() => settings.colors);

    function gDate(): string {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(now.getTime() - offsetMs);
      return dateLocal.toISOString();
    }
    async function reset(): Promise<void> {
      settings = {
        _id: settings._id,
        colors: {
          topBarColor: "#333333",
          backgroundColor: "#111111",
          iconColor: "#000000",
          textColor: "#fff",
          completeBtnColor: "#007707",
        },
      };
    }
    async function getSettings(): Promise<void> {
      const result = (await axios.get(`${server.baseURL}/getSettings`)).data;
      if (result) settings = result;
    }
    async function updateSettings(): Promise<void> {
      if (!settings._id) {
        settings = (
          await axios.post(`${server.baseURL}/createSettings`, settings)
        ).data;
      } else {
        settings = (
          await axios.put(
            `${server.baseURL}/updateSettings/${settings._id}`,
            settings
          )
        ).data;
      }
    }
    async function updateLoading(payload: boolean): Promise<void> {
      if (payload) {
        loading.value = payload;
      } else {
        loading.value = payload;
      }
      return sleep(750);
    }

    return {
      settings,
      loading,
      gColors,
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
