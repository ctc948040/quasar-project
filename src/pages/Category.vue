<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 94vh">
      <template v-slot:before>
        <q-scroll-area style="height: 100%; width: 100%">
          <div class="q-pa-sm">
            <!-- <q-badge color="secondary" multi-line>
              expanded: {{ expanded }} selectModel: {{ selectGrade }}"
            </q-badge> -->

            <!-- 등급 선택 박스 시작-->
            <q-select
              v-model="selectGrade"
              :options="gradeOptions"
              option-value="id"
              option-label="desc"
              option-disable="inactive"
              style="display: contents"
              emit-value
              map-options
              @update:model-value="updateSelect"
              label="학년"
            >
              <template v-slot:prepend>
                <q-icon name="school" color="primary" @click.stop.prevent />
              </template>
            </q-select>
            <!-- 등급 선택 박스 종료 -->
            <!-- <q-space></q-space> -->
            <!-- 과목 선택 박스 시작-->
            <q-select
              v-model="selectSubject"
              :options="subjectOptions"
              option-value="id"
              option-label="desc"
              option-disable="inactive"
              style="display: contents"
              class="q-ml-sm q-my-sm"
              emit-value
              map-options
              @update:model-value="updateSubjectSelect"
              label="과목"
            >
              <template v-slot:prepend>
                <q-icon name="class" color="secondary" @click.stop.prevent />
              </template>
            </q-select>

            <!-- 트리 시작 -->
            <div class="q-gutter-sm q-mt-sm">
              <q-tree
                ref="tree"
                :nodes="treeList"
                node-key="label"
                selected-color="primary"
                v-model:ticked="ticked"
                v-model:expanded="expanded"
                v-model:selected.sync="selected"
                default-expand-all
                tick-strategy="strict"
                @lazy-load="onLazyLoad"
                accordion
              >
                <!-- v-model:selected.sync="selected" -->
                <!-- //v-model:selected="selected" //v-model:expanded="expandedKeys" -->
                <template v-slot:default-header="prop">
                  <TreeNode
                    :node="prop.node"
                    :grade="selectGrade"
                    :subject="selectSubject"
                    :expanded="expanded"
                    :editedNode="editedNode"
                    @deleteNode="deleteNode"
                    @clickNode="clickNode"
                  ></TreeNode>
                </template>
              </q-tree>
            </div>
            <!-- 트리 종료 -->
          </div>
        </q-scroll-area>
      </template>

      <template v-slot:separator> </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="q-mb-sm">
            <q-icon name="format_list_bulleted" color="primary" size="16px" />
            <span style="vertical-align: text-top">
              카테고리 {{ !selected ? "" : " - [ " + selected + " ]" }}</span
            >
          </div>
          <div class="q-my-sm">
            . Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
            praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.
          </div>
        </div>
      </template>
    </q-splitter>
  </div>
  <!-- <button type="button" @click="myClickEvent" ref="myBtn">Click Me!</button> -->
</template>
<style></style>
<script setup>
import {
  defineComponent,
  ref,
  watch,
  watchEffect,
  onMounted,
  nextTick,
  inject,
} from "vue";
import { useQuasar } from "quasar";
import TreeNode from "components/TreeNode.vue";
defineComponent({ name: "CategoryPage" });
const bus = inject("bus"); // inside setup()
const $q = useQuasar();
const tree = ref(null);
const selectGrade = ref("m2"); //학년 선택박스 모델
const selectSubject = ref("S1"); //과목 선택박스 모델
const treeList = ref([]); //트리 노드 배열
const expanded = ref([]); //확장노드 배열
const selected = ref(null); //클릭노드
const ticked = ref([]); //체크 노드
const editedNode = ref({}); //편집노드
// const editing = ref({});

const currNode = ref({});
const splitterModel = ref(30);

const myBtn = ref(null);

function fetchUser() {
  var url = "https://jsonplaceholder.typicode.com/users/1";
  return fetch(url).then(function (response) {
    return response.json();
  });
}

function fetchTodo() {
  var url = "https://jsonplaceholder.typicode.com/todos/1";
  return fetch(url).then(function (response) {
    return response.json();
  });
}

async function logTodoTitle() {
  console.log("logTodoTitle================");
  var user = await fetchUser();
  console.log(user);
  if (user.id === 1) {
    var todo = await fetchTodo();
    console.log(todo.title); // delectus aut autem
  }
}

console.log("[start] =====================");
logTodoTitle();
console.log("[end] =====================");

//이벤트 버스 사용 예제
bus.on("some-event", (arg1, arg2, arg3) => {
  console.log(arg1, arg2, arg3);
});

onMounted(() => {
  // input.value.focus();
});

const myClickEvent = function (e) {
  alert("aa");
};

const deleteNode = function (node) {
  //delete node;
  console.log("treeList", treeList.value);
  console.log("deleteNode", node);
};

const clickNode = function (node, isExtend) {
  if (!isExtend) {
    //토글
    tree.value.setExpanded(node.label, !tree.value.isExpanded(node.label));
  } else {
    //무조건 확장
    tree.value.setExpanded(node.label, true);
  }

  selected.value = node.label;
};

