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
                  <TreeNodeComponent
                    :node="prop.node"
                    :grade="selectGrade"
                    :subject="selectSubject"
                    :expanded="expanded"
                    :editedNode="editedNode"
                    @deleteNode="deleteNode"
                    @clickNode="clickNode"
                  ></TreeNodeComponent>
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
import TreeNodeComponent from "components/TreeNodeComponent.vue";
defineComponent({ name: "CategoryPage" });
const bus = inject("bus"); // inside setup()
const $q = useQuasar();
const tree = ref(null);
const selectGrade = ref("COMGRDM1"); //학년 선택박스 모델
const selectSubject = ref("COMSBJ01"); //과목 선택박스 모델
const treeList = ref([]); //트리 노드 배열
const expanded = ref([]); //확장노드 배열
const selected = ref(null); //클릭노드
const ticked = ref([]); //체크 노드
const editedNode = ref({}); //편집노드
// const editing = ref({});

const currNode = ref({});
const splitterModel = ref(30);

const myBtn = ref(null);

function fetchCategory(id, grade, subject) {
  let parentCtgId = id ? "&parentCtgId=" + id : "";

  const uri =
    "/category?gradeCode=" + grade + "&subjectCode=" + subject + parentCtgId; // 'http://localhost:8080/api' 로 작성 시 프록시 적용 X
  return fetch(uri, { method: "get" })
    .then((response) => response.json())
    .then((response) => {
      return response.data;
    });
}

//이벤트 버스 사용 예제
bus.on("some-event", (arg1, arg2, arg3) => {
  console.log(arg1, arg2, arg3);
});

onMounted(() => {
  // input.value.focus();
});

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

const initTree = async function (v1, v2) {
  // var m = treeData[v1] || {};
  console.log(v1, v2);

  var data = await fetchCategory("", v1, v2);

  treeList.value = data || [];
  expanded.value = [data[0].label || ""];
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

const onLazyLoad = async function ({ node, key, done, fail }) {
  var data = await fetchCategory(
    node.id,
    selectGrade.value,
    selectSubject.value
  );

  done(data);
};

const gradeOptions = [
  {
    id: "COMGRDM1",
    desc: "중1",
  },
  {
    id: "COMGRDM2",
    desc: "중2",
  },
  {
    id: "COMGRDM3",
    desc: "중3",
  },
  {
    id: "COMGRDH1",
    desc: "고1",
  },
  {
    id: "COMGRDH2",
    desc: "고2",
  },
  {
    id: "COMGRDH3",
    desc: "고3",
  },
];

const subjectOptions = [
  {
    id: "COMSBJ01",
    desc: "과학",
  },
  {
    id: "COMSBJ02",
    desc: "수학",
  },
  {
    id: "COMSBJ03",
    desc: "영어",
  },
  {
    id: "COMSBJ04",
    desc: "국어",
  },
];
</script>
