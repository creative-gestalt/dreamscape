<script lang="ts" setup>
import { useMainStore } from "@/store/main";
import { useSessionStore } from "@/store/sessions";
import { storeToRefs } from "pinia";
// import { onMounted } from "vue";

// stores
const mainStore = useMainStore();
const sessionStore = useSessionStore();
const { settings } = storeToRefs(mainStore);
const { sessions } = storeToRefs(sessionStore);
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
    v-if="sessions && sessions.length > 0"
    class="ma-auto"
    color="transparent"
  >
    <v-list class="overflow-y-auto" bg-color="transparent">
      <template v-for="(session, index) of sessions" :key="index">
        <v-list-item
          :base-color="settings.colors.textColor"
          :title="formatSessionDate(session.date)"
          :to="{ name: 'ViewSessionPage', params: { id: session._id } }"
        >
          <template #subtitle>
            <span :style="{ color: settings.colors.textColor }">
              {{ session.session.entity }}
            </span>
          </template>
          <v-lazy
            min-width="100%"
            max-width="100%"
            :options="{ threshold: 0.5 }"
          >
          </v-lazy>
        </v-list-item>
        <v-divider
          v-if="index < sessions.length - 1"
          :key="index"
          class="mx-2"
        ></v-divider>
      </template>
    </v-list>
  </v-card>
  <v-container v-else>
    <v-card color="#222222">
      <v-card-title :style="{ color: settings.colors.textColor }">
        No Sessions Here Yet
      </v-card-title>
    </v-card>
  </v-container>
</template>
