<template>
  <div
    class="row items-center"
    @click.stop="clickNode(node)"
    style="white-space: nowrap; display: contents"
  >
    <!--@click.stop.prevent="" -->
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
    <div class="node" :id="node.id" style="cursor: pointer">
      <!-- @click.stop="editNode(node.label)" -->
      <q-input
        dense
        outlined
        v-if="editedNode[node.id]"
        v-model="nodeInput"
        @blur="doneEdit(node)"
        @keyup.enter="doneEdit(node)"
        @keyup.escape="cancelEdit(node)"
        @vue:mounted="({ el }) => el.focus()"
        @focus="nodeFocus(node, $event)"
        label="Label"
        maxlength="200"
      />
      <!--  -->
      <!-- @focus="nodeFocus(node, $event)" -->
      <span v-else @dblclick.stop="editNode(node)" class="noselect">{{
        node.label
      }}</span>
    </div>
    <q-menu context-menu>
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup @click="clickContext('add', node)">
          <q-item-section>추가</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="clickContext('modify', node)">
          <q-item-section>수정</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="clickContext('remove', node)">
          <q-item-section>삭제</q-item-section>
        </q-item>
        <!-- <q-item clickable v-close-popup>
          <q-item-section>Copy</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Paste</q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>Select All</q-item-section>
        </q-item> -->
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
/* eslint-disable vue/no-mutating-props */
import { ref, computed, nextTick, inject } from "vue";
import { uid } from "quasar";

const props = defineProps([
  "node",
  "expanded",
  "grade",
  "subject",
  "editedNode",
]);
const emitter = inject("emitter"); // inside setup()
const emit = defineEmits(["deleteNode", "clickNode"]);
const beforeEditCache = ref("");
const nodeInput = ref("");

const expanded = ref(props.expanded);

const clickNode = function (node, isExtend) {
  isExtend = isExtend || false;

  if (props.editedNode[node.id]) return;

  emit("clickNode", node, isExtend);
};

const editNode = function (node) {
  props.editedNode[node.id] = true;
  beforeEditCache.value = node.label;
};

const doneEdit = function (node, e) {
  props.editedNode[node.id] = false;
  node.label = nodeInput.value.trim();
};

const cancelEdit = function (node) {
  props.editedNode[node.id] = false;
  node.label = beforeEditCache.value;
};

const nodeFocus = function (node, e) {
  nodeInput.value = node.label;
};

const clickContext = function (mode, node) {
  if (mode == "add") {
    if (!node.children) {
      node.children = [];
    }
    // eslint-disable-next-line vue/no-mutating-props
    // expanded.value.push(node.label);

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
      handler: function (node) {},
    };

    children.push(m);
    clickNode(node, true); //노드를 확장 시킨다.
    setTimeout(() => editNode(m), 100);
  } else if (mode == "modify") {
    setTimeout(() => editNode(node), 100);
  } else if (mode == "remove") {
    emit("deleteNode", node);
    emitter.emit("some-event", "arg1 value", "arg2 value", "arg3 value");
  }
};
</script>

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
