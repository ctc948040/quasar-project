<template>
  <q-item
    clickable
    tag="a"
    :target="target"
    :href="link"
    v-ripple
    :active="activeMenu['menu'] == name"
    @click="clickMenu(name)"
    active-class="rounded-borders my-menu-link"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
/* eslint-disable vue/no-mutating-props */
import { ref } from "vue";
const props = defineProps([
  "title",
  "caption",
  "link",
  "icon",
  "target",
  "name",
  "activeMenu",
]);

const clickMenu = function (name) {
  // console.info(props.name);
  props.activeMenu["menu"] = name;
};
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: #f2c037
</style>
