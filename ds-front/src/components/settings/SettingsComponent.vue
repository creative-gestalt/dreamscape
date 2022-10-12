<script lang="ts" setup>
import { ref } from "vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";

// stores
const mainStore = useMainStore();
const { settings } = storeToRefs(mainStore);
const { reset, updateSettings } = mainStore;
// data
const selectedColorButton = ref("topBarColor");
</script>

<template>
  <v-container>
    <v-card max-width="500">
      <v-btn-toggle v-model="selectedColorButton" class="d-flex">
        <v-btn
          class="flex-grow-1"
          value="topBarColor"
          variant="tonal"
          :stacked="true"
        >
          <v-badge
            :floating="true"
            location="center"
            :color="settings.colors.topBarColor"
            :bordered="true"
            :dot="true"
          ></v-badge>
          <v-icon class="mt-1"> mdi-format-line-weight </v-icon>
        </v-btn>
        <v-btn
          class="flex-grow-1"
          value="backgroundColor"
          variant="tonal"
          :stacked="true"
        >
          <v-badge
            :floating="true"
            location="center"
            :color="settings.colors.backgroundColor"
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
        v-model="settings.colors[selectedColorButton]"
        @update:color="updateSettings"
      ></v-color-picker>
    </v-card>
    <v-divider class="mt-5"></v-divider>
    <v-row>
      <v-col>
        <v-btn
          @click="reset"
          class="mt-5"
          :color="settings.colors.completeBtnColor"
          :block="true"
        >
          Reset
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>