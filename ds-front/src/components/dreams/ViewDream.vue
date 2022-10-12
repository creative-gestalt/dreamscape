<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { Dream, SubDream } from "@/interfaces/dream.interface";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";

// router
const router = useRouter();
const route = useRoute();
//stores
const mainStore = useMainStore();
const dreamStore = useDreamStore();
const colors = mainStore.gColors;
const { gDate } = mainStore;
const { getDream, updateDream, getDreamsForPage, deleteDreams } = dreamStore;
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
  await getDreamsForPage({
    skip: 0,
    limit: 13,
  });
}
async function deleteDream(): Promise<void> {
  const answer = confirm("Are you sure?");
  if (answer) {
    await deleteDreams([dream.value]);
    await getDreamsForPage({
      skip: 0,
      limit: 13,
    });
    await router.push("/dreams");
  }
}

onBeforeMount(async () => {
  id.value = String(route.params.id);
  dream.value = await getDream({ _id: id.value } as Dream);
  dreamTime.value = dream.value.date.slice(11, 19);
  max.value = gDate();
});
</script>

<template>
  <v-container>
    <v-btn
      v-if="edit"
      @click="addSubDream"
      :color="colors.completeBtnColor"
      position="fixed"
      location="bottom right"
      rounded
    >
      +
    </v-btn>
    <v-card
      class="ma-auto mb-16"
      :color="colors.topBarColor"
      max-width="800"
      variant="outlined"
      :style="{ minHeight: '75vh' }"
    >
      <v-container class="pb-0 mb-n2">
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="8">
            <v-date-picker
              v-model="dream.date"
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
                  :style="{ color: colors.topBarColor }"
                  variant="outlined"
                  :block="true"
                >
                  {{ computedDay }}
                </v-btn>
              </template>
            </v-date-picker>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-fade-transition>
              <v-icon
                v-if="edit"
                class="mr-3"
                @click="edit = false"
                color="orange"
              >
                mdi-window-close
              </v-icon>
              <v-icon
                v-else
                class="mr-3"
                @click="edit = true"
                :color="colors.iconColor"
              >
                mdi-pencil
              </v-icon>
            </v-fade-transition>
            <v-menu min-width="175" offset-x left>
              <template #activator="{ props }">
                <v-icon v-bind="props" :color="colors.iconColor">
                  mdi-menu
                </v-icon>
              </template>
              <v-list :color="colors.backgroundColor">
                <v-list-item link>
                  <v-list-item-title @click="deleteDream" style="color: red">
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-card
          v-for="(dream, index) of dream.dreams"
          :key="index"
          class="py-4 my-5"
          :color="colors.topBarColor"
          variant="outlined"
        >
          <v-row align="center" justify="center">
            <v-col cols="8">
              <v-card-subtitle
                class="text-left pb-3"
                :style="{ color: colors.textColor }"
              >
                Dream {{ index + 1 }} -
                {{ dream.time ? dream.time : "No Time Set" }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="text-right pb-3">
                <v-fab-transition hide-on-leave>
                  <v-icon
                    v-if="edit"
                    @click="openEditArea(dream, index)"
                    color="orange"
                  >
                    mdi-pencil
                  </v-icon>
                </v-fab-transition>
              </v-card-subtitle>
            </v-col>
          </v-row>
          <v-card-subtitle
            class="text-left text-wrap"
            :style="{ color: colors.textColor }"
          >
            {{ dream.subDream }}
          </v-card-subtitle>
        </v-card>
      </v-container>
      <v-card-subtitle>
        <div :style="{ color: colors.textColor }">keywords</div>
        <v-divider class="pb-2"></v-divider>
        <v-chip
          v-for="(keyword, index) of dream.keywords"
          :key="index"
          class="ma-1"
          :close="edit"
          :style="{ color: colors.textColor }"
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
          :color="colors.textColor"
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
        <v-card :color="colors.topBarColor" variant="flat">
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
                  @click="editSheet = false"
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
              :color="colors.completeBtnColor"
              :block="true"
            >
              Submit
            </v-btn>
          </v-container>
        </v-card>
      </v-sheet>
    </v-slide-y-reverse-transition>

    <v-dialog v-model="tapDelete" max-width="300">
      <v-card :color="colors.topBarColor">
        <v-card-title>Delete</v-card-title>
        <v-card-subtitle>Are you sure?</v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="tapDelete = false">Cancel</v-btn>
          <v-btn
            @click="deleteSubDream"
            :style="{ color: colors.textColor }"
            :color="colors.completeBtnColor"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
