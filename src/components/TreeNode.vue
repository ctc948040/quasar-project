<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="row items-center">
    <q-avatar v-if="node.avatar" class="q-mr-sm">
      <img :src="node.avatar" />
    </q-avatar>
    <q-icon
      v-else
      :name="node.icon || 'share'"
      :color="node.color"
      size="28px"
      class="q-mr-sm"
    />
    <div
      @click.stop="nodeclick(node.label)"
      class="node"
      :id="node.id"
      style="cursor: pointer"
    >
      <!-- @click.stop="nodeclick(prop.node.label)" -->
      <q-input
        dense
        outlined
        v-if="editing[node.label]"
        @blur="nodeupdate(node, $event)"
        @focus="nodeFocus(node, $event)"
        @vnode-mounted="({ el }) => el.focus()"
        v-model="input1"
        label="Label"
        maxlength="200"
        ref="input"
      />
      <span v-else>{{ node.label }}</span>
    </div>
    <q-menu context-menu>
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup @click="addNode(node)">
          <q-item-section>추가</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Cut</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Copy</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Paste</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Select All</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { uid } from "quasar";

const props = defineProps(["node", "expanded", "editing", "grade", "subject"]);

//const emit = defineEmits(["update:expanded"]);

const input1 = ref("");
const input = ref(null);

const expanded = ref(props.expanded);

console.log(props.node);
console.log(props.grade);
console.log(props.subject);
console.log("expanded", props.expanded);
console.log("editing", props.editing);

const nodeclick = function (label) {
  // eslint-disable-next-line vue/no-mutating-props
  props.editing[label] = true;
  input1.value = label;
};

const nodeupdate = function (node, e) {
  input1.value = e.target.value.trim();
  node.label = input1.value;
  // eslint-disable-next-line vue/no-mutating-props
  props.editing[node.label] = false;
};

const nodeFocus = function (node, e) {
  input1.value = node.label;
};

const addNode = function (node) {
  //jQuery("#node_div").show();
  //myBtn.value.click();
  //input1.value = "1";

  if (!node.children) {
    node.children = [];
  }
  //expanded.value.push(node.label);
  // eslint-disable-next-line vue/no-mutating-props
  props.expanded.push(node.label);
  //emit("update:expanded", props.expanded);

  if (!node.avatar && !node.icon) {
    node.icon = "folder";
    node.color = "secondary";
  }
  let children = node.children;
  let uid1 = uid();
  let label = "추가카테고리" + uid1.slice(0, 7);

  let m = {
    label: label,
    id: "cg_" + props.grade + props.subject + "_" + uid1,
  };

  children.push(m);

  setTimeout(() => nodeclick(label), 1000);
};
</script>

<style></style>
