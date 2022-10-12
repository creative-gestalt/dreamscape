<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useSessionStore } from "@/stores/sessions";
import { useDisplay } from "vuetify";
import { onMounted, ref } from "vue";
import NewSession from "@/components/sessions/NewSession.vue";
import SessionList from "@/components/sessions/SessionList.vue";

const mainStore = useMainStore();
const sessionStore = useSessionStore();
const colors = mainStore.gColors;
const mobile = useDisplay().xs;
const show = ref(false);
const tab = ref(0);

function handleTabs(index: number): void {
  tab.value = index;
  sessionStore.updateCurrentTab(index);
}

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
  tab.value = sessionStore.currentTab;
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <div v-if="show">
      <v-tabs
        :model-value="tab"
        @update:modelValue="handleTabs"
        :color="colors.textColor"
        :bg-color="colors.backgroundColor"
        :grow="mobile"
        :centered="true"
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
  </v-fade-transition>
</template>
