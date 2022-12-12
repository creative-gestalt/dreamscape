<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useSessionStore } from "@/stores/sessions";
import { storeToRefs } from "pinia";
import { QA } from "@/interfaces/session.interface";
import SnackBar from "@/components/shared/SnackBar.vue";

// stores
const mainStore = useMainStore();
const sessionStore = useSessionStore();
const { settings } = storeToRefs(mainStore);
const { mstDate, updateLoading } = mainStore;
const { addSession, getAllSessions } = sessionStore;
// data
const qas = ref([] as QA[]);
const entity = ref("");
const question = ref("");
const answer = ref("");
const timeout = 3000;
const snackbar = ref(false);
const snackText = ref("");
const timeModal = ref(false);
const date = ref("");
const max = ref("");
const time = ref(
  new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })
);
// template refs
const questionRef = ref(null as any);
const answerRef = ref(null as any);
const timeRef = ref(null as any);
// computed
const computedDay = computed(() =>
  date.value
    ? new Date(date.value).toLocaleString("en-US", {
        month: "short",
      })
    : ""
);
// methods
function setNewTime(): void {
  time.value = String(timeRef.value.value);
  timeModal.value = false;
}
function deleteQuestionsAnswers(index: number): void {
  qas.value.splice(index, 1);
}
function addQuestionsAnswers(qa: QA): void {
  if (qa.question.length && qa.answer.length) {
    qas.value.push(qa);
    question.value = "";
    answer.value = "";
    questionRef.value.focus();
  } else {
    // snackText.value = "Session cannot be empty";
    // snackbar.value = true;
  }
}
async function completeSession(): Promise<void> {
  await updateLoading(true);
  if (
    entity.value.length > 0 &&
    question.value.length > 0 &&
    answer.value.length > 0
  )
    addQuestionsAnswers({
      question: question.value,
      answer: answer.value,
    });
  if (date.value && entity.value.length > 0 && qas.value.length > 0) {
    await addSession({
      date: mstDate(),
      session: {
        entity: entity.value,
        qas: qas.value,
        time: time.value,
      },
    });
    await getAllSessions();
    entity.value = "";
    qas.value = [];
    snackText.value = "Successfully added session";
  } else {
    snackText.value = "No sessions to submit";
  }
  await updateLoading(false);
  snackbar.value = true;
}

onMounted(() => {
  date.value = max.value = new Date().toISOString();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-2 pt-3 ma-auto"
          max-width="800"
          :color="settings.colors.topBarColor"
          :hover="true"
        >
          <v-row class="align-center">
            <v-col cols="1">
              <p class="mb-3 mr-1 grey--text text-no-wrap">Q&A:</p>
            </v-col>
            <v-col cols="11">
              <v-chip
                v-for="(qa, index) of qas"
                :key="qa + index"
                class="mb-2 mx-1"
                :style="{ color: settings.colors.textColor }"
                @click:close="deleteQuestionsAnswers(index)"
                closable
                label
              >
                QA {{ index + 1 }}
              </v-chip>
            </v-col>
          </v-row>
          <v-text-field
            v-model="entity"
            label="Entity"
            :color="settings.colors.textColor"
            @keyup.enter="questionRef.focus()"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="question"
            label="Question"
            :color="settings.colors.textColor"
            ref="questionRef"
            @keyup.enter="answerRef.focus()"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="answer"
            label="Answer"
            :color="settings.colors.textColor"
            ref="answerRef"
            :messages="time"
            @keyup.enter="addQuestionsAnswers({ question, answer })"
            density="compact"
          ></v-text-field>

          <v-row class="flex-nowrap mt-2" no-gutters>
            <v-date-picker
              timezone="America/Boise"
              v-model="date"
              :max-date="max"
              min-date="1950-01-01"
              :popover="{ visibility: 'click', placement: 'top' }"
              :style="{
                borderColor: settings.colors.iconColor,
                backgroundColor: settings.colors.topBarColor,
              }"
              is-dark
            >
              <template v-slot="{ inputEvents }">
                <v-btn
                  class="mr-1"
                  v-on="inputEvents"
                  :color="settings.colors.backgroundColor"
                  :style="{ color: settings.colors.textColor }"
                  :icon="true"
                  size="small"
                >
                  {{ computedDay }}
                </v-btn>
              </template>
            </v-date-picker>
            <v-btn
              class="mr-1"
              @click="timeModal = true"
              :color="settings.colors.backgroundColor"
              :style="{ color: settings.colors.textColor }"
              :icon="true"
              size="small"
            >
              <v-icon>mdi-clock-outline</v-icon>
            </v-btn>
            <v-btn
              width="74%"
              @click="addQuestionsAnswers({ question, answer })"
              :color="settings.colors.backgroundColor"
              :style="{ color: settings.colors.textColor }"
              :rounded="true"
            >
              Add Q&A
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-sheet class="ma-auto" color="transparent" max-width="800">
      <v-btn
        class="mt-5"
        @click="completeSession"
        :color="settings.colors.completeBtnColor"
        :block="true"
      >
        Complete
      </v-btn>
    </v-sheet>

    <SnackBar
      :toggle="snackbar"
      :timeout="timeout"
      :snack-text="snackText"
      @closeSnackbar="snackbar = false"
    ></SnackBar>

    <v-dialog v-model="timeModal" max-width="300">
      <v-card :color="settings.colors.topBarColor">
        <v-card-title>Set Time</v-card-title>
        <v-container>
          <v-text-field
            ref="timeRef"
            :model-value="time"
            @keyup.enter="setNewTime"
            autofocus
          >
          </v-text-field>
          <v-btn
            @click="setNewTime"
            :color="settings.colors.completeBtnColor"
            :block="true"
          >
            Set
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
