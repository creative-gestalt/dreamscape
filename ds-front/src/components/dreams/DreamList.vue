<script lang="ts" setup>
import DataTable from "@/components/shared/DataTable.vue";
import router from "@/router";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { Dream } from "@/interfaces/dream.interface";
// stores
const mainStore = useMainStore();
const dreamStore = useDreamStore();
// data
const { gColors } = storeToRefs(mainStore);
const { gDreams, dreamsCount } = storeToRefs(dreamStore);
const { updateLoading } = mainStore;
const { getDreamsForPage, getDreamsCount } = dreamStore;
const search = ref("");
const currentPage = ref(0);
const itemsPerPage = ref(8);
const perPage = ref([8, 10, 15, 20]);
const headers = [{ name: "Date", visible: false }];
// computed
const compPages = computed(() =>
  Math.ceil(dreamsCount.value / itemsPerPage.value)
);
// methods
function handleClick(dream: Dream): void {
  console.log(dream);
  // router.push(`/dream/${dream._id}`);
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
    await getDreamsCount();
  }
});
</script>

<template>
  <v-card class="ma-2 ma-auto" max-width="800" :color="gColors.topBarColor">
    <v-card-title class="ma-0 pa-1 pb-0">
      <v-row>
        <v-col class="pr-0" cols="9">
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
        </v-col>
        <v-col class="pl-1">
          <v-select
            v-model="itemsPerPage"
            :items="perPage"
            class="ml-1"
            style="max-width: 75px"
            density="compact"
            hide-details
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-title>
    <DataTable
      :items="gDreams"
      :headers="headers"
      :style="{ backgroundColor: gColors.topBarColor }"
      item-key="_id"
      @click:row="handleClick"
      dense
    >
      <template #item="{ item }">
        <div :style="{ color: gColors.textColor }">
          <v-list-item
            :append-avatar="String(item.dreams.length)"
            :title="formatDreamDate(item.date)"
            density="compact"
            link
          >
            <v-list-item-subtitle>
              {{ item.dreams[0].subDream }}
            </v-list-item-subtitle>
          </v-list-item>
        </div>
      </template>
    </DataTable>
    <v-pagination
      v-model="currentPage"
      :length="compPages"
      @input="dreamsForPage"
      :color="gColors.completeBtnColor"
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
</style>
