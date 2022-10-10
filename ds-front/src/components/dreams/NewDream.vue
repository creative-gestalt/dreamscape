<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
// import { useDisplay } from "vuetify";
import { computed, onMounted, ref } from "vue";
import { SubDream } from "@/interfaces/dream.interface";

const mainStore = useMainStore();
const dreamStore = useDreamStore();
// const loading = mainStore.gLoading;
const colors = mainStore.gColors;
// const mobile = useDisplay().xs;
const date = ref("");
const menu = ref(false);
const max = ref("");
const dream = ref("");
const keywords = ref("");
const dreams = ref([] as SubDream[]);
const chips = ref([] as string[]);
const snackbar = ref(false);
const snackText = ref("");
const timeModal = ref(false);
const timeout = 3000;
const time = ref(
  new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })
);
// refs
const dreamRef = ref(null);
const menuRef = ref(null);
const timeRef = ref(null);

const computedDay = computed(() =>
  date.value
    ? new Date(date.value + mainStore.gDate().slice(10, 19)).toLocaleString(
        "en-US",
        { month: "short", day: "numeric" }
      )
    : ""
);

function openTimeModal(): void {
  timeModal.value = true;
}
function setNewTime(): void {
  time.value = String(timeRef.value);
}
function deleteSubDream(index: number): void {
  dreams.value.splice(index, 1);
}
function removeKeyword(item: string): void {
  chips.value = [...chips.value].filter((k) => k !== item);
}
// function saveDate(date: Date) {
// menuRef.value.save(date);
// }
function addDream(dreamText: string, refocus = true): void {
  if (dreamText) {
    dreams.value.push({ subDream: dreamText, time: time.value });
    dream.value = "";
    if (refocus) {
      // if (dreamRef.value) dreamRef.value.focus();
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
      date: date.value + mainStore.gDate().slice(10, 19),
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
  date.value = max.value = mainStore.gDate().slice(0, 10);
});
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card
          class="pa-2 ma-auto"
          max-width="800"
          :color="colors.topBarColor"
          :hover="true"
        >
          <v-chip
            v-for="(dream, index) of dreams"
            :key="dream + index"
            class="mb-2 mx-1"
            :style="{ color: colors.textColor }"
            @click:close="deleteSubDream(index)"
            outlined
            closable
            label
          >
            {{ $filters.truncate(dream.subDream, 7) }} {{ dream.time }}
          </v-chip>
          <v-textarea
            v-model="dream"
            ref="dreamRef"
            label="Dream"
            rows="8"
            :messages="time"
            :color="colors.textColor"
            filled
            dense
          ></v-textarea>
          <v-row class="mb-3 mt-0">
            <v-col cols="12">
              <v-btn
                @click="addDream(dream)"
                :color="colors.backgroundColor"
                :style="{ color: colors.textColor }"
                :block="true"
              >
                Add Dream
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="mt-n7">
            <v-col class="pr-1" cols="6">
              <v-menu
                ref="menuRef"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="auto"
                offset-y
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :color="colors.backgroundColor"
                    :style="{ color: colors.textColor }"
                    :block="true"
                  >
                    {{ computedDay }}
                  </v-btn>
                </template>
              </v-menu>
            </v-col>
            <v-col class="pl-1" cols="6">
              <v-btn
                @click="openTimeModal"
                :color="colors.backgroundColor"
                :style="{ color: colors.textColor }"
                :block="true"
              >
                <v-icon>mdi-clock-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card
          class="pa-2 mt-5 ma-auto"
          max-width="800"
          :color="colors.topBarColor"
          :hover="true"
        >
          <v-chip
            v-for="(chip, index) in chips"
            :key="chip + index"
            @click:close="removeKeyword(chip)"
            class="mx-1 mb-1"
            closeable
            outlined
            label
          >
            {{ chip }}
          </v-chip>
          <v-text-field
            class="mb-n6"
            v-model="keywords"
            label="Keywords"
            append-icon="mdi-check"
            :color="colors.textColor"
            @click:append="addChip(keywords)"
            @keyup.enter="addChip(keywords)"
            outlined
            rounded
            dense
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="ma-auto" max-width="800">
      <v-btn
        class="mt-5"
        @click="completeDream"
        :color="colors.completeBtnColor"
        :block="true"
        light
      >
        Complete
      </v-btn>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="timeout" dark>
      {{ snackText }}
      <template v-slot:actions>
        <v-btn color="black" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="timeModal" max-width="300">
      <v-card :color="colors.topBarColor">
        <v-card-title>Set Time</v-card-title>
        <v-container>
          <v-text-field ref="timeRef" :value="time" filled outlined>
            {{ time }}
          </v-text-field>
          <v-btn
            @click="setNewTime"
            :color="colors.completeBtnColor"
            :block="true"
            light
          >
            Set
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
