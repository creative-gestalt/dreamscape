<script lang="ts" setup>
import DataTable from "@/components/shared/DataTable.vue";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { Dream } from "@/interfaces/dream.interface";
import { sleep } from "@/utils/constants";
import { useRouter } from "vue-router";

// router
const router = useRouter();
// stores
const mainStore = useMainStore();
const dreamStore = useDreamStore();
const { settings } = storeToRefs(mainStore);
const { updateLoading } = mainStore;
const { getDreamsForPage, searchDreams } = dreamStore;
const { dreams, dreamsCount } = storeToRefs(dreamStore);
// data
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const perPage = ref([10, 15, 20]);
const headers = [{ name: "Date", visible: false }];
// computed
const compPages = computed(() =>
  Math.ceil(dreamsCount.value / itemsPerPage.value)
);
// watcher
watch(search, async (newSearch) => {
  if (newSearch) {
    await searchDreams(newSearch);
  } else {
    await dreamsForPage(1);
  }
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
  await getDreamsForPage({
    skip,
    limit: itemsPerPage.value,
  });
  await updateLoading(false);
}

onMounted(async () => {
  if (dreamsCount.value === 0) {
    await dreamsForPage(1);
  }
});
</script>

<template>
  <v-card class="ma-4" max-width="800" :color="settings.colors.topBarColor">
    <DataTable
      :items="dreams"
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
