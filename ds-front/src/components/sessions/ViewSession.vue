<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useSessionStore } from "@/stores/sessions";
import { Session } from "@/interfaces/session.interface";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";

// router
const router = useRouter();
const route = useRoute();
// stores
const mainStore = useMainStore();
const sessionStore = useSessionStore();
const colors = mainStore.gColors;
const { gDate } = mainStore;
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
  await deleteSessions([session.value]);
  await getAllSessions();
  await router.push("/sessions");
}
onBeforeMount(async () => {
  id.value = String(route.params.id);
  session.value = await getSession({ _id: id.value } as Session);
  sessionTime.value = session.value.date.slice(11, 19);
  max.value = gDate();
});
</script>

<template>
  <v-container>
    <v-card
      class="ma-auto mb-16"
      :color="colors.topBarColor"
      max-width="800"
      variant="outlined"
      :style="{ minHeight: '75vh' }"
    >
      <v-container class="pb-0 mb-n2">
        <v-row>
          <v-col cols="10">
            <v-date-picker
              v-model="session.date"
              :max-date="max"
              min-date="1950-01-01"
              :popover="{ visibility: 'click' }"
              :style="{
                backgroundColor: colors.backgroundColor,
                borderRadius: '10px',
              }"
              is-dark
            >
              <template v-slot="{ inputEvents }">
                <v-btn
                  v-on="inputEvents"
                  :style="{ color: colors.iconColor }"
                  variant="outlined"
                  :block="true"
                >
                  {{ computedDay }}
                </v-btn>
              </template>
            </v-date-picker>
          </v-col>
          <v-col cols="2" class="d-flex justify-end">
            <v-menu min-width="175" offset-x left>
              <template #activator="{ props }">
                <v-btn v-bind="props" color="transparent" variant="flat">
                  <v-icon :color="colors.iconColor"> mdi-menu </v-icon>
                </v-btn>
              </template>
              <v-list :bg-color="colors.backgroundColor">
                <v-list-item link>
                  <v-list-item-title @click="editSheet = true">
                    Edit
                  </v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="deleteSession" style="color: red">
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="session.session">
        <v-card
          class="my-5"
          :border="colors.backgroundColor"
          variant="outlined"
        >
          <v-card-subtitle
            class="text-left pa-2"
            :style="{ color: colors.textColor }"
          >
            {{ `${session.session.entity} - ${session.session.time}` }}
          </v-card-subtitle>
          <div v-for="(qa, index) of session.session.qas" :key="index">
            <v-divider></v-divider>
            <v-card-subtitle
              v-html="'Q: ' + qa.question + '</br>A: ' + qa.answer"
              class="text-left pa-2"
              :style="{ color: colors.textColor }"
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
        <v-card :color="colors.backgroundColor" max-height="600">
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
              :color="colors.textColor"
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
                  :color="colors.textColor"
                  class="mt-5"
                ></v-text-field>
                <v-text-field
                  v-model="qa.answer"
                  label="Answer"
                  :color="colors.textColor"
                  class="mt-n3 mb-n2"
                >
                </v-text-field>
              </div>
            </div>
            <v-text-field v-model="session.session.time"></v-text-field>
            <v-btn
              @click="updateCompSession"
              :color="colors.completeBtnColor"
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
