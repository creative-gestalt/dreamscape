<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ViewDream from "@/components/dreams/ViewDream.vue";
const show = ref(false);

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <ViewDream />
  </v-fade-transition>
</template>
