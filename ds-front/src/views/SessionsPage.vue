<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useSessionStore } from "@/stores/sessions";
import { useDisplay } from "vuetify";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import NewSession from "@/components/sessions/NewSession.vue";
import SessionList from "@/components/sessions/SessionList.vue";

const mainStore = useMainStore();
const sessionStore = useSessionStore();
const { settings } = storeToRefs(mainStore);
const mobile = useDisplay().xs.value;
const show = ref(false);
const tab = ref(0);

function handleTabs(index: number): void {
  tab.value = index;
  sessionStore.currentTab = index;
}

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
  tab.value = sessionStore.currentTab;
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <div v-if="show">
      <div v-if="mobile">
        <v-tabs
          :model-value="tab"
          @update:modelValue="handleTabs"
          :color="settings.colors.textColor"
          :bg-color="settings.colors.backgroundColor"
          :grow="mobile"
          fixed-tabs
        >
          <v-tab :value="0">new</v-tab>
          <v-tab :value="1">all</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item :value="0">
            <NewSession />
          </v-window-item>
          <v-window-item :value="1">
            <SessionList />
          </v-window-item>
        </v-window>
      </div>
      <v-container v-else>
        <v-row>
          <v-col cols="6">
            <NewSession />
          </v-col>
          <v-col cols="6">
            <SessionList />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-fade-transition>
</template>
