<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useSessionStore } from "@/stores/sessions";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { Session } from "@/interfaces/session.interface";
import ViewActions from "@/components/shared/ViewActions.vue";

// router
const router = useRouter();
const route = useRoute();
// stores
const mainStore = useMainStore();
const sessionStore = useSessionStore();
const { settings } = storeToRefs(mainStore);
const { mstDate } = mainStore;
const { getSession, updateSession, getAllSessions, deleteSessions } =
  sessionStore;
// data
const mobile = useDisplay().xs.value;
const id = ref("");
const session = ref({} as Session);
const sessionTime = ref("");
const editSheet = ref(false);
const max = ref("");
const scrollInvoked = ref(0);
// computed
const computedDay = computed(() =>
  session.value.date
    ? new Date(session.value.date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      })
    : ""
);
// methods
function onScroll(): void {
  scrollInvoked.value++;
}
function updateCompSession(): void {
  editSheet.value = false;
  submitSession();
}
async function submitSession(): Promise<void> {
  const date = new Date(session.value.date).toISOString();
  const newDate =
    date.slice(0, 11) + sessionTime.value + date.slice(19, date.length);
  await updateSession({
    _id: id.value,
    date: newDate,
    session: session.value.session,
  });
  await getAllSessions();
}
async function deleteSession(): Promise<void> {
  const answer = confirm("Are you sure?");
  if (answer) {
    await deleteSessions([session.value]);
    await getAllSessions();
    await router.push("/sessions");
  }
}
async function openEditSheet(): Promise<void> {
  editSheet.value = true;
}
onBeforeMount(async () => {
  id.value = String(route.params.id);
  session.value = await getSession({ _id: id.value } as Session);
  sessionTime.value = session.value.date.slice(11, 19);
  max.value = new Date().toISOString();
});
</script>

<template>
  <v-container>
    <view-actions
      class="mb-4"
      :day="computedDay"
      :delete-function="deleteSession"
      :action-function="openEditSheet"
      :action-icon="'mdi-pencil'"
    >
    </view-actions>

    <v-card
      class="ma-auto mb-16"
      :color="settings.colors.iconColor"
      max-width="800"
      :style="{
        minHeight: '75vh',
        backgroundColor: settings.colors.topBarColor,
      }"
    >
      <v-container v-if="session.session">
        <v-card :border="settings.colors.backgroundColor">
          <v-card-subtitle
            class="text-left pa-2 pb-4"
            :style="{ color: settings.colors.textColor, fontSize: '22px' }"
          >
            {{ `${session.session.entity} - ${session.session.time}` }}
          </v-card-subtitle>
          <div v-for="(qa, index) of session.session.qas" :key="index">
            <v-divider></v-divider>
            <v-card-subtitle
              v-html="'Q: ' + qa.question + '</br>A: ' + qa.answer"
              class="text-left pa-2"
              :style="{ color: settings.colors.textColor }"
            >
            </v-card-subtitle>
          </div>
        </v-card>
      </v-container>
    </v-card>

    <v-slide-y-reverse-transition>
      <v-sheet
        v-if="editSheet"
        v-model="editSheet"
        :style="{ bottom: mobile ? '55px' : '0' }"
        max-width="800"
        min-width="100%"
        position="fixed"
        location="bottom"
      >
        <v-card :color="settings.colors.backgroundColor" max-height="600">
          <v-row align="center" justify="center" sticky>
            <v-col cols="6">
              <v-card-title>Edit Session</v-card-title>
            </v-col>
            <v-col cols="6">
              <v-btn
                @click="editSheet = false"
                class="float-right"
                color="transparent"
                variant="flat"
              >
                <v-icon color="orange darken-2">mdi-window-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-text class="pt-3">
            <v-text-field
              v-model="session.session.entity"
              label="Entity"
              :color="settings.colors.textColor"
            ></v-text-field>
            <div
              v-scroll.self="onScroll"
              class="overflow-y-auto"
              :style="{ maxHeight: '250px' }"
            >
              <div v-for="(qa, index) of session.session.qas" :key="index">
                <v-divider></v-divider>
                <v-text-field
                  v-model="qa.question"
                  label="Question"
                  :color="settings.colors.textColor"
                  class="mt-5"
                ></v-text-field>
                <v-text-field
                  v-model="qa.answer"
                  label="Answer"
                  :color="settings.colors.textColor"
                  class="mt-n3 mb-n2"
                >
                </v-text-field>
              </div>
            </div>
            <v-text-field v-model="session.session.time"></v-text-field>
            <v-btn
              @click="updateCompSession"
              :color="settings.colors.completeBtnColor"
              :block="true"
            >
              Submit
            </v-btn>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-slide-y-reverse-transition>
  </v-container>
</template>
