<script lang="ts" setup>
// eslint-disable-next-line no-undef
const props = defineProps<{
  toggle: boolean;
  timeout: number;
  snackText: string;
}>();
</script>

<style lang="scss">
.v-snackbar__wrapper {
  bottom: 75px !important;
}
</style>

<template>
  <v-snackbar :model-value="props.toggle" :timeout="props.timeout" dark>
    {{ props.snackText }}
    <template v-slot:actions>
      <v-btn color="black" variant="text" @click="$emit('closeSnackbar')">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
