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
// data
const { gColors } = storeToRefs(mainStore);
const { gDate, updateLoading } = mainStore;
const { addSession, getAllSessions } = sessionStore;
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
        day: "numeric",
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
      date: gDate(),
      session: {
        entity: entity.value,
        qas: qas.value,
        time: time.value,
      },
    });
    await getAllSessions;
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
  date.value = max.value = mainStore.gDate();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-2 pt-3 ma-auto"
          max-width="800"
          :color="gColors.topBarColor"
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
                :style="{ color: gColors.textColor }"
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
            :color="gColors.textColor"
            @keyup.enter="questionRef.focus()"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="question"
            label="Question"
            :color="gColors.textColor"
            ref="questionRef"
            @keyup.enter="answerRef.focus()"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="answer"
            label="Answer"
            :color="gColors.textColor"
            ref="answerRef"
            :messages="time"
            @keyup.enter="addQuestionsAnswers({ question, answer })"
            density="compact"
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-2 ma-auto"
          max-width="800"
          :color="gColors.topBarColor"
          :hover="true"
        >
          <v-row class="mt-n3">
            <v-col cols="12">
              <v-btn
                @click="addQuestionsAnswers({ question, answer })"
                :color="gColors.backgroundColor"
                :style="{ color: gColors.textColor }"
                :block="true"
              >
                Add Q&A
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-date-picker
                v-model="date"
                :max-date="max"
                min-date="1950-01-01"
                :popover="{ visibility: 'click' }"
                :style="{
                  backgroundColor: gColors.backgroundColor,
                  borderRadius: '10px',
                }"
                is-dark
              >
                <template v-slot="{ inputEvents }">
                  <v-btn
                    v-on="inputEvents"
                    :color="gColors.backgroundColor"
                    :style="{ color: gColors.textColor }"
                    :block="true"
                  >
                    {{ computedDay }}
                  </v-btn>
                </template>
              </v-date-picker>
            </v-col>
            <v-col class="pl-1" cols="6">
              <v-btn
                @click="timeModal = true"
                :color="gColors.backgroundColor"
                :style="{ color: gColors.textColor }"
                :block="true"
              >
                <v-icon>mdi-clock-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="ma-auto" color="transparent" max-width="800">
      <v-btn
        class="mt-5"
        @click="completeSession"
        :color="gColors.completeBtnColor"
        :block="true"
        light
      >
        Complete
      </v-btn>
    </v-card>

    <SnackBar
      :toggle="snackbar"
      :timeout="timeout"
      :snack-text="snackText"
      @closeSnackbar="snackbar = false"
    ></SnackBar>

    <v-dialog v-model="timeModal" max-width="300">
      <v-card :color="gColors.topBarColor">
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
            :color="gColors.completeBtnColor"
            :block="true"
          >
            Set
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
