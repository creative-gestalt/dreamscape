<template>
  <v-container>
    <v-card class="ma-auto" :color="gColors.topBarColor" max-width="800">
      <v-container class="pb-0 mb-n2">
        <v-row align="center" justify="center" no-gutters>
          <v-col cols="10">
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
                v-model="session.date"
                :max="max"
                min="1950-01-01"
                @change="saveDate"
                show-adjacent-months
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2" class="d-flex justify-center">
            <v-menu min-width="175" offset-x left>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  :color="gColors.iconColor"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-menu
                </v-icon>
              </template>
              <v-list :color="gColors.backgroundColor">
                <v-list-item link>
                  <v-list-item-title @click="editSheet = true">
                    Edit
                  </v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="deleteSession" style="color: red">
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="session.session">
        <v-card
          class="my-5"
          :color="gColors.backgroundColor | alpha('50%')"
          outlined
        >
          <v-card-subtitle
            class="text-left"
            :style="{ color: gColors.textColor }"
          >
            {{ `${session.session.entity} - ${session.session.time}` }}
          </v-card-subtitle>
          <div v-for="(qa, i) of session.session.qas" :key="i">
            <v-divider></v-divider>
            <v-card-subtitle
              v-html="'Q: ' + qa.question + '</br>A: ' + qa.answer"
              class="text-left"
              :style="gColors.textColor | alpha('70%', true, 'color')"
            >
            </v-card-subtitle>
          </div>
        </v-card>
      </v-container>
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
            <v-card-title>Edit Session</v-card-title>
          </v-col>
          <v-col cols="6">
            <v-btn
              @click="editSheet = false"
              class="float-right"
              color="red darken-2"
              text
            >
              Close
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text class="pt-3">
          <v-text-field
            v-model="session.session.entity"
            label="Entity"
            :color="gColors.textColor"
            outlined
            shaped
            dense
          ></v-text-field>
          <div v-for="(qa, i) of session.session.qas" :key="i">
            <v-divider></v-divider>
            <v-text-field
              v-model="qa.question"
              label="Question"
              :color="gColors.textColor"
              class="mt-5"
              outlined
              shaped
              dense
            ></v-text-field>
            <v-text-field
              v-model="qa.answer"
              label="Answer"
              :color="gColors.textColor"
              class="mt-n3 mb-n2"
              outlined
              shaped
              dense
            >
              {{ qa.answer }}
            </v-text-field>
          </div>
          <v-text-field v-model="session.session.time"></v-text-field>
          <v-btn @click="updateSession" :color="gColors.completeBtnColor" block>
            Submit
          </v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Session } from "@/interfaces/session.interface";
import { mapState, mapStores } from "pinia";
import { useMainStore } from "@/stores/main";
import { useSessionStore } from "@/stores/sessions";

export default Vue.extend({
  name: "ViewSession",
  async created() {
    this.id = String(this.$route.params.id);
    this.session = await this.sessionsStore.getSession({ _id: this.id });
    this.sessionTime = this.session.date?.slice(10, 19) || "";
    this.session.date = this.session.date?.slice(0, 10);
    this.max = this.gDate().slice(0, 10);
  },
  data: () => ({
    id: "",
    session: {} as Session,
    sessionTime: "",
    keywords: "",
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
    editSheet: false,
  }),
  methods: {
    updateSession(): void {
      this.editSheet = false;
      this.submitSession();
    },
    openEditArea(): void {
      this.editSheet = true;
    },
    saveDate(date: Date) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$refs.menu.save(date);
      this.submitSession();
    },
    async submitSession(): Promise<void> {
      await this.sessionsStore.updateSession({
        _id: this.id,
        date: this.session.date + this.sessionTime,
        session: this.session.session,
      });
      await this.sessionsStore.getAllSessions();
    },
    async deleteSession(): Promise<void> {
      await this.sessionsStore.deleteSessions([this.session]);
      await this.sessionsStore.getAllSessions();
      await this.$router.push("/sessions");
    },
  },
  computed: {
    ...mapStores(useMainStore, useSessionStore),
    ...mapState(useMainStore, ["gColors", "gDate"]),
    computedDate(): string {
      return this.session.date
        ? new Date(this.session.date + this.sessionTime).toLocaleString(
            "en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )
        : "";
    },
  },
});
</script>
