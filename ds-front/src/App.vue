<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useDreamStore } from "@/stores/dreams";
import { useSessionStore } from "@/stores/sessions";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const dreamStore = useDreamStore();
const sessionStore = useSessionStore();
const { gLoading, gColors } = storeToRefs(mainStore);
const { getSettings } = mainStore;
const { getDreamsForPage, getDreamDates } = dreamStore;
const { getAllSessions } = sessionStore;

const mobile = useDisplay().xs;
const selectedNav = ref("0");

onMounted(async () => {
  await getSettings();
  await getDreamsForPage({
    skip: 0,
    limit: 13,
  });
  await getDreamDates();
  await getAllSessions();
});
</script>

<template>
  <v-app id="app" :style="{ background: gColors.backgroundColor }">
    <v-app-bar :color="gColors.topBarColor" dark app>
      <div class="d-flex align-center pr-5">
        <v-img class="ml-3" width="35" src="./assets/ga-logo-black.png"></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{
          color: gColors.iconColor,
        }"
      >
        {{ $route.meta.title }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="!mobile">
        <v-btn to="/dreams" text>
          <v-icon :color="gColors.iconColor"> mdi-sleep </v-icon>
        </v-btn>
        <v-btn to="/sessions" text>
          <v-icon :color="gColors.iconColor"> mdi-notebook </v-icon>
        </v-btn>
        <v-btn to="/dream-overview" text>
          <v-icon :color="gColors.iconColor">mdi-calendar</v-icon>
        </v-btn>
        <v-btn to="/settings" text>
          <v-icon :color="gColors.iconColor"> mdi-cog-outline </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-overlay
        :model-value="gLoading"
        class="ma-auto align-center justify-center ios-overlay"
        contained
      >
        <v-progress-circular
          :color="gColors.textColor"
          size="45"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
      <router-view />
    </v-main>

    <v-bottom-navigation
      v-if="mobile"
      :model-value="selectedNav"
      :bg-color="gColors.topBarColor"
      :grow="true"
      mode="shift"
      app
    >
      <v-btn :color="gColors.topBarColor" value="0" to="/dreams">
        <span :style="{ color: gColors.iconColor }"> Dreams </span>
        <v-icon :color="gColors.iconColor">mdi-sleep</v-icon>
      </v-btn>
      <v-btn :color="gColors.topBarColor" value="1" to="/sessions">
        <span :style="{ color: gColors.iconColor }"> Sessions </span>
        <v-icon :color="gColors.iconColor"> mdi-notebook </v-icon>
      </v-btn>
      <v-btn :color="gColors.topBarColor" value="2" to="/dream-overview">
        <span :style="{ color: gColors.iconColor }"> Overview </span>
        <v-icon :color="gColors.iconColor"> mdi-calendar </v-icon>
      </v-btn>
      <v-btn :color="gColors.topBarColor" value="3" to="/settings">
        <span :style="{ color: gColors.iconColor }"> Settings </span>
        <v-icon :color="gColors.iconColor"> mdi-cog-outline </v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style lang="scss">
$scrollbar-bg-color: #171717;
$scrollbar-thumb-color: #898989;
$app-title-bar-width: 125px;

html {
  background-color: black;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 10px;
  background-color: $scrollbar-bg-color;
}
::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background-color: $scrollbar-thumb-color;
}
.v-app-bar-title__content {
  width: $app-title-bar-width !important;
}
.ios-overlay {
  height: 125px;
  width: 125px;
  border-radius: 15px !important;
}
</style>