const treeData = {
  m1: {
    S1: [
      {
        label: "중학교 1학년 과학 기출문제",
        id: "cg_m1S101",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        children: [
          { label: "과학 1월 기출문제", id: "cg_m1S1011", lazy: true },
          { label: "과학 2월 기출문제", id: "cg_m1S1012", lazy: true },
          { label: "과학 3월 기출문제", id: "cg_m1S1013", lazy: true },
        ],
        handler: function (node) {},
      },
    ],
    S2: [
      {
        label: "중학교 1학년 수학 기출문제",
        id: "cg_m1S201",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        children: [
          { label: "수학 1월 기출문제", id: "cg_m1S2011", lazy: true },
          { label: "수학 2월 기출문제", id: "cg_m1S2012", lazy: true },
          { label: "수학 3월 기출문제", id: "cg_m1S2013", lazy: true },
        ],
      },
    ],
    S3: [
      {
        label: "중학교 1학년 영어 기출문제",
        id: "cg_m1S301",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        children: [
          { label: "영어 1월 기출문제", id: "cg_m1S2011", lazy: true },
          { label: "영어 2월 기출문제", id: "cg_m1S2012", lazy: true },
          { label: "영어 3월 기출문제", id: "cg_m1S2013", lazy: true },
        ],
      },
    ],
  },
  m2: {
    S1: [
      {
        label: "중학교 2학년 과학 기출문제",
        id: "cg_m2S1_10000",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        children: [
          {
            label: "과학 1월 기출문제",
            id: "cg_m2S1_11000",
            handler: function (node) {},
          },
          {
            label: "과학 2월 기출문제",
            id: "cg_m2S1_12000",
            handler: function (node) {},
          },
          {
            label: "과학 3월 기출문제",
            id: "cg_m2S1_13000",
            handler: function (node) {},
          },
        ],
        handler: function (node) {},
      },
    ],
    S2: [
      {
        label: "중학교 2학년 수학 기출문제",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        children: [
          { label: "수학 1월 기출문제", lazy: true },
          { label: "수학 2월 기출문제", lazy: true },
          { label: "수학 3월 기출문제", lazy: true },
        ],
      },
    ],
    S3: [
      {
        label: "중학교 2학년 영어 기출문제",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        children: [
          { label: "영어 1월 기출문제", lazy: true },
          { label: "영어 2월 기출문제", lazy: true },
          { label: "영어 3월 기출문제", lazy: true },
        ],
      },
    ],
  },
};

// watch(input1, async () => {
//   const data = input1.value;

//   if (currNode.value.label != data) {
//     console.log("data211111111", data);
//     currNode.value.label = data;
//   }
//   setTimeout(() => {
//     //input.value.focus();
//   }, 1);
// });

const initTree = function (v1, v2) {
  var m = treeData[v1] || {};
  treeList.value = m[v2] || [];
  //expandedKeys.value = [m[v2][0].label || ""];
};

initTree(selectGrade.value, selectSubject.value); //트리 데이터 초기화

//학년 선택박스 update 이벤트
const updateSelect = function (v) {
  initTree(v, selectSubject.value);
};
//과목 선택박스 update 이벤트
const updateSubjectSelect = function (v) {
  initTree(selectGrade.value, v);
};

const send = function () {
  // jQuery("#node_div").hide();
};

const onLazyLoad = function ({ node, key, done, fail }) {
  // call fail() if any error occurs
  console.log(done);
  setTimeout(() => {
    // simulate loading and setting an empty node
    if (key.indexOf("Lazy load empty") > -1) {
      done([]);
      return;
    }

    const label = node.label;
    done([{ label: `${label}.1` }]);
  }, 100);
};

// return {
//   nodeupdate: nodeupdate,
//   nodeclick: nodeclick,
//   editing: editing,
//   myClickEvent: myClickEvent,
//   myBtn: myBtn,
//   input: input,
//   onLazyLoad: onLazyLoad,
//   input1: input1,
//   send: send,
//   addNode: addNode,
//   updateSelect: updateSelect,
//   updateSubjectSelect: updateSubjectSelect,
//   splitterModel: ref(20), // start at 50%
//   gradeOptions: gradeOptions,
//   subjectOptions: subjectOptions,
//   selectModel: selectModel,
//   selectSubjectModel: selectSubjectModel,
//   expanded: expanded,
//   message: "Hello Vue!",
//   treeList: treeList,
//   selected: selected,
//   ticked: ticked,
// };

const gradeOptions = [
  {
    id: "m1",
    desc: "중1",
  },
  {
    id: "m2",
    desc: "중2",
  },
  {
    id: "m3",
    desc: "중3",
  },
  {
    id: "h1",
    desc: "고1",
  },
  {
    id: "h2",
    desc: "고2",
  },
  {
    id: "h3",
    desc: "고3",
  },
];

const subjectOptions = [
  {
    id: "S1",
    desc: "과학",
  },
  {
    id: "S2",
    desc: "수학",
  },
  {
    id: "S3",
    desc: "영어",
  },
];
</script>
