<script lang="ts" setup>
import NewDream from "@/components/dreams/NewDream.vue";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { useDisplay } from "vuetify";
import { onMounted, ref } from "vue";

const mainStore = useMainStore();
const dreamStore = useDreamStore();
const colors = mainStore.gColors;
const mobile = useDisplay().xs;
const show = ref(false);
const tab = ref(0);
const selectedTab = ref(0);
const tabs = ref(["New", "List"]);

function handleTabs(index: number): void {
  selectedTab.value = index;
  dreamStore.updateCurrentTab(index);
}

onMounted(() => {
  setTimeout(() => (show.value = true), 100);
  selectedTab.value = dreamStore.currentTab;
});
</script>

<template>
  <v-fade-transition hide-on-leave>
    <div v-if="show">
      <v-tabs
        v-model="tab"
        :color="colors.textColor"
        :background-color="colors.backgroundColor"
        :grow="mobile"
        :centered="true"
      >
        <v-tab
          v-for="(tab, index) in tabs"
          :key="tab"
          @change="handleTabs(index)"
        >
          {{ tab }}
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item transition="slide-y-transition">
          <NewDream v-show="tab === 0" />
        </v-window-item>
      </v-window>
    </div>
  </v-fade-transition>
</template>
