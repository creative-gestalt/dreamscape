<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ViewSession from "@/components/sessions/ViewSession.vue";
const show = ref(false);

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <ViewSession />
  </v-fade-transition>
</template>
