<script lang="ts" setup>
// eslint-disable-next-line no-undef
import { useMainStore } from "@/store/main";
import { useSessionStore } from "@/store/sessions";
import { storeToRefs } from "pinia";

const props = defineProps<{
  toggle: boolean;
  timeout: number;
  snackText: string;
}>();

const mainStore = useMainStore();
const { settings } = storeToRefs(mainStore);
</script>

<style lang="scss">
.v-snackbar__wrapper {
  bottom: 75px !important;
}
</style>

<template>
  <v-snackbar
    :model-value="props.toggle"
    :timeout="props.timeout"
    color="black"
  >
    {{ props.snackText }}
    <template v-slot:actions>
      <v-btn
        :color="settings.colors.textColor"
        variant="text"
        @click="$emit('closeSnackbar')"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
