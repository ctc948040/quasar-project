<template>
  <div class="q-pa-md q-ma-sm q-gutter-sm">
    <h6 class="q-ma-xs">{{ title }}</h6>
    <pre>{{ value }}</pre>
  </div>
</template>

<script setup>
/* eslint-disable vue/no-mutating-props */
import { ref, computed, nextTick, inject } from "vue";
const props = defineProps(["title", "value"]);
</script>
<style scoped>
pre {
  font-size: 10px;
  text-align: start;
}
</style>
