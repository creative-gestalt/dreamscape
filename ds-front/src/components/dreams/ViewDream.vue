<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { Dream, SubDream } from "@/interfaces/dream.interface";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { sleep } from "@/utils/constants";
import ViewActions from "@/components/shared/ViewActions.vue";
import axios from "axios";
import { server } from "@/utils/server";

// router
const router = useRouter();
const route = useRoute();
//stores
const mainStore = useMainStore();
const { settings } = storeToRefs(mainStore);
// data
const mobile = useDisplay().xs.value;
const id = ref("");
const dream = ref({} as Dream);
const dreamTime = ref("");
const keywords = ref("");
const edit = ref(false);
const max = ref("");
const selectedSubIndex = ref(0);
const selectedSubDream = ref({} as SubDream);
const editSheet = ref(false);
const tapDelete = ref(false);
const time = ref(
  new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })
);
// computed
const computedDay = computed(() =>
  dream.value.date
    ? new Date(dream.value.date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      })
    : ""
);
// methods
async function getDream(payload: Dream): Promise<Dream> {
  return await axios
    .get(`${server.baseURL}/getDream/${payload._id}`)
    .then((result) => result.data);
}
async function updateDream(payload: Dream): Promise<void> {
  return await axios.put(
    `${server.baseURL}/updateDream?dreamID=${payload._id}`,
    payload
  );
}
async function deleteDreams(payload: Dream[]): Promise<void> {
  await axios.post(`${server.baseURL}/deleteDreams`, payload);
}
function updateSubDream(): void {
  dream.value.dreams[selectedSubIndex.value].subDream =
    selectedSubDream.value.subDream;
  dream.value.dreams[selectedSubIndex.value].time = selectedSubDream.value.time;
  editSheet.value = false;
  submitDream();
}
function openEditArea(subDream: SubDream, index: number): void {
  selectedSubDream.value = subDream;
  selectedSubIndex.value = index;
  editSheet.value = true;
}
function addSubDream(): void {
  dream.value.dreams.push({ subDream: "", time: time.value });
  time.value = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const index = dream.value.dreams.length - 1;
  openEditArea(dream.value.dreams[index], index);
}
function cancelEdit(): void {
  dream.value.dreams.pop();
  editSheet.value = false;
}
function deleteSubDream(): void {
  dream.value.dreams.splice(selectedSubIndex.value, 1);
  editSheet.value = false;
  tapDelete.value = false;
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
  await updateDream({
    _id: id.value,
    date: newDate,
    dreams: dream.value.dreams,
    keywords: dream.value.keywords.length > 0 ? dream.value.keywords : [],
  });
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
  dream.value = await getDream({ _id: id.value } as Dream);
  dreamTime.value = dream.value.date.slice(11, 19);
  max.value = new Date().toISOString();
});

onMounted(async () => {
  if (route.path.includes("add")) {
    await sleep(500);
    await addSubDream();
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
      v-for="(dream, index) of dream.dreams"
      :key="index"
      class="ma-auto py-4 my-5"
      max-width="800"
      :color="settings.colors.topBarColor"
    >
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-card-subtitle
            class="text-left pb-3"
            :style="{ color: settings.colors.textColor }"
          >
            Dream {{ index + 1 }} -
            {{ dream.time ? dream.time : "No Time Set" }}
          </v-card-subtitle>
        </v-col>
        <v-col cols="4">
          <v-card-subtitle class="text-right pb-3">
            <v-icon @click="openEditArea(dream, index)" color="orange">
              mdi-pencil
            </v-icon>
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-card-subtitle
        class="text-left text-wrap"
        :style="{ color: settings.colors.textColor }"
      >
        {{ dream.subDream }}
      </v-card-subtitle>
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

    <v-slide-y-reverse-transition>
      <v-sheet
        v-if="editSheet"
        v-model="editSheet"
        :style="{ bottom: mobile ? '55px' : '0' }"
        max-width="800"
        min-width="100%"
        position="fixed"
        location="bottom center"
      >
        <v-card :color="settings.colors.topBarColor" variant="flat">
          <v-row align="center" justify="center">
            <v-col cols="6">
              <v-card-title>Edit Dream {{ selectedSubIndex + 1 }}</v-card-title>
            </v-col>
            <v-col cols="6">
              <v-row class="d-flex justify-end">
                <v-btn
                  @click="tapDelete = true"
                  class="float-right"
                  color="transparent"
                  :flat="true"
                >
                  <v-icon color="red darken-2">mdi-trash-can</v-icon>
                </v-btn>
                <v-btn
                  @click="cancelEdit"
                  class="float-right"
                  color="transparent"
                  :flat="true"
                >
                  <v-icon color="orange darken-2">mdi-window-close</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
          <v-container>
            <v-textarea
              ref="subDream"
              v-model="selectedSubDream.subDream"
              rows="6"
            >
              {{ selectedSubDream.subDream }}
            </v-textarea>
            <v-text-field v-model="selectedSubDream.time"></v-text-field>
            <v-btn
              @click="updateSubDream"
              :color="settings.colors.completeBtnColor"
              :block="true"
            >
              Submit
            </v-btn>
          </v-container>
        </v-card>
      </v-sheet>
    </v-slide-y-reverse-transition>

    <v-dialog v-model="tapDelete" max-width="300">
      <v-card :color="settings.colors.topBarColor">
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
