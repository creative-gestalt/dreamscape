<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { useDreamStore } from "@/stores/dreams";
import { DreamDate } from "@/interfaces/dream.interface";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";

// router
const router = useRouter();
// stores
const mainStore = useMainStore();
const dreamStore = useDreamStore();
// const colors = mainStore.gColors;
const { gDate } = mainStore;
const { dreamDates } = storeToRefs(dreamStore);
// data
const mobile = useDisplay().xs.value;
const localDreamDates = ref([] as any[]);
const cols = ref(1);
const year = ref("");

function openDreamView(day: any): void {
  router.push(`/dream/${day.attributes[0].key}`);
}
onMounted(() => {
  cols.value = mobile ? 1 : 4;
  year.value = gDate().slice(0, 4);
  dreamDates.value.map((dreamDate: DreamDate) => {
    localDreamDates.value.push({
      key: dreamDate._id,
      highlight: {
        color: "purple",
        fillMode: "solid",
        contentClass: "italic",
      },
      dates: new Date(dreamDate.date),
      customData: dreamDate,
    });
  });
});
</script>

<template>
  <v-container>
    <v-card class="mb-5">
      <v-card-text>Dream Dates</v-card-text>
    </v-card>
    <v-calendar
      @dayclick="openDreamView"
      :columns="$screens({ lg: 4 }, 1)"
      :rows="$screens({ lg: 3 }, 1)"
      :attributes="localDreamDates"
      is-expanded
    >
    </v-calendar>
  </v-container>
</template>

<style lang="scss">
.v-calendar-daily_head-day-label {
  display: none;
}
</style>
