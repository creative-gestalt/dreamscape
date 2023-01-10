<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
// eslint-disable-next-line no-undef
const props = defineProps<{
  day: string;
  deleteFunction: () => void;
  actionFunction: () => void;
  actionIcon: string;
}>();
//stores
const mainStore = useMainStore();
const { settings } = storeToRefs(mainStore);
</script>

<style lang="scss"></style>

<template>
  <v-card class="ma-auto" max-width="800">
    <v-container>
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="8">
          <v-btn-group density="compact" variant="outlined" divided>
            <v-btn
              :color="settings.colors.iconColor"
              width="150"
              density="compact"
            >
              {{ day }}
            </v-btn>
            <v-btn @click="props.deleteFunction" density="compact">
              <v-icon color="red darken-4"> mdi-minus </v-icon>
            </v-btn>
          </v-btn-group>
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
          <v-icon
            class="mr-3"
            @click="props.actionFunction"
            :color="settings.colors.iconColor"
          >
            {{ props.actionIcon }}
          </v-icon>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
