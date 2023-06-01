<template>
  <q-card class="q-pa-md column full-height">
    <q-card-section class="row items-center q-pb-none">
      <q-avatar color="teal" text-color="white" icon="shopping_cart">
      </q-avatar>
      <div class="text-h5 text-primary q-pa-sm">문제 바구니</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section style="width: 700px">
      <h6 class="q-ma-xs">{{ title }}</h6>
      <pre>{{ value }}</pre>
    </q-card-section>
  </q-card>
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
