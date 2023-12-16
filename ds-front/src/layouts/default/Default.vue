<script lang="ts" setup>
import DefaultView from "./View.vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store/main";
import { useDisplay } from "vuetify";
import { useDreamStore } from "@/store/dreams";
import { useSessionStore } from "@/store/sessions";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const mainStore = useMainStore();
const dreamStore = useDreamStore();
const sessionStore = useSessionStore();
const { settings } = storeToRefs(mainStore);
const { getSettings } = mainStore;
const { getDreamDates, getDreamsCount } = dreamStore;
const { getAllSessions } = sessionStore;

const mobile = useDisplay().xs.value;
const selectedNav = ref("0");
const drawer = ref(false);
const route = useRoute();

onMounted(async () => {
  await getSettings();
  await getDreamsCount();
  await getDreamDates(new Date().getFullYear().toString());
  await getAllSessions();
});
</script>

<template>
  <v-app>
    <v-app-bar color="black" density="compact" app>
      <div class="d-flex align-center pr-5">
        <v-img
          @click="drawer = !drawer"
          class="ml-3"
          width="40"
          src="../../assets/ga-logo-turple-outline.png"
        ></v-img>
      </div>
      <v-app-bar-title
        class="text-no-wrap"
        :style="{ color: settings.colors.iconColor }"
      >
        {{ $route.meta.title }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="!mobile">
        <v-btn to="/new-dream" variant="text">
          <v-icon :color="settings.colors.iconColor"> mdi-plus </v-icon>
        </v-btn>
        <v-btn to="/dreams" variant="text">
          <v-icon :color="settings.colors.iconColor"> mdi-sleep </v-icon>
        </v-btn>
        <v-btn to="/new-session" variant="text">
          <v-icon :color="settings.colors.iconColor">
            mdi-wallet-plus-outline
          </v-icon>
        </v-btn>
        <v-btn to="/sessions" variant="text">
          <v-icon :color="settings.colors.iconColor"> mdi-keyboard </v-icon>
        </v-btn>
        <v-btn to="/dream-overview" variant="text">
          <v-icon :color="settings.colors.iconColor">mdi-calendar</v-icon>
        </v-btn>
        <v-btn to="/settings" variant="text">
          <v-icon :color="settings.colors.iconColor"> mdi-cog-outline </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-if="mobile" v-model="drawer" class="bg-black">
      <v-list-item
        title="Dreamscape"
        subtitle="Menu"
        :base-color="settings.colors.iconColor"
      ></v-list-item>
      <v-divider></v-divider>
      <v-list color="transparent">
        <v-list-item
          prepend-icon="mdi-sleep"
          title="Dreams"
          :color="settings.colors.completeBtnColor"
          :base-color="settings.colors.iconColor"
          to="/new-dream"
          link
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-keyboard"
          title="Sessions"
          :color="settings.colors.completeBtnColor"
          :base-color="settings.colors.iconColor"
          to="/new-session"
          link
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-calendar"
          title="Overview"
          :color="settings.colors.completeBtnColor"
          :base-color="settings.colors.iconColor"
          to="/dream-overview"
          link
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cog"
          title="Settings"
          :color="settings.colors.completeBtnColor"
          :base-color="settings.colors.iconColor"
          to="/settings"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <default-view />

    <v-bottom-navigation
      v-if="mobile"
      :model-value="selectedNav"
      bg-color="black"
      height="100"
      mandatory
      grow
    >
      <div
        v-if="
          route.path.includes('/new-dream') || route.path.includes('/dreams')
        "
      >
        <v-btn value="0" to="/new-dream">
          <v-icon :color="settings.colors.iconColor">mdi-plus</v-icon>
          <span :style="{ color: settings.colors.iconColor }">Add</span>
        </v-btn>
        <v-btn value="1" to="/dreams">
          <v-icon :color="settings.colors.iconColor">mdi-sleep</v-icon>
          <span :style="{ color: settings.colors.iconColor }">Dreams</span>
        </v-btn>
      </div>
      <div
        v-if="
          route.path.includes('/new-session') ||
          route.path.includes('/sessions')
        "
      >
        <v-btn value="2" to="/new-session">
          <v-icon :color="settings.colors.iconColor">
            mdi-wallet-plus-outline
          </v-icon>
          <span :style="{ color: settings.colors.iconColor }">Add</span>
        </v-btn>
        <v-btn value="3" to="/sessions">
          <v-icon :color="settings.colors.iconColor">mdi-keyboard</v-icon>
          <span :style="{ color: settings.colors.iconColor }">Sessions</span>
        </v-btn>
      </div>
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
