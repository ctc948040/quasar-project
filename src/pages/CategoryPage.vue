<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 94vh">
      <template v-slot:before>
        <q-scroll-area style="height: 100%; width: 100%">
          <div class="q-pa-sm">
            <!-- <q-badge color="secondary" multi-line>
              expanded: {{ expanded }}
            </q-badge> -->

            <!-- 트리 시작 -->
            <div class="q-gutter-sm q-mt-sm">
              <q-tree
                ref="tree"
                :nodes="treeList"
                node-key="label"
                selected-color="primary"
                v-model:ticked="ticked"
                v-model:expanded="expanded"
                v-model:selected="selected"
                default-expand-all
                tick-strategy="strict"
                @lazy-load="onLazyLoad"
                @update:selected="selectNode"
                accordion
              >
                <!-- v-model:selected.sync="selected" -->
                <!-- //v-model:selected="selected" //v-model:expanded="expandedKeys" -->
                <template v-slot:default-header="prop">
                  <TreeNodeComponent
                    :node="prop.node"
                    :grade="select.grade"
                    :subject="select.subject"
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
        <div
          class="q-pa-md"
          id="scroll-target-id"
          style="height: 100%; max-height: 100%; overflow: auto"
        >
          <div class="q-mb-sm">
            <q-icon name="format_list_bulleted" color="primary" size="16px" />
            <span style="vertical-align: text-top">
              카테고리
              {{
                !selected ? "" : " - [ " + selected + " ]: 총(" + cnt + ") 건"
              }}</span
            >
          </div>

          <q-infinite-scroll
            @load="onLoad1"
            :offset="offset1"
            scroll-target="#scroll-target-id"
          >
            <div class="q-gutter-md row content-start justify-center">
              <q-card
                class="my-card"
                v-for="item in questList"
                :key="item.qstFileId"
              >
                <q-item-section style="height: 400px">
                  <q-img
                    height="100%"
                    :src="`/file/download?fileId=${item.qstFileId}`"
                    fit="contain"
                  />
                </q-item-section>
                <q-separator />
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label style="word-break: break-all">{{
                      item.qstTitle +
                      ", 유형:" +
                      item.qstPattern +
                      ", 난이도:" +
                      item.dfcltLevelName
                    }}</q-item-label>
                    <q-item-label caption> {{ item.ctgName }} </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <!-- <q-card-actions>
                  <q-btn flat round icon="event" />
                  <q-btn flat> 7:30PM </q-btn>
                  <q-btn flat color="primary"> Reserve </q-btn>
                </q-card-actions> -->

                <q-card-actions>
                  <q-space></q-space>
                  <!-- <q-btn flat round color="red" icon="favorite" /> -->
                  <q-btn
                    flat
                    round
                    color="accent"
                    icon="add"
                    @click="addQstToBasket(item)"
                    v-if="cart.findIndex(item) === -1"
                  />
                  <!-- <q-btn flat round color="primary" icon="share" /> -->
                  <q-btn flat round dense icon="more_vert" />
                </q-card-actions>
              </q-card>
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </div>
      </template>
    </q-splitter>
  </div>
  <!-- <button type="button" @click="myClickEvent" ref="myBtn">Click Me!</button> -->
</template>
<style lang="sass" scoped>
.my-card
  width: 345px
  max-width: 350px
  // max-height: 245px
</style>
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
import { post, get } from "src/js/com.js";
import TreeNodeComponent from "components/TreeNodeComponent.vue";
import { useSelectStore } from "stores/select";
import { useCartStore } from "stores/cart";

defineComponent({ name: "CategoryPage" });

const bus = inject("bus"); // inside setup()
const $q = useQuasar();
const tree = ref(null);

const select = useSelectStore(); //학년,과목 저장 정보
const cart = useCartStore();

const treeList = ref([]); //트리 노드 배열
const expanded = ref([]); //확장노드 배열
const selected = ref(null); //클릭노드
const ticked = ref([]); //체크 노드
const editedNode = ref({}); //편집노드
const questList = ref([]);
const imgCheck = ref([]);

