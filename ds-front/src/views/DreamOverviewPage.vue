<script lang="ts" setup>
import { onMounted, ref } from "vue";
import DreamOverview from "@/components/DreamOverview.vue";

const show = ref(false);

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <DreamOverview />
  </v-fade-transition>
</template>
