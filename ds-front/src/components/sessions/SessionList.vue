<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useSessionStore } from "@/stores/sessions";
import { storeToRefs } from "pinia";

// stores
const mainStore = useMainStore();
const sessionStore = useSessionStore();
const colors = mainStore.gColors;
const { gSessions /*gLimit*/ } = storeToRefs(sessionStore);
// const { loadMoreSessions } = sessionStore;
// data
// const pageLoaded = ref(0);
// const moreAvailable = ref(true);
// computed
// methods
// async function moreSessions(
//   entries: IntersectionObserverEntry[]
// ): Promise<void> {
//   const total = gSessions.value.length;
//   if (entries[0].isIntersecting && moreAvailable.value) {
//     const skip = gSessions.value.length;
//     const limit = gLimit.value;
//     pageLoaded.value++;
//     await loadMoreSessions({ skip, limit });
//     if (total === gSessions.value.length) moreAvailable.value = false;
//   }
// }
function formatSessionDate(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>

<template>
  <v-card
    v-if="gSessions && gSessions.length > 0"
    class="ma-2 ma-auto"
    max-width="800"
    :color="colors.topBarColor"
  >
    <v-list class="overflow-y-auto" :bg-color="colors.topBarColor">
      <template v-for="(session, index) of gSessions" :key="index">
        <v-list-item
          :title="formatSessionDate(session.date)"
          :to="{ name: 'ViewSessionPage', params: { id: session._id } }"
        >
          <template #subtitle>
            <span :style="{ color: colors.textColor }">
              {{ session.session.entity }}
            </span>
          </template>
          <v-lazy
            min-width="100%"
            max-width="100%"
            :options="{
              threshold: 0.5,
            }"
          >
          </v-lazy>
        </v-list-item>
        <v-divider
          v-if="index < gSessions.length - 1"
          :key="index"
          class="mx-2"
        ></v-divider>
      </template>
    </v-list>
  </v-card>
  <v-container v-else>
    <v-card :color="colors.topBarColor">
      <v-card-title :style="{ color: colors.textColor }">
        No Sessions Here Yet
      </v-card-title>
    </v-card>
  </v-container>
</template>
