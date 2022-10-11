<script lang="ts" setup>
// eslint-disable-next-line no-undef
import { onMounted, ref } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps<{
  headers: Record<string, any>[];
  items: Record<string, any>[];
}>();
// eslint-disable-next-line no-undef
defineEmits(["click:row"]);

const show = ref(false);

function check(): void {
  const keys = Object.keys(props.items[0]);
  for (let i = 0; i < props.headers.length; i++) {
    if (keys.includes(props.headers[i].name.toLowerCase())) {
      show.value = true;
    }
  }
}

onMounted(() => {
  check();
});
</script>

<template>
  <v-table>
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
        v-for="(item, index) in props.items"
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
</template>

<style lang="scss" scoped>
td {
  white-space: pre;
}
</style>
