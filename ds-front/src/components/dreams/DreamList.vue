<script lang="ts" setup>
import DataTable from "@/components/shared/DataTable.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useDreamStore } from "@/stores/dreams";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { Dream } from "@/interfaces/dream.interface";
import { sleep } from "@/utils/constants";
import { useRouter } from "vue-router";
import { server } from "@/utils/server";
import axios from "axios";

// router
const router = useRouter();
// stores
const dreamStore = useDreamStore();
const { setTodaysDream } = dreamStore;
const mainStore = useMainStore();
const { settings, refreshDreamList } = storeToRefs(mainStore);
const { updateLoading } = mainStore;
// data
const dreams = ref([] as Dream[]);
const dreamsCount = ref(0);
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const perPage = ref([10, 15, 20]);
const headers = [{ name: "Date", visible: false }];
// computed
const computedDreams = computed(() => dreams.value);
const compPages = computed(() =>
  Math.ceil(dreamsCount.value / itemsPerPage.value)
);
// watchers
watch(search, async (newSearch) => {
  if (newSearch) {
    await searchDreams(newSearch);
  } else {
    await dreamsForPage(1);
  }
});
watch(refreshDreamList, () => {
  dreamsForPage(1);
});
// methods
function handleClick(dream: Dream): void {
  router.push(`/dream/${dream._id}/view`);
}
function formatDreamDate(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
async function dreamsForPage(pageNumber: number): Promise<void> {
  await updateLoading(true);
  await sleep(250);
  currentPage.value = pageNumber;
  const skip = (pageNumber - 1) * itemsPerPage.value;
  await axios
    .get(`${server.baseURL}/getDreams/${skip}-${itemsPerPage.value}`)
    .then((data) => {
      dreams.value = data.data.dreams;
      dreamsCount.value = data.data.count;
    });
  await updateLoading(false);
}

async function searchDreams(payload: string): Promise<void> {
  await axios
    .get(`${server.baseURL}/searchDreams?target=${payload}`)
    .then((result) => {
      dreamsCount.value = result.data.count;
      dreams.value = result.data.dreams;
    });
}

onMounted(async () => {
  if (dreamsCount.value === 0) {
    await dreamsForPage(1);
    await setTodaysDream(dreams.value[0]);
  }
});
</script>

<template>
  <v-card class="ma-4" max-width="800" :color="settings.colors.topBarColor">
    <DataTable
      :items="computedDreams"
      :headers="headers"
      :items-per-page="itemsPerPage"
      @click:row="handleClick"
      :bg-color="settings.colors.topBarColor"
    >
      <template #search>
        <v-row class="pa-4">
          <v-text-field
            v-model="search"
            append-inner-icon="mdi-magnify"
            label="Search"
            @click:clear="dreamsForPage(1)"
            density="compact"
            single-line
            hide-details
            clearable
          ></v-text-field>
          <v-select
            v-model="itemsPerPage"
            @change="dreamsForPage(1)"
            :items="perPage"
            class="ml-1"
            style="max-width: 75px"
            density="compact"
            hide-details
          >
          </v-select>
        </v-row>
      </template>
      <template #item="{ item }">
        <div :style="{ color: settings.colors.textColor }">
          <v-list-item class="px-0" density="compact" link>
            <template #prepend>
              <v-avatar class="mx-0 ml-n3">{{ item.dreams.length }}</v-avatar>
            </template>
            <template #title>
              <span :style="{ color: settings.colors.textColor }">
                {{ formatDreamDate(item.date) }}
              </span>
            </template>
            <template #subtitle>
              <span
                class="single-line__text"
                :style="{ color: settings.colors.textColor }"
              >
                {{ item.dreams[0].subDream }}
              </span>
            </template>
          </v-list-item>
        </div>
      </template>
    </DataTable>
    <v-pagination
      :model-value="currentPage"
      @update:modelValue="dreamsForPage"
      :length="compPages"
      :active-color="settings.colors.completeBtnColor"
      density="comfortable"
      variant="elevated"
    >
    </v-pagination>
  </v-card>
</template>

<style lang="scss">
.text-start {
  max-width: 5px;
}
.v-pagination__item {
  opacity: 0.6;
}
.v-list-item__prepend {
  padding-left: 0;
}
</style>
