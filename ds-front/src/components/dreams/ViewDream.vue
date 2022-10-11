<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";
import { Dream, SubDream } from "@/interfaces/dream.interface";
import { storeToRefs } from "pinia";
import router from "@/router";

//stores
const mainStore = useMainStore();
const dreamStore = useDreamStore();
const { gColors } = storeToRefs(mainStore);
const { gDate } = mainStore;
const { getDream, updateDream, getDreamsForPage, deleteDreams } = dreamStore;
// data
const id = ref("");
const dream = ref({} as Dream);
const dreamTime = ref("");
const keywords = ref("");
const edit = ref(false);
const date = ref("");
const max = ref("");
const message = ref("");
const timeModal = ref(false);
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
  date.value
    ? new Date(date.value).toLocaleString("en-US", {
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
  await updateDream({
    _id: id.value,
    date: dream.value.date + dreamTime.value,
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

onMounted(async () => {
  id.value = String(router.currentRoute.value.params.id);
  dream.value = await getDream({ _id: id.value } as Dream);
  dreamTime.value = dream.value.date.slice(11, 19);
  dream.value.date = dream.value.date.slice(0, 10);
  max.value = gDate();
});
</script>

<template>
  <v-container>
    <v-btn
      v-if="edit"
      @click="addSubDream"
      :color="gColors.completeBtnColor"
      fixed
      right
      bottom
      fab
    >
      +
    </v-btn>
    <v-card class="ma-auto mb-16" :color="gColors.topBarColor" max-width="800">
      <v-container class="pb-0 mb-n2">
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="8">
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
          <v-col cols="4" class="d-flex justify-end">
            <v-fade-transition>
              <v-btn v-if="edit" class="mr-3" @click="edit = false" icon>
                <v-icon color="orange"> mdi-window-close </v-icon>
              </v-btn>
              <v-btn v-else class="mr-3" @click="edit = true" icon>
                <v-icon :color="gColors.iconColor" dark>mdi-pencil</v-icon>
              </v-btn>
            </v-fade-transition>
            <v-menu min-width="175" offset-x left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                  <v-icon :color="gColors.iconColor" dark> mdi-menu </v-icon>
                </v-btn>
              </template>
              <v-list :color="gColors.backgroundColor">
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
          v-for="(dream, i) of dream.dreams"
          :key="i"
          class="my-5"
          :color="gColors.backgroundColor"
          outlined
        >
          <v-row align="center" justify="center">
            <v-col cols="6">
              <v-card-subtitle
                class="text-left"
                :style="{ color: gColors.textColor }"
              >
                Dream {{ i + 1 }} -
                {{ dream.time ? dream.time : "No Time Set" }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="6">
              <v-card-subtitle class="text-right">
                <v-fab-transition hide-on-leave>
                  <v-icon
                    v-if="edit"
                    @click="openEditArea(dream, i)"
                    color="orange"
                  >
                    mdi-pencil
                  </v-icon>
                </v-fab-transition>
              </v-card-subtitle>
            </v-col>
          </v-row>
          <v-card-subtitle
            v-html="dream.subDream.replaceAll('\n', '<br/>')"
            class="text-left"
            :style="{ color: gColors.textColor }"
          ></v-card-subtitle>
        </v-card>
      </v-container>
      <v-card-subtitle>
        <div :style="{ color: gColors.textColor }">keywords</div>
        <v-divider class="pb-2"></v-divider>
        <v-chip
          v-for="(keyword, i) of dream.keywords"
          :key="i"
          class="ma-1"
          :close="edit"
          :style="{ color: gColors.textColor }"
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
          :color="gColors.textColor"
          @click:append="addChip(keywords)"
          @keyup.enter="addChip(keywords)"
          outlined
          rounded
          dense
        ></v-text-field>
      </v-card-subtitle>
    </v-card>

    <v-bottom-sheet
      v-if="editSheet"
      v-model="editSheet"
      max-width="800"
      scrollable
      inset
    >
      <v-card :color="gColors.backgroundColor">
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="6">
            <v-card-title>Edit Dream {{ selectedSubIndex + 1 }}</v-card-title>
          </v-col>
          <v-col cols="6">
            <v-btn
              @click="tapDelete = true"
              class="float-right"
              color="red darken-2"
              text
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
        <v-container>
          <v-textarea
            ref="subDream"
            v-model="selectedSubDream.subDream"
            rows="6"
            outlined
          >
            {{ selectedSubDream.subDream }}
          </v-textarea>
          <v-text-field v-model="selectedSubDream.time"></v-text-field>
          <v-btn
            @click="updateSubDream"
            :color="gColors.completeBtnColor"
            block
          >
            Submit
          </v-btn>
        </v-container>
      </v-card>
    </v-bottom-sheet>
    <v-dialog v-model="tapDelete" max-width="300">
      <v-card :color="gColors.topBarColor">
        <v-card-title>Delete</v-card-title>
        <v-card-subtitle>Are you sure?</v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="tapDelete = false">Cancel</v-btn>
          <v-btn
            @click="deleteSubDream"
            :style="{ color: gColors.textColor }"
            :color="gColors.completeBtnColor"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
