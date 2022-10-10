import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "@/plugins/pinia";
import vuetify from "./plugins/vuetify";
import { alphaToHex } from "@/utils/constants";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();
document.title = "Dreamscape";

const app = createApp(App);
app.config.globalProperties.$filters = {
  truncate(text: string, stop: number, clamp = "..."): string {
    return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
  },
  alpha(hex: string, percentage: string, style = false, attr = ""): string {
    percentage = String(percentage);
    hex = String(hex).slice(0, 7);
    if (style) return `${attr}: ${hex + alphaToHex[percentage]}`;
    return hex + alphaToHex[percentage];
  },
};
app.use(router).use(vuetify).use(pinia).mount("#app");
