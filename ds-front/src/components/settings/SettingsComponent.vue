<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "@/store/main";
import { storeToRefs } from "pinia";
import { Colors } from "@/interfaces/settings.interface";

// stores
const mainStore = useMainStore();
const { settings } = storeToRefs(mainStore);
const { reset, updateSettings, getSettings } = mainStore;
// data
const selectedColorButton = ref("topBarColor");
const currentColor = ref("");
// methods
function updateColorSelection(value: string) {
  selectedColorButton.value = value;
  currentColor.value = settings.value.colors[value as keyof Colors];
}
// watch
watch(currentColor, (newColor) => {
  updateSettings(selectedColorButton.value, newColor);
});

onMounted(() => {
  getSettings();
});
</script>

<template>
  <v-container>
    <v-card class="ma-auto" max-width="500" color="transparent">
      <v-btn-toggle
        :model-value="selectedColorButton"
        @update:modelValue="updateColorSelection"
        class="d-flex"
      >
        <v-btn
          v-if="false"
          class="flex-grow-1"
          value="topBarColor"
          variant="tonal"
          :stacked="true"
        >
          <v-badge
            v-if="false"
            :floating="true"
            location="center"
            :bordered="true"
            :dot="true"
          ></v-badge>
          <v-icon class="mt-1"> mdi-format-line-weight </v-icon>
        </v-btn>
        <v-btn
          v-if="false"
          class="flex-grow-1"
          value="backgroundColor"
          variant="tonal"
          :stacked="true"
        >
          <v-badge
            v-if="false"
            :floating="true"
            location="center"
            :bordered="true"
            :dot="true"
          ></v-badge>
          <v-icon class="mt-1"> mdi-application </v-icon>
        </v-btn>
        <v-btn
          class="flex-grow-1"
          value="iconColor"
          variant="tonal"
          :stacked="true"
        >
          <v-badge
            :floating="true"
            location="center"
            :color="settings.colors.iconColor"
            :bordered="true"
            :dot="true"
          ></v-badge>
          <v-icon class="mt-1">mdi-pill</v-icon>
        </v-btn>
        <v-btn
          class="flex-grow-1"
          value="textColor"
          variant="tonal"
          :stacked="true"
        >
          <v-badge
            :floating="true"
            location="center"
            :color="settings.colors.textColor"
            :bordered="true"
            :dot="true"
          ></v-badge>
          <v-icon class="mt-1">mdi-text-shadow</v-icon>
        </v-btn>
        <v-btn
          class="flex-grow-1"
          value="completeBtnColor"
          variant="tonal"
          :stacked="true"
        >
          <v-badge
            :floating="true"
            location="center"
            :color="settings.colors.completeBtnColor"
            :bordered="true"
            :dot="true"
          ></v-badge>
          <v-icon class="mt-1"> mdi-gesture-tap </v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-color-picker
        v-model="currentColor"
        width="100%"
        :hide-canvas="true"
        :show-swatches="true"
        swatches-max-height="350"
        color="transparent"
      ></v-color-picker>
    </v-card>

    <v-btn
      absolute
      bottom
      @click="reset"
      class="mt-5"
      :color="settings.colors.completeBtnColor"
      :block="true"
    >
      Reset
    </v-btn>
  </v-container>
</template>
