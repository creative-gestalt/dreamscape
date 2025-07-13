<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useMainStore } from "@/store/main";
import { storeToRefs } from "pinia";
import { Dream, SubDream } from "@/interfaces/dream.interface";
import { useRoute, useRouter } from "vue-router";
import { sleep } from "@/utils/constants";
import ViewActions from "@/components/shared/ViewActions.vue";
import { getDream, updateDream, deleteDreams } from "@/services/dream.service";

// router
const router = useRouter();
const route = useRoute();
//stores
const mainStore = useMainStore();
const { settings } = storeToRefs(mainStore);
// data
const id = ref("");
const dream = ref({} as Dream);
const dreamTime = ref("");
const keywords = ref("");
const edit = ref(false);
const max = ref({} as Date);
const selectedSubIndex = ref(-1);
const selectedSubDream = ref({} as SubDream);
const addingDream = ref(false);
const tapDelete = ref(false);
const time = ref(
  new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }),
);
// computed
const computedDay = computed(() =>
  dream.value.date
    ? new Date(dream.value.date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "",
);
const isEditing = (index: number) => {
  return selectedSubIndex.value === index;
};
// methods
function updateSubDream(): void {
  dream.value.dreams[selectedSubIndex.value] = selectedSubDream.value;
  selectedSubIndex.value = -1;
  submitDream();
}
function openEditArea(subDream: SubDream, index: number): void {
  selectedSubDream.value = subDream;
  selectedSubIndex.value = index;
}
function addSubDream(): void {
  addingDream.value = true;
  dream.value.dreams.push({ subDream: "", time: time.value });
  time.value = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const index = dream.value.dreams.length - 1;
  openEditArea(dream.value.dreams[index], index);
}
function deleteConfirmation(): void {
  if (addingDream.value) {
    dream.value.dreams.pop();
    addingDream.value = false;
    selectedSubIndex.value = -1;
  } else {
    tapDelete.value = true;
  }
}
function deleteSubDream(): void {
  dream.value.dreams.splice(selectedSubIndex.value, 1);
  tapDelete.value = false;
  selectedSubIndex.value = -1;
  submitDream();
}
function removeKeyword(item: string): void {
  dream.value.keywords = [...dream.value.keywords].filter((k) => k !== item);
  submitDream();
}
function addChip(value: string): void {
  dream.value.keywords.push(value);
  keywords.value = "";
  submitDream();
}
async function submitDream(): Promise<void> {
  const date = new Date(dream.value.date).toISOString();
  const newDate =
    date.slice(0, 11) + dreamTime.value + date.slice(19, date.length);
  await updateDream(id.value, {
    _id: id.value,
    date: newDate,
    dreams: dream.value.dreams,
    keywords: dream.value.keywords.length > 0 ? dream.value.keywords : [],
  });
  addingDream.value = false;
}
async function deleteDream(): Promise<void> {
  const answer = confirm("Are you sure?");
  if (answer) {
    await deleteDreams([dream.value]);
    await router.push("/dreams");
  }
}

onBeforeMount(async () => {
  id.value = String(route.params.id);
  dream.value = (await getDream(id.value)) as Dream;
  dreamTime.value = dream.value.date.slice(11, 19);
  max.value = new Date();
});

onMounted(async () => {
  if (route.path.includes("add")) {
    await sleep(500);
    addSubDream();
  }
});
</script>

<template>
  <v-container>
    <view-actions
      class="mb-4"
      :day="computedDay"
      :delete-function="deleteDream"
      :action-function="addSubDream"
      :action-icon="'mdi-plus'"
    >
    </view-actions>

    <v-card
      v-for="(d, index) of dream.dreams"
      :key="index"
      class="ma-auto py-4 my-5"
      max-width="800"
      color="transparent"
    >
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-card-subtitle
            v-if="!isEditing(index)"
            class="text-left pb-3"
            :style="{ color: settings.colors.textColor }"
          >
            Dream {{ index + 1 }} -
            {{ d.time ? d.time : "No Time Set" }}
          </v-card-subtitle>
          <v-text-field
            v-if="isEditing(index)"
            v-model="d.time"
            variant="solo"
            density="compact"
          >
          </v-text-field>
        </v-col>
        <v-col cols="4">
          <v-card-subtitle class="text-right pb-3">
            <v-icon
              v-if="!isEditing(index)"
              @click="openEditArea(d, index)"
              color="orange"
            >
              mdi-pencil
            </v-icon>
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-card-subtitle
        v-if="!isEditing(index)"
        class="text-left text-wrap"
        :style="{ color: settings.colors.textColor }"
      >
        {{ d.subDream }}
      </v-card-subtitle>
      <v-textarea
        v-if="isEditing(index)"
        v-model="d.subDream"
        variant="solo"
        density="compact"
      ></v-textarea>
      <v-card-actions v-if="isEditing(index)">
        <v-btn color="red" @click="deleteConfirmation" variant="tonal">
          Delete
        </v-btn>
        <v-spacer />
        <v-btn color="green" @click="updateSubDream" variant="tonal">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="ma-auto" max-width="800" color="transparent">
      <v-card-subtitle>
        <div :style="{ color: settings.colors.textColor }">keywords</div>
        <v-divider class="pb-2"></v-divider>
        <v-chip
          v-for="(keyword, index) of dream.keywords"
          :key="index"
          class="ma-1"
          :close="edit"
          :style="{ color: settings.colors.textColor }"
          @click:close="removeKeyword(keyword)"
          outlined
        >
          {{ keyword }}
        </v-chip>
        <v-text-field
          v-if="edit"
          class="mb-n6"
          v-model="keywords"
          label="Keywords"
          append-icon="mdi-check"
          :color="settings.colors.textColor"
          @click:append="addChip(keywords)"
          @keyup.enter="addChip(keywords)"
        ></v-text-field>
      </v-card-subtitle>
    </v-card>

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
