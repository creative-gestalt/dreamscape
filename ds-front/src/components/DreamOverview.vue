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
      <v-col :cols="cols" v-for="(month, i) in months" :key="i">
        <v-sheet :color="gColors.topBarColor">
          <h3 class="text-center">
            {{ getMonthName(months[i + 1]) }}
          </h3>
          <v-calendar
            ref="calendar[month]"
            :style="{ backgroundColor: gColors.topBarColor }"
            :start="month"
            :events="events"
            :color="gColors.completeBtnColor"
            @click:event="openDreamView"
            :event-color="gColors.completeBtnColor"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { mapState } from "pinia";
import { DreamDate } from "@/interfaces/dream.interface";
import { CalendarEvent } from "vuetify";

export default Vue.extend({
  name: "DreamOverview",
  async created(): Promise<void> {
    this.cols = this.isMobile ? 12 : 6;
    this.year = this.gDate().slice(0, 4);
    this.gDreamDates.forEach((dreamDate: DreamDate) => {
      this.events.push({
        id: dreamDate._id,
        name: "",
        start: dreamDate.date,
        end: dreamDate.date,
        timed: false,
      });
    });
  },
  data: () => ({
    value: "",
    mode: "column",
    modes: ["stack", "column"],
    events: [] as any[],
    cols: 12,
    year: "",
  }),
  methods: {
    openDreamView(event: CalendarEvent): void {
      this.$router.push(`/dream/${event.event.id}`);
    },
    getMonthName(dateVal: string) {
      const date = new Date(dateVal);
      if (date.toString() !== "Invalid Date")
        return date.toLocaleString("en-us", { month: "long" });
      else return "December";
    },
  },
  computed: {
    ...mapState(useMainStore, ["gColors", "gDate"]),
    ...mapState(useDreamStore, ["gDreamDates", "gYears"]),
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
    months(): string[] {
      return [
        `${this.year}-01-01`,
        `${this.year}-02-01`,
        `${this.year}-03-01`,
        `${this.year}-04-01`,
        `${this.year}-05-01`,
        `${this.year}-06-01`,
        `${this.year}-07-01`,
        `${this.year}-08-01`,
        `${this.year}-09-01`,
        `${this.year}-10-01`,
        `${this.year}-11-01`,
        `${this.year}-12-01`,
      ];
    },
  },
});
</script>
<style lang="scss">
.v-calendar-daily_head-day-label {
  display: none;
}
</style>
