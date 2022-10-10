<template>
  <v-card class="ma-2 ma-auto" max-width="800" :color="gColors.topBarColor">
    <v-card-title class="ma-0 pa-1 pb-0">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        @click:clear="getDreamsForPage(1)"
        single-line
        hide-details
        clearable
        outlined
        dense
      ></v-text-field>
      <v-select
        v-model="itemsPerPage"
        :items="perPage"
        class="ml-1"
        style="max-width: 75px"
        hide-details
        outlined
        dense
      >
      </v-select>
    </v-card-title>
    <v-data-table
      :items="gDreams"
      :headers="headers"
      :items-per-page.sync="compItemsPerPage"
      :style="{ backgroundColor: gColors.topBarColor }"
      item-key="_id"
      mobile-breakpoint="0"
      hide-default-header
      hide-default-footer
      @click:row="handleClick"
      dense
    >
      <template v-slot:item.date="{ item }">
        <div :style="gColors.textColor | alpha('70%', true, 'color')">
          <v-list-item link dense>
            <v-list-item-avatar class="ml-n6 mr-1">
              <span :style="gColors.textColor | alpha('90%', true, 'color')">
                {{ item.dreams.length }}
              </span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span :style="gColors.textColor | alpha('90%', true, 'color')">
                  {{ formatDreamDate(item.date) }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="grey--text">
                  {{ item.dreams[0].subDream }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
      </template>
    </v-data-table>
    <v-pagination
      v-model="currentPage"
      :length="compPages"
      @input="getDreamsForPage"
      :color="gColors.completeBtnColor"
    >
    </v-pagination>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Dream } from "@/interfaces/dream.interface";
import { mapState, mapStores } from "pinia";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";

export default Vue.extend({
  name: "DreamList",
  async created() {
    if (this.gDreamsCount === 0) {
      await this.getDreamsForPage(1);
      await this.dreamsStore.getDreamsCount();
    }
  },
  data: () => ({
    search: "",
    currentPage: 1,
    pagesFromServer: 0,
    itemsPerPage: 8,
    perPage: [8, 10, 15, 20],
    pageLoaded: 0,
    moreAvailable: true,
    dreams: [] as Dream[],
    headers: [
      {
        text: "Date",
        align: "start",
        sortable: false,
        value: "date",
      },
    ],
  }),
  methods: {
    async getDreamsForPage(pageNumber: number): Promise<void> {
      await this.mainStore.updateLoading(true);
      this.currentPage = pageNumber;
      const skip = (pageNumber - 1) * this.itemsPerPage;
      await this.dreamsStore.getDreamsForPage({
        skip,
        limit: this.itemsPerPage,
      });
      await this.mainStore.updateLoading(false);
    },
    handleClick(dream: Dream): void {
      this.$router.push(`/dream/${dream._id}`);
    },
    formatDreamDate(date: string): string {
      return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  computed: {
    ...mapStores(useMainStore, useDreamStore),
    ...mapState(useMainStore, ["gColors"]),
    ...mapState(useDreamStore, ["gDreams", "gDreamsCount"]),
    compItemsPerPage: {
      get(): number {
        return this.itemsPerPage;
      },
      set(): void {
        this.getDreamsForPage(this.currentPage);
      },
    },
    compPages(): number {
      return Math.ceil(this.dreamsStore.dreamsCount / this.itemsPerPage);
    },
  },
  watch: {
    search(value: string): void {
      if (value) {
        this.dreamsStore.searchDreams(value);
      } else {
        this.getDreamsForPage(1);
      }
    },
  },
});
</script>
<style lang="scss">
.text-start {
  max-width: 5px;
}
.v-pagination__item {
  opacity: 0.6;
}
</style>