// const editing = ref({});

const currNode = ref({});
const splitterModel = ref(20);

const offset1 = ref(-1);
const pageNum = ref(0);
const searchNode = ref(null);
const cnt = ref(0);

onMounted(() => {
  bus.emit("MainLayout.toggleLeftDrawer", false);
});

//상단 학년, 과목에서 호출됨
bus.on("MainLayout.initTree", (grade, subject) => {
  initTree(grade, subject);
});

const addQstToBasket = function (item) {
  const uri = "/basket/insertBasket";

  const body = {
    userId: "USR11EDFB70738072929BBA0242AC110002",
    gradeCode: select.grade,
    subjectCode: select.subject,
    qstId: item.qstId,
  };

  post(uri, body)
    .then((res) => {
      cart.addItem(res.data);
      //console.log(res.data);
      // bus.emit("MainLayout.addBasket", res.data);
    })
    .catch((error) => console.log(error));
};

const initTree = async function (v1, v2) {
  // var m = treeData[v1] || {};
  console.log(v1, v2);

  var data = await fetchCategory("", v1, v2);

  treeList.value = data || [];
  expanded.value = [data[0].label || ""];

  selected.value = data[0].label;

  console.log("initTree", "=====>", "searchQst");
  questList.value = await searchQst(data[0]);
};

const selectNode = async function (selected, node) {
  console.info(selected, node);
};

const onLoad1 = async function (index, done) {
  if (searchNode.value == null) {
    console.log("searchNode is null");
    return done();
  }
  console.info("searchNode.value", searchNode.value);
  console.info("pagenum", pageNum.value);
  console.log("onLoad1", "=====>", "searchQst");
  let list = await searchQst(searchNode.value);
  questList.value.push(...list); //배열의 각 원소들을 push하는 방법

  if (list.length == 0) {
    offset1.value = -1;
  }
  done();
};

const clickNode = async function (node, isExtend) {
  if (!isExtend) {
    //토글
    tree.value.setExpanded(node.label, true);
    //tree.value.setExpanded(node.label, !tree.value.isExpanded(node.label));
  } else {
    //무조건 확장
    tree.value.setExpanded(node.label, true);
  }

  selected.value = node.label;
  console.log("clickNode", "=====>", "searchQst");
  pageNum.value = 0;
  questList.value = [];
  questList.value = await searchQst(node);
};

const searchQst = function (node) {
  searchNode.value = node;
  const uri =
    "/question/selectListQuestion?ctgId=" +
    node.id +
    "&pageNum=" +
    pageNum.value;
  return fetch(uri, { method: "get" })
    .then((response) => response.json())
    .then((response) => {
      if (response.data == null) {
        cnt.value = questList.value.length;
        return [];
      }
      pageNum.value += response.data.length;
      offset1.value = 0;
      cnt.value = response.data[0].cnt;
      return response.data;
    });
};

function fetchCategory(id, grade, subject) {
  let parentCtgId = id ? "&parentCtgId=" + id : "";

  const uri =
    "/category/selectListCategory?gradeCode=" +
    grade +
    "&subjectCode=" +
    subject +
    parentCtgId; // 'http://localhost:8080/api' 로 작성 시 프록시 적용 X
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

const deleteNode = function (node) {
  //delete node;
  console.log("treeList", treeList.value);
  console.log("deleteNode", node);
};

initTree(select.grade, select.subject); //트리 데이터 초기화

//학년 선택박스 update 이벤트
const updateSelect = function (v) {
  initTree(v.id, select.subject);
};
//과목 선택박스 update 이벤트
const updateSubjectSelect = function (v) {
  initTree(select.grade, v.id);
};

const send = function () {
  // jQuery("#node_div").hide();
};

const onLazyLoad = async function ({ node, key, done, fail }) {
  var data = await fetchCategory(node.id, select.grade, select.subject);

  done(data);
};
</script>
