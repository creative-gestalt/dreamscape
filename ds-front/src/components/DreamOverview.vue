<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { useDreamStore } from "@/stores/dreams";
import { DreamDate } from "@/interfaces/dream.interface";
import { useDisplay } from "vuetify";
import router from "@/router";

// stores
const mainStore = useMainStore();
const dreamStore = useDreamStore();
const { gDate } = mainStore;
const { gColors } = storeToRefs(mainStore);
const { gDreamDates, gYears } = storeToRefs(dreamStore);
// data
const mobile = useDisplay().xs;
const value = ref("");
const mode = ref("column");
const modes = ref(["stack", "column"]);
const events = ref([] as any[]);
const cols = ref(12);
const year = ref("");

// computed
const months = computed(() => [
  `${year.value}-01-01`,
  `${year.value}-02-01`,
  `${year.value}-03-01`,
  `${year.value}-04-01`,
  `${year.value}-05-01`,
  `${year.value}-06-01`,
  `${year.value}-07-01`,
  `${year.value}-08-01`,
  `${year.value}-09-01`,
  `${year.value}-10-01`,
  `${year.value}-11-01`,
  `${year.value}-12-01`,
]);
// methods
function openDreamView(event: any): void {
  router.push(`/dream/${event.event.id}`);
}
function getMonthName(dateVal: string) {
  const date = new Date(dateVal);
  if (date.toString() !== "Invalid Date")
    return date.toLocaleString("en-us", { month: "long" });
  else return "December";
}
onMounted(() => {
  cols.value = mobile ? 12 : 6;
  year.value = gDate().slice(0, 4);
  gDreamDates.value.forEach((dreamDate: DreamDate) => {
    events.value.push({
      id: dreamDate._id,
      name: "",
      start: dreamDate.date,
      end: dreamDate.date,
      timed: false,
    });
  });
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select
          :items="gYears"
          v-model="year"
          label="Year"
          outlined
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          :items="[2, 3, 4, 6, 12]"
          v-model="cols"
          label="Column Width"
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="cols" v-for="(month, index) in months" :key="index">
        <v-sheet :color="gColors.topBarColor">
          <h3 class="text-center">
            {{ getMonthName(months[index + 1]) }}
          </h3>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.v-calendar-daily_head-day-label {
  display: none;
}
</style>
