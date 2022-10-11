<script lang="ts" setup>
import { onMounted, ref } from "vue";
import SettingsComponent from "@/components/settings/Settings.vue";
const show = ref(false);

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <SettingsComponent />
  </v-fade-transition>
</template>
