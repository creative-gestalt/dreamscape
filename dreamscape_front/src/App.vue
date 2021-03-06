<template>
  <v-app id="app" :style="{ background: getColors.backgroundColor }">
    <v-app-bar
      :color="getColors.topBarColor"
      :height="isIOS ? 90 : 56"
      dark
      app
    >
      <div class="d-flex align-center pr-5">
        <v-img
          class="ml-3"
          :style="isIOS ? 'transform: translateY(20px)' : ''"
          width="35"
          src="@/assets/ga-logo-black.png"
        ></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{
          color: getColors.iconColor,
          transform: isIOS ? 'translateY(20px)' : '',
        }"
      >
        {{ $route.meta.title }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="!isMobile">
        <v-btn to="/dreams" text>
          <v-icon :color="getColors.iconColor"> mdi-sleep </v-icon>
        </v-btn>
        <v-btn to="/sessions" text>
          <v-icon :color="getColors.iconColor"> mdi-notebook </v-icon>
        </v-btn>
        <v-btn to="/dream-overview" text>
          <v-icon :color="getColors.iconColor">mdi-calendar</v-icon>
        </v-btn>
        <v-btn to="/settings" text>
          <v-icon :color="getColors.iconColor"> mdi-cog-outline </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-overlay v-if="loading" class="ma-auto ios-overlay">
        <v-progress-circular size="45" indeterminate></v-progress-circular>
      </v-overlay>
      <router-view />
    </v-main>

    <v-bottom-navigation
      v-if="isMobile"
      :background-color="getColors.topBarColor"
      color="transparent"
      :min-height="fullscreenBuffer"
      grow
      shift
      light
      app
    >
      <v-btn :class="paddingClass" to="/dreams">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Dreams
        </span>
        <v-icon :color="getColors.iconColor">mdi-sleep</v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/sessions">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Sessions
        </span>
        <v-icon :color="getColors.iconColor"> mdi-notebook </v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/dream-overview">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Overview
        </span>
        <v-icon :color="getColors.iconColor"> mdi-calendar </v-icon>
      </v-btn>
      <v-btn :class="paddingClass" to="/settings">
        <span :class="marginClass" :style="{ color: getColors.iconColor }">
          Settings
        </span>
        <v-icon :color="getColors.iconColor"> mdi-cog-outline </v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "App",
  async mounted(): Promise<void> {
    await this.$store.dispatch("getSettings");
  },
  async created(): Promise<void> {
    await this.$store.dispatch("getDreamsForPage", {
      skip: 0,
      limit: 13,
    });
    await this.$store.dispatch("getDreamDates");
    await this.$store.dispatch("getAllSessions");
  },
  data: () => ({
    bottomNavHeight: 56,
    paddingClass: "",
    marginClass: "",
  }),
  methods: {
    //
  },
  computed: {
    ...mapGetters(["getColors", "loading"]),
    isMobile(): boolean {
      return this.$vuetify.breakpoint.name === "xs";
    },
    isIOS(): boolean {
      // return true;
      return this.fullscreenBuffer === 80;
    },
    fullscreenBuffer(): number {
      return navigator.platform.match(/iPhone|iPod|iPad/) ? 80 : 56;
    },
  },
});
</script>
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
