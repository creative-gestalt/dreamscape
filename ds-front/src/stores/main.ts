import { defineStore } from "pinia";
import { Settings } from "@/interfaces/settings.interface";
import { sleep } from "@/utils/constants";
import { server } from "@/utils/server";
import axios from "axios";
import { computed, ref } from "vue";

export const useMainStore = defineStore(
  "main",
  () => {
    const settings = ref({
      colors: {
        topBarColor: "#333333",
        backgroundColor: "#111111",
        iconColor: "#000000",
        textColor: "#fff",
        completeBtnColor: "#007707",
      },
    } as Settings);
    const loading = ref(false);

    const gSettings = computed(() => settings.value);
    const gColors = computed(() => settings.value.colors);
    const gLoading = computed(() => loading.value);

    function gDate(): string {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const dateLocal = new Date(now.getTime() - offsetMs);
      return dateLocal.toISOString();
    }
    async function reset(): Promise<void> {
      settings.value = {
        _id: settings.value._id,
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
      if (result) settings.value = result;
    }
    async function updateSettings(): Promise<void> {
      if (!settings.value._id) {
        settings.value = (
          await axios.post(`${server.baseURL}/createSettings`, settings.value)
        ).data;
      } else {
        settings.value = (
          await axios.put(
            `${server.baseURL}/updateSettings/${settings.value._id}`,
            settings.value
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
      gSettings,
      gColors,
      gLoading,
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
