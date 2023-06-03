<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- <q-btn label="Basic scroll" color="primary" @click="basic = true" /> -->
    <q-btn label="Fixed size" color="primary" @click="fixedPopup = true" />

    <!-- <q-btn label="fetch test" color="secondary" @click="addListBasket" /> -->

    <!-- <q-dialog v-model="fixedPopup1" full-height>
      <rawDisplays title="로그" :value="list"></rawDisplays>
    </q-dialog> -->

    <q-dialog v-model="fixedPopup" full-height>
      <!-- <div class="q-pa-md column" style="max-width: 760px">
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <q-avatar
              color="teal"
              text-color="white"
              icon="shopping_cart"
              size="40px"
            >
              <q-badge transparent floating color="red">
                {{ cart.count }}
              </q-badge>
            </q-avatar>
            <div class="text-h5 q-pa-sm">문제 바구니</div>

            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator />

          <q-card-section class="q-pa-none" align="right">
            <q-chip
              clickable
              @click="cart.removeAll(select.grade, select.subject)"
              icon="delete"
              color="primary"
              text-color="white"
            >
              전체 비우기
            </q-chip>
          </q-card-section>

          <q-card-section
            style="max-height: 70vh; min-height: 60vh"
            class="scroll q-pa-none"
          >
            <q-list bordered style="min-width: 600px; max-width: 750px">
              <q-item-label header
                >{{ select.gradeName }}, {{ select.subjectName }}</q-item-label
              >
              <q-separator />
              <q-item v-if="cart.count === 0">
                <q-item-section class="q-ma-md">
                  <q-item-label align="center" class="text-body2 text-grey-7"
                    >저장된 문제가 없습니다.</q-item-label
                  >
                </q-item-section>
              </q-item>

              <VueDraggableNext
                class="q-gutter-md row content-start justify-center"
                :list="cart.rawItems"
                @change="log"
                :move="move"
                v-else-if="cart.count > 0"
              >
                <q-item
                  clickable
                  v-for="(item, index) in cart.rawItems"
                  :key="index"
                  style="min-width: 680px; max-width: 750px"
                >
                  <q-item-section avatar>
                    <q-avatar rounded flat icon="menu" />
                  </q-item-section>
                  <div style="width: 150px" class="q-mr-sm">
                    <q-img
                      :src="`/file/download?fileId=${item.qstFileId}`"
                      fit="contain"
                    />
                  </div>

                  <q-item-section>
                    <q-item-label outlined>[{{ item.ctgName }}]</q-item-label>
                    <q-item-label>{{ item.qstTitle }}</q-item-label>
                    <q-item-label caption>{{
                      "유형:" +
                      item.qstPattern +
                      ", 난이도:" +
                      item.dfcltLevelName
                    }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      round
                      dense
                      icon="delete"
                      color="primary"
                      @click="
                        {
                          confirm = true;
                          currItem = item;
                        }
                      "
                    />
                  </q-item-section>
                </q-item>
              </VueDraggableNext>
            </q-list>
          </q-card-section>
          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Decline" color="primary" v-close-popup />
            <q-btn flat label="Accept" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </div> -->
      <BasketListComponent></BasketListComponent>
    </q-dialog>
  </div>
  <!-- <DemoGrid
    :data="gridData"
    :columns="gridColumns"
    :filter-key="searchQuery"
  ></DemoGrid> -->
  <router-view></router-view>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

// import { VueDraggableNext } from "vue-draggable-next";
// import rawDisplays from "components/rawDisplay.vue";
// import DemoGrid from "components/GridComponent.vue";
import BasketListComponent from "components/BasketListComponent.vue";

import { post } from "src/js/com.js";

// import { useCartStore } from "stores/cart";

// import { useSelectStore } from "stores/select";

// const select = useSelectStore(); //학년,과목 저장 정보

// const cart = useCartStore();

// console.log(cart.count);
// console.log(cart.temp);
// cart.temp["bb"] = "bbb";
// console.log(cart.temp["bb"]);

// const $q = useQuasar();

const confirm = ref(false);
const currItem = ref(null);

// const searchQuery = ref("");
// const gridColumns = ["name", "power", "age"];
// const gridData = [
//   { name: "Chuck Norris", power: Infinity, age: 11 },
//   { name: "Bruce Lee", power: 9000, age: 13 },
//   { name: "Jackie Chan", power: 7000, age: 13 },
//   { name: "Jet Li", power: 8000, age: 12 },
// ];

// const log = function (e) {};
const fixedPopup = ref();
// const fixedPopup1 = ref();

// const move = function (e) {
//   console.log("Future index: " + e.draggedContext.futureIndex);
//   console.log("element: " + e.draggedContext.element.name);
// };

// const removeQst = function (item) {
//   cart.removeItem(item);
// };

// const addListBasket = function () {
//   const uri = "/basket/insertListBasket";
//   const body = [
//     {
//       userId: "USR11EDFB70738072929BBA0242AC110002",
//       gradeCode: "COMGRDM2",
//       subjectCode: "COMSBJ01",
//       qstId: "QST11EDFA29753B32E2AAB90242AC110002",
//       qstSort: 9,
//     },
//     {
//       userId: "USR11EDFB70738072929BBA0242AC110002",
//       gradeCode: "COMGRDM2",
//       subjectCode: "COMSBJ01",
//       qstId: "QST11EDFA29753B2E0FAAB90242AC110002",
//       qstSort: 10,
//     },
//   ];

//   post(uri, body)
//     .then((res) => console.log(res))
//     .catch((error) => console.log(error));
// };
</script>
