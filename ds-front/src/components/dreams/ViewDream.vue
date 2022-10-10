<template>
  <v-container>
    <v-btn
      v-if="edit"
      @click="addSubDream"
      :color="gColors.completeBtnColor"
      light
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
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-card
                  v-bind="attrs"
                  v-on="on"
                  :color="gColors.backgroundColor | alpha('50%')"
                  outlined
                >
                  <v-card-title :style="{ color: gColors.textColor }">
                    {{ computedDate }}
                  </v-card-title>
                </v-card>
              </template>
              <v-date-picker
                v-model="dream.date"
                :max="max"
                min="1950-01-01"
                @change="saveDate"
                show-adjacent-months
              ></v-date-picker>
            </v-menu>
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
          :color="gColors.backgroundColor | alpha('50%')"
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
            :style="gColors.textColor | alpha('70%', true, 'color')"
          ></v-card-subtitle>
        </v-card>
      </v-container>
      <v-card-subtitle>
        <div :style="gColors.textColor | alpha('70%', true, 'color')">
          keywords
        </div>
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

<script lang="ts">
import Vue from "vue";
import { Dream, SubDream } from "@/interfaces/dream.interface";
import { mapState, mapStores } from "pinia";
import { useMainStore } from "@/stores/main";
import { useDreamStore } from "@/stores/dreams";

export default Vue.extend({
  name: "ViewDream",
  async created() {
    this.id = String(this.$route.params.id);
    this.dream = await this.dreamsStore.getDream({ _id: this.id } as Dream);
    this.dreamTime = this.dream.date.slice(10, 19);
    this.dream.date = this.dream.date.slice(0, 10);
    this.max = this.gDate().slice(0, 10);
  },
  data: () => ({
    id: "",
    dream: {} as Dream,
    dreamTime: "",
    keywords: "",
    edit: false,
    date: "",
    menu: false,
    max: "",
    message: "No Time Set",
    time: new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    timeModal: false,
    selectedSubIndex: 0,
    selectedSubDream: {} as SubDream,
    editSheet: false,
    tapDelete: false,
  }),
  methods: {
    updateSubDream(): void {
      this.dream.dreams[this.selectedSubIndex].subDream =
        this.selectedSubDream.subDream;
      this.dream.dreams[this.selectedSubIndex].time =
        this.selectedSubDream.time;
      this.editSheet = false;
      this.submitDream();
    },
    openEditArea(subDream: SubDream, index: number): void {
      this.selectedSubDream = subDream;
      this.selectedSubIndex = index;
      this.editSheet = true;
    },
    addSubDream(): void {
      this.dream.dreams.push({ subDream: "", time: this.time });
      this.time = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      const index = this.dream.dreams.length - 1;
      this.openEditArea(this.dream.dreams[index], index);
    },
    deleteSubDream(): void {
      this.dream.dreams.splice(this.selectedSubIndex, 1);
      this.editSheet = false;
      this.tapDelete = false;
      this.submitDream();
    },
    removeKeyword(item: string): void {
      this.dream.keywords = [...this.dream.keywords].filter((k) => k !== item);
      this.submitDream();
    },
    addChip(value: string): void {
      this.dream.keywords.push(value);
      this.keywords = "";
      this.submitDream();
    },
    saveDate(date: Date) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$refs.menu.save(date);
      this.submitDream();
    },
    async submitDream(): Promise<void> {
      await this.dreamsStore.updateDream({
        _id: this.id,
        date: this.dream.date + this.dreamTime,
        dreams: this.dream.dreams,
        keywords: this.dream.keywords.length > 0 ? this.dream.keywords : [],
      });
      await this.dreamsStore.getDreamsForPage({
        skip: 0,
        limit: 13,
      });
    },
    async deleteDream(): Promise<void> {
      const answer = confirm("Are you sure?");
      if (answer) {
        await this.dreamsStore.deleteDreams([this.dream]);
        await this.dreamsStore.getDreamsForPage({
          skip: 0,
          limit: 13,
        });
        await this.$router.push("/dreams");
      }
    },
  },
  computed: {
    ...mapStores(useMainStore, useDreamStore),
    ...mapState(useMainStore, ["gDate", "gColors"]),
    ...mapState(useDreamStore, ["gDreams", "gDreamsCount"]),
    computedDate(): string {
      return this.dream.date
        ? new Date(this.dream.date + this.dreamTime).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";
    },
  },
});
</script>
