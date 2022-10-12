<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps<{
  headers: Record<string, any>[];
  items: Record<string, any>[];
  itemsPerPage: number;
  bgColor: string;
}>();
// eslint-disable-next-line no-undef
defineEmits(["click:row"]);

const show = ref(false);
const items = computed(() =>
  props.items.length > 0 ? [...props.items].splice(0, props.itemsPerPage) : []
);

function check(): void {
  if (items.value.length > 0) {
    const keys = Object.keys(props.items[0]);
    for (let i = 0; i < props.headers.length; i++) {
      if (keys.includes(props.headers[i].name.toLowerCase())) {
        show.value = true;
      }
    }
  }
}

onBeforeMount(() => {
  check();
});
</script>

<template>
  <v-container v-if="items.length > 0" class="mx-0 pa-0">
    <v-table :style="{ backgroundColor: bgColor }">
      <slot name="search"></slot>
      <thead>
        <tr v-for="(header, index) in props.headers" :key="index">
          <th
            class="text-left"
            :style="{ display: header.visible ? '' : 'none' }"
          >
            {{ header.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          @click="$emit('click:row', item)"
        >
          <td>
            <slot v-if="show" name="item" :item="item">
              {{ item }}
            </slot>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<style lang="scss">
.single-line__text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.v-table__wrapper {
  overflow-x: hidden !important;
}
</style>
