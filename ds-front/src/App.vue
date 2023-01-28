<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useDisplay } from "vuetify";
import { onMounted, ref } from "vue";
import { useDreamStore } from "@/stores/dreams";
import { useSessionStore } from "@/stores/sessions";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const dreamStore = useDreamStore();
const sessionStore = useSessionStore();
const { loading, settings } = storeToRefs(mainStore);
const { getSettings } = mainStore;
const { getDreamDates } = dreamStore;
const { getAllSessions } = sessionStore;

const mobile = useDisplay().xs.value;
const selectedNav = ref("0");

onMounted(async () => {
  await getSettings();
  // await getDreamsCount();
  await getDreamDates(new Date().getFullYear().toString());
  await getAllSessions();
});
</script>

<template>
  <v-app id="app" :style="{ background: settings.colors.backgroundColor }">
    <v-app-bar :color="settings.colors.topBarColor" density="compact" dark app>
      <div class="d-flex align-center pr-5">
        <v-img class="ml-3" width="35" src="./assets/ga-logo-black.png"></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{ color: settings.colors.iconColor }"
      >
        {{ $route.meta.title }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="!mobile">
        <v-btn to="/dreams" variant="text">
          <v-icon :color="settings.colors.iconColor"> mdi-sleep </v-icon>
        </v-btn>
        <v-btn to="/sessions" variant="text">
          <v-icon :color="settings.colors.iconColor"> mdi-notebook </v-icon>
        </v-btn>
        <v-btn to="/dream-overview" variant="text">
          <v-icon :color="settings.colors.iconColor">mdi-calendar</v-icon>
        </v-btn>
        <v-btn to="/settings" variant="text">
          <v-icon :color="settings.colors.iconColor"> mdi-cog-outline </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-overlay
        :model-value="loading"
        class="ma-auto align-center justify-center ios-overlay"
        theme="light"
        contained
      >
        <v-progress-circular
          :color="settings.colors.textColor"
          size="45"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
      <router-view />
    </v-main>

    <v-bottom-navigation
      v-if="mobile"
      :model-value="selectedNav"
      :bg-color="settings.colors.topBarColor"
      :grow="true"
      class="pb-3"
      height="80"
      mode="shift"
      mandatory
    >
      <v-btn :color="settings.colors.topBarColor" value="0" to="/dreams">
        <span :style="{ color: settings.colors.iconColor }"> Dreams </span>
        <v-icon :color="settings.colors.iconColor">mdi-sleep</v-icon>
      </v-btn>
      <v-btn :color="settings.colors.topBarColor" value="1" to="/sessions">
        <span :style="{ color: settings.colors.iconColor }"> Sessions </span>
        <v-icon :color="settings.colors.iconColor"> mdi-notebook </v-icon>
      </v-btn>
      <v-btn
        :color="settings.colors.topBarColor"
        value="2"
        to="/dream-overview"
      >
        <span :style="{ color: settings.colors.iconColor }"> Overview </span>
        <v-icon :color="settings.colors.iconColor"> mdi-calendar </v-icon>
      </v-btn>
      <v-btn :color="settings.colors.topBarColor" value="3" to="/settings">
        <span :style="{ color: settings.colors.iconColor }"> Settings </span>
        <v-icon :color="settings.colors.iconColor"> mdi-cog-outline </v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style lang="scss">
$scrollbar-bg-color: #171717;
$scrollbar-thumb-color: #898989;

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
.ios-overlay {
  height: 125px;
  width: 125px;
  border-radius: 15px !important;
}
</style>
