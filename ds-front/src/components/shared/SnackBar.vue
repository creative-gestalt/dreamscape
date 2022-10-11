<script lang="ts" setup>
// eslint-disable-next-line no-undef
const props = defineProps({
  toggle: Boolean,
  timeout: Number,
  snackText: String,
});
</script>

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
