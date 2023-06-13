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
              <q-list bordered class="rounded-borders">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6 text-grey-8">
                        카테고리 & 문제 관리
                      </div>
                      <!-- <div class="text-subtitle2">by John Doe</div> -->
                    </div>

                    <!-- <div class="col-auto">
                      <q-btn color="grey-7" round flat icon="more_vert">
                        <q-menu cover auto-close>
                          <q-list>
                            <q-item clickable>
                              <q-item-section>Remove Card</q-item-section>
                            </q-item>
                            <q-item clickable>
                              <q-item-section>Send Feedback</q-item-section>
                            </q-item>
                            <q-item clickable>
                              <q-item-section>Share</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div> -->
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-actions class="justify-center">
                  <!-- <A
                    :href="`/category/export-to-excel?gradeCode=${select.grade}&subjectCode=${select.subject}`"
                  > -->
                  <!-- <a @click="exportExcel"> -->
                  <!-- <q-spinner-dots
                    color="primary"
                    size="3em"
                    :thickness="2"
                    v-if="isspinner"
                  /> -->
                  <q-btn
                    rounded
                    dense
                    unelevated
                    align="around"
                    icon="arrow_upward"
                    color="teal-6"
                    text-color="white"
                    @click="exportExcel"
                    :loading="isspinner"
                    class="btn-fixed-width"
                  >
                    내보내기
                  </q-btn>
                  <!-- </a> -->
                  <q-btn
                    rounded
                    dense
                    unelevated
                    align="around"
                    icon="arrow_downward"
                    color="teal-6"
                    text-color="white"
                    @click="importExcel"
                    class="btn-fixed-width"
                  >
                    가져오기
                  </q-btn>
                </q-card-actions>
              </q-list>
              <q-tree
                ref="tree"
                :nodes="treeList"
                node-key="label"
                selected-color="primary"
                v-model:ticked="ticked"
                v-model:expanded="expanded"
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
        <RouterView></RouterView>
      </template>
    </q-splitter>
  </div>
  <!-- <button type="button" @click="myClickEvent" ref="myBtn">Click Me!</button> -->
</template>
<style lang="sass" scoped>
.btn-fixed-width
  width: 120px
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
import { useRouter } from "vue-router";

defineComponent({ name: "CategoryPage" });

// const bus = inject("bus"); // inside setup()
const emitter = inject("emitter"); // inside setup()
const $q = useQuasar();
const router = useRouter();
const tree = ref(null);

const select = useSelectStore(); //학년,과목 저장 정보
const cart = useCartStore();

const treeList = ref([]); //트리 노드 배열
const expanded = ref([]); //확장노드 배열
// const selected = ref(null); //클릭노드
const ticked = ref([]); //체크 노드
const editedNode = ref({}); //편집노드
// const questList = ref([]);
const imgCheck = ref([]);

// const editing = ref({});

const currNode = ref({});
const splitterModel = ref(20);

// const offset1 = ref(-1);
// const pageNum = ref(0);
// const searchNode = ref(null);
// const cnt = ref(0);
const isspinner = ref(false);
const exportExcel = function () {
  isspinner.value = true;
  setTimeout(() => (isspinner.value = false), 3000);
  location.href = `/category/export-to-excel?gradeCode=${select.grade}&subjectCode=${select.subject}&parentCtgId=${currNode.value.id}`;
};

const importExcel = function () {
  // location.href = "/#/Category/importCategory";
  router.push({ path: "/Category/importCategory" });
};

onMounted(() => {
  emitter.emit("MainLayout.toggleLeftDrawer", false);

  // const callBackfn1 = async (node) => {
  //   console.log("category : Category.clickNode called");
  // };
  // emitter.on("Category.clickNode", callBackfn1);

  // router.push({ path: "/Category/qstList" });
});

//상단 학년, 과목에서 호출됨
emitter.on("MainLayout.chageSelect", function chageSelect2(grade, subject) {
  console.log("categoryPage", "MainLayout.chageSelect");
  initTree(grade, subject);
});

const initTree = async function (v1, v2) {
  // var m = treeData[v1] || {};
  // console.log(v1, v2);

  var data = await searchCategory("", v1, v2);

  treeList.value = data || [];
  expanded.value = [data[0].label || ""];

  // selected.value = data[0].label;
  currNode.value = data[0];
  emitter.emit("Category.clickNode", currNode.value);
};

const selectNode = async function (selected, node) {
  console.info(selected, node);
};

const clickNode = async function (node, isExtend) {
  if (!router.currentRoute.value.fullPath.includes("/Category/qstList")) {
    router.push({ path: "/Category/qstList" });
  }

  setTimeout(() => {
    if (!isExtend) {
      //토글
      tree.value.setExpanded(node.label, true);
      //tree.value.setExpanded(node.label, !tree.value.isExpanded(node.label));
    } else {
      //무조건 확장
      tree.value.setExpanded(node.label, true);
    }
    currNode.value = node;
    // bus.off("Category.clickNode", node);
    // bus.emit("Category.clickNode", node);
    emitter.emit("Category.clickNode", node);
  }, 200);
};

function searchCategory(id, grade, subject) {
  let parentCtgId = id ? "&parentCtgId=" + id : "";

  const uri = "/category/selectListCategory";

  let body = {
    parentCtgId: id ? id : null,
    gradeCode: select.grade,
    subjectCode: select.subject,
  };

  return get(uri, body)
    .then((res) => {
      return res.data;
    })
    .catch((error) => console.log(error));
}

const deleteNode = function (node) {
  //delete node;
  // console.log("treeList", treeList.value);
  // console.log("deleteNode", node);
};

initTree(select.grade, select.subject); //트리 데이터 초기화

const send = function () {
  // jQuery("#node_div").hide();
};

const onLazyLoad = async function ({ node, key, done, fail }) {
  var data = await searchCategory(node.id, select.grade, select.subject);

  done(data);
};
</script>
