<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useDreamStore } from "@/stores/dreams";
import { useSessionStore } from "@/stores/sessions";

const mainStore = useMainStore();
const dreamStore = useDreamStore();
const sessionStore = useSessionStore();
const loading = mainStore.gLoading;
const colors = mainStore.gColors;
const mobile = useDisplay().xs;
const selectedNav = ref("dreams");

onMounted(async () => {
  await mainStore.getSettings();
  await dreamStore.getDreamsForPage({
    skip: 0,
    limit: 13,
  });
  await dreamStore.getDreamDates();
  await sessionStore.getAllSessions();
});
</script>

<template>
  <v-app id="app" :style="{ background: colors.backgroundColor }">
    <v-app-bar :color="colors.topBarColor" dark app>
      <div class="d-flex align-center pr-5">
        <v-img class="ml-3" width="35" src="./assets/ga-logo-black.png"></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{
          color: colors.iconColor,
        }"
      >
        {{ $route.meta.title }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="!mobile">
        <v-btn to="/dreams" text>
          <v-icon :color="colors.iconColor"> mdi-sleep </v-icon>
        </v-btn>
        <v-btn to="/sessions" text>
          <v-icon :color="colors.iconColor"> mdi-notebook </v-icon>
        </v-btn>
        <v-btn to="/dream-overview" text>
          <v-icon :color="colors.iconColor">mdi-calendar</v-icon>
        </v-btn>
        <v-btn to="/settings" text>
          <v-icon :color="colors.iconColor"> mdi-cog-outline </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-overlay v-if="loading" class="ma-auto ios-overlay">
        <v-progress-circular
          size="45"
          indeterminate="true"
        ></v-progress-circular>
      </v-overlay>
      <router-view />
    </v-main>

    <v-bottom-navigation
      v-if="mobile"
      v-model="selectedNav"
      :background-color="colors.topBarColor"
      :grow="true"
      shift
      app
    >
      <v-btn :color="colors.topBarColor" value="dreams" to="/dreams">
        <span :style="{ color: colors.iconColor }"> Dreams </span>
        <v-icon :color="colors.iconColor">mdi-sleep</v-icon>
      </v-btn>
      <v-btn :color="colors.topBarColor" value="sessions" to="/sessions">
        <span :style="{ color: colors.iconColor }"> Sessions </span>
        <v-icon :color="colors.iconColor"> mdi-notebook </v-icon>
      </v-btn>
      <v-btn
        :color="colors.topBarColor"
        value="dreams-overview"
        to="/dream-overview"
      >
        <span :style="{ color: colors.iconColor }"> Overview </span>
        <v-icon :color="colors.iconColor"> mdi-calendar </v-icon>
      </v-btn>
      <v-btn :color="colors.topBarColor" value="settings" to="/settings">
        <span :style="{ color: colors.iconColor }"> Settings </span>
        <v-icon :color="colors.iconColor"> mdi-cog-outline </v-icon>
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
