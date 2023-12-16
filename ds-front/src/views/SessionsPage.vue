<script lang="ts" setup>
import { onMounted, ref } from "vue";
import SessionList from "@/components/sessions/SessionList.vue";

const show = ref(false);

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <div v-if="show">
      <SessionList />
    </div>
  </v-fade-transition>
</template>
