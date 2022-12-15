<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { storeToRefs } from "pinia";
import { SubDream } from "@/interfaces/dream.interface";
import SnackBar from "@/components/shared/SnackBar.vue";

// stores
const mainStore = useMainStore();
const dreamStore = useDreamStore();
const { settings } = storeToRefs(mainStore);
// data
const date = ref("");
const max = ref("");
const dream = ref("");
const keywords = ref("");
const dreams = ref([] as SubDream[]);
const chips = ref([] as string[]);
const timeout = 3000;
const snackbar = ref(false);
const snackText = ref("");
const timeModal = ref(false);
const time = ref(
  new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })
);
// template refs
const dreamRef = ref(null as any);
const timeRef = ref(null as any);
// computed
const computedDay = computed(() =>
  date.value
    ? new Date(date.value).toLocaleString("en-US", {
        day: "numeric",
      })
    : ""
);
// methods
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
    await dreamStore.addDream({
      date: date.value,
      dreams: dreams.value,
      keywords:
        chips.value.length > 0
          ? chips.value
          : keywords.value
          ? [keywords.value]
          : [],
    });
    await dreamStore.getDreamsForPage({
      skip: 0,
      limit: 13,
    });
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
  date.value = max.value = new Date().toISOString();
});
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card
          class="pa-2 ma-auto"
          max-width="800"
          :color="settings.colors.topBarColor"
          :hover="true"
        >
          <v-chip
            v-for="(dream, index) of dreams"
            :key="dream + index"
            class="mb-2 mx-1"
            :style="{ color: settings.colors.textColor }"
            @click:close="deleteSubDream(index)"
            closable
            label
          >
            {{ $filters.truncate(dream.subDream, 7) }} {{ dream.time }}
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
              @click="addDream(dream)"
              :color="settings.colors.backgroundColor"
              :style="{ color: settings.colors.textColor }"
              :rounded="true"
            >
              Add Dream
            </v-btn>
          </v-row>
        </v-card>
        <v-card
          class="pa-2 mt-5 ma-auto"
          max-width="800"
          :color="settings.colors.topBarColor"
          :hover="true"
        >
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
          <v-text-field
            class="mb-n6"
            v-model="keywords"
            label="Keywords"
            append-icon="mdi-check"
            :color="settings.colors.textColor"
            @click:append="addChip(keywords)"
            @keyup.enter="addChip(keywords)"
            density="compact"
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <v-sheet class="ma-auto" color="transparent" max-width="800">
      <v-btn
        class="mt-5"
        @click="completeDream"
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

    <v-dialog v-model="timeModal" max-width="300" dark>
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
