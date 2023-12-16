<template>
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
</template>

<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useMainStore} from "@/store/main";

const mainStore = useMainStore();
const { loading, settings } = storeToRefs(mainStore);
</script>
