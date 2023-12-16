<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store/main";
import { useDreamStore } from "@/store/dreams";
import { storeToRefs } from "pinia";
import { SubDream } from "@/interfaces/dream.interface";
import SnackBar from "@/components/shared/SnackBar.vue";
import axios from "axios";
import { server } from "@/utils/server";

// stores
const dreamStore = useDreamStore();
const { todaysDream } = storeToRefs(dreamStore);
const mainStore = useMainStore();
const { settings, refreshDreamList } = storeToRefs(mainStore);
// data
const date = ref({} as Date);
const max = ref({} as Date);
const dream = ref("");
const keywords = ref("");
const dreams = ref([] as SubDream[]);
const todaysSubDreamCount = ref(0);
const chips = ref([] as string[]);
const timeout = 3000;
const snackbar = ref(false);
const snackText = ref("");
const tapDelete = ref(false);
const calendarModal = ref(false);
const timeModal = ref(false);
const keywordsModal = ref(false);
const time = ref(
  new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }),
);
// template refs
const dreamRef = ref(null as any);
const timeRef = ref(null as any);
// methods
function getTodaysSubDreamCount(): void {
  const dreamDate = new Date(todaysDream.value.date).toLocaleDateString(
    "en-US",
  );
  const todaysDate = date.value.toLocaleDateString("en-US");
  if (dreamDate === todaysDate) {
    todaysSubDreamCount.value = todaysDream.value.dreams.length;
  }
}
function setNewTime(): void {
  time.value = String(timeRef.value.value);
  timeModal.value = false;
}
function deleteSubDream(index: number): void {
  dreams.value.splice(index, 1);
}
function removeKeyword(item: string): void {
  chips.value = [...chips.value].filter((k) => k !== item);
}
function addDream(dreamText: string, refocus = true): void {
  if (dreamText) {
    dreams.value.push({ subDream: dreamText, time: time.value });
    dream.value = "";
    if (refocus) {
      if (dreamRef.value) dreamRef.value.focus();
    }
  } else {
    snackText.value = "Dream cannot be empty";
    snackbar.value = true;
  }
  time.value = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
function addChip(value: string): void {
  if (value && !chips.value.includes(value)) {
    chips.value.push(value);
    keywords.value = "";
  } else {
    snackText.value = chips.value.includes(value)
      ? "Cannot save duplicate keywords"
      : "Keyword cannot be empty";
    snackbar.value = true;
  }
}
async function completeDream(): Promise<void> {
  await mainStore.updateLoading(true);
  if (dream.value.length > 0) addDream(dream.value, false);
  if (date.value && dreams.value.length > 0) {
    await axios.post(`${server.baseURL}/addDream`, {
      date: date.value.toISOString(),
      dreams: dreams.value,
      keywords:
        chips.value.length > 0
          ? chips.value
          : keywords.value
            ? [keywords.value]
            : [],
    });
    refreshDreamList.value++;
    dream.value = "";
    dreams.value = [] as SubDream[];
    keywords.value = "";
    chips.value = [] as string[];
    snackText.value = "Successfully added dream";
  } else {
    snackText.value = "No dreams to submit";
  }
  await mainStore.updateLoading(false);
  snackbar.value = true;
}

onMounted(() => {
  date.value = max.value = new Date();
  getTodaysSubDreamCount();
});
</script>

<template>
  <v-container>
    <v-card
      v-if="todaysSubDreamCount > 0"
      class="pa-0 mb-2"
      color="transparent"
      density="compact"
    >
      <v-card-text class="my-n2">
        <v-row class="align-center" no-gutters>
          <v-col cols="2">
            <v-avatar :color="settings.colors.textColor">{{
              todaysSubDreamCount
            }}</v-avatar>
          </v-col>
          <v-col cols="4">
            <div>Dreams Today</div>
          </v-col>
          <v-col cols="6">
            <v-btn
              class="float-right"
              :to="`/dream/${todaysDream._id}/add`"
              :color="settings.colors.textColor"
              icon="mdi-plus"
              variant="text"
            >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="pa-2 ma-auto" color="transparent" max-width="800">
          <v-chip
            v-for="(dream, index) of dreams"
            :key="dream.subDream + index"
            class="mb-2 mx-1"
            :style="{ color: settings.colors.textColor }"
            @click:close="deleteSubDream(index)"
            closable
            label
          >
            {{ dream.subDream }} {{ dream.time }}
          </v-chip>
          <v-textarea
            v-model="dream"
            ref="dreamRef"
            label="Dream"
            rows="10"
            :messages="time"
            :color="settings.colors.textColor"
            density="compact"
          ></v-textarea>
          <v-row class="flex-nowrap">
            <v-col cols="9" class="text-left">
              <v-btn
                class="mr-1"
                @click="calendarModal = true"
                :style="{ color: settings.colors.textColor }"
                icon="mdi-calendar"
                size="small"
              ></v-btn>
              <v-btn
                class="mr-1"
                @click="timeModal = true"
                :style="{ color: settings.colors.textColor }"
                icon="mdi-clock-outline"
                size="small"
              ></v-btn>
              <v-btn
                class="mr-1"
                @click="keywordsModal = true"
                :style="{ color: settings.colors.textColor }"
                icon="mdi-key-plus"
                size="small"
              ></v-btn>
            </v-col>
            <v-col cols="3" class="text-right">
              <v-btn
                @click="addDream(dream)"
                :style="{ color: settings.colors.textColor }"
                size="small"
                icon="mdi-layers-plus"
              ></v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      class="mt-6"
      @click="completeDream"
      :color="settings.colors.completeBtnColor"
      style="float: right"
      variant="tonal"
      icon="mdi-check-all"
    ></v-btn>

    <SnackBar
      :toggle="snackbar"
      :timeout="timeout"
      :snack-text="snackText"
      @closeSnackbar="snackbar = false"
    ></SnackBar>

    <v-dialog v-model="calendarModal" max-width="350" theme="light">
      <v-date-picker
        v-model="date"
        :max="max"
        max-width="350"
        theme="dark"
      ></v-date-picker>
    </v-dialog>

    <v-dialog v-model="timeModal" max-width="300" theme="light">
      <v-card color="#222222">
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

    <v-dialog v-model="keywordsModal" max-width="300" theme="light">
      <v-card color="#222222">
        <v-card-title>Keywords</v-card-title>
        <v-container>
          <v-text-field
            v-model="keywords"
            label="Add new keyword here"
            append-icon="mdi-check"
            :color="settings.colors.textColor"
            @click:append="addChip(keywords)"
            @keyup.enter="addChip(keywords)"
            density="compact"
          ></v-text-field>
          <v-chip
            v-for="(chip, index) in chips"
            :key="chip + index"
            :style="{ color: settings.colors.textColor }"
            @click:close="removeKeyword(chip)"
            class="mx-1 mb-1"
            closable
            label
          >
            {{ chip }}
          </v-chip>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tapDelete" max-width="300">
      <v-card color="#222222">
        <v-card-title>Delete</v-card-title>
        <v-card-subtitle>Are you sure?</v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="tapDelete = false">Cancel</v-btn>
          <v-btn
            @click="deleteSubDream"
            :style="{ color: settings.colors.textColor }"
            :color="settings.colors.completeBtnColor"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
