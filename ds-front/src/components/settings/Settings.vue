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
    <v-card>
      <v-btn-toggle v-model="selectedColorButton" class="d-flex">
        <v-btn class="flex-grow-1" value="topBarColor" variant="tonal">
          <v-icon :color="settings.colors.topBarColor">
            mdi-format-line-weight
          </v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="backgroundColor" variant="tonal">
          <v-icon :color="settings.colors.backgroundColor">
            mdi-application
          </v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="iconColor" variant="tonal">
          <v-icon :color="settings.colors.iconColor">mdi-pill</v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="textColor" variant="tonal">
          <v-icon :color="settings.colors.textColor">mdi-text-shadow</v-icon>
        </v-btn>
        <v-btn class="flex-grow-1" value="completeBtnColor" variant="tonal">
          <v-icon :color="settings.colors.completeBtnColor">
            mdi-gesture-tap
          </v-icon>
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
