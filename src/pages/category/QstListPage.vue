<template>
  <!-- <q-scroll-area style="height: 100%; width: 100%"> -->
  <div
    class="q-pa-md"
    id="scroll-target-id"
    style="height: 94vh; max-height: 100%; overflow: auto"
  >
    <q-card bordered flat class="q-mb-sm">
      <q-item>
        <q-item-section>
          <q-breadcrumbs class="text-secondary">
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>

            <q-breadcrumbs-el label="Home" icon="home" />
            <q-breadcrumbs-el label="학습문제" icon="widgets" />
            <q-breadcrumbs-el v-if="currNode !== null">
              <q-item-label header class="q-pa-none">
                {{
                  !currNode
                    ? ""
                    : " [ " + currNode.label + " : 총(" + cnt + ") 건]"
                }}
              </q-item-label>
            </q-breadcrumbs-el>
          </q-breadcrumbs>
        </q-item-section>
        <q-item-section side v-if="selectCategory">
          <q-btn-dropdown
            color="teal-6"
            label="문제관리"
            dropdown-icon="more_vert"
            outline
          >
            <q-list>
              <q-item clickable v-close-popup @click="exportExcel">
                <q-item-section avatar>
                  <q-avatar
                    icon="arrow_downward"
                    color="cyan-3"
                    text-color="white"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>문제 내보내기</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="importExcel">
                <q-item-section avatar>
                  <q-avatar
                    icon="arrow_upward"
                    color="amber-3"
                    text-color="white"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>문제 가져오기</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="1 == 1">
                <q-item-section avatar>
                  <q-avatar
                    icon="shopping_cart"
                    color="deep-orange-3"
                    text-color="white"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>전체바구니넣기</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
    </q-card>

    <q-infinite-scroll
      @load="onLoad1ByInfiniteScroll"
      :offset="offset1"
      scroll-target="#scroll-target-id"
    >
      <div class="q-gutter-md row content-start justify-center">
        <q-card class="my-card" v-for="item in questList" :key="item.qstFileId">
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
  <!-- </q-scroll-area> -->
</template>
<style lang="sass" scoped>
.my-card
  width: 345px
  max-width: 350px
  // max-height: 245px
</style>
<script setup>
import { defineProps, ref, inject, onMounted } from "vue";
import { useSelectStore } from "stores/select";
import { useCartStore } from "stores/cart";
import { post, get } from "src/js/com.js";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const select = useSelectStore(); //학년,과목 저장 정보
const cart = useCartStore();
const bus = inject("bus"); // inside setup()

const props = defineProps(["selected"]);

// const selectedNodeName = ref("");

const pageNum = ref(0);
const cnt = ref(0);
const currNode = ref(null);
const offset1 = ref(-1);
const questList = ref([]);
const selectCategory = ref(false);

onMounted(async () => {
  console.log("onMounted");
  if (route.query.ctgId !== undefined) {
    currNode.value = route.query;
    selectCategory.value = true;
  }

  pageNum.value = 0;
  questList.value = [];
  questList.value = await searchQst(currNode.value);
});

const importExcel = function () {
  // location.href = "/#/Category/importCategory";
  router.push({ path: "/Category/importQuestion" });
};

const exportExcel = function () {
  // setTimeout(() => (isspinner.value = false), 3000);
  location.href = `/question/export-to-excel?gradeCode=${select.grade}&subjectCode=${select.subject}&ctgId=${currNode.value.id}`;
};

//카테고리 클릭시 호출
bus.on("Category.clickNode", async (node) => {
  selectCategory.value = true;
  currNode.value = node;
  pageNum.value = 0;
  questList.value = [];
  questList.value = await searchQst(node);
});

const searchQst = function (node) {
  const param = `?${node === null ? "" : "ctgId=" + node.id + "&"}pageNum=${
    pageNum.value
  }&gradeCode=${select.grade}&subjectCode=${select.subject}`;

  const uri = `/question/selectListQuestion${param}`;
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

//스크롤 아래위치시 문제 로딩 함수
const onLoad1ByInfiniteScroll = async function (index, done) {
  if (offset1.value == -1) {
    return done();
  }

  let list = await searchQst(currNode.value);
  questList.value.push(...list); //배열의 각 원소들을 push하는 방법

  if (list.length == 0) {
    offset1.value = -1;
  }
  done();
};

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
    })
    .catch((error) => console.log(error));
};
</script>
