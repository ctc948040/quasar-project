<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- <q-btn label="Basic scroll" color="primary" @click="basic = true" /> -->
    <q-btn label="Fixed size" color="primary" @click="fixedPopup1 = true" />

    <q-btn label="fetch test" color="secondary" @click="addListBasket" />

    <q-dialog v-model="fixedPopup1" full-height>
      <rawDisplays title="로그" :value="list"></rawDisplays>
    </q-dialog>

    <q-dialog v-model="fixedPopup" full-height>
      <!-- <div class="q-pa-md column full-height" style="max-width: 750px"> -->
      <q-card class="q-pa-md column full-height" style="max-width: 750px">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar color="teal" text-color="white" icon="shopping_cart">
          </q-avatar>
          <div class="text-h5 text-primary q-pa-sm">문제 바구니</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- <q-card-section>
            <div class="text-h5 text-primary">문제 바구니</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section> -->

        <!-- <q-separator /> -->

        <q-card-section style="max-height: 78vh" class="scroll">
          <q-list bordered style="min-width: 600px; max-width: 750px">
            <q-item-label header>중2, 과학</q-item-label>
            <q-separator />
            <VueDraggableNext
              class="q-gutter-md row content-start justify-center"
              :list="list"
              @change="log"
              :move="move"
            >
              <q-item
                clickable
                v-ripple
                v-for="(item, index) in list"
                :key="index"
              >
                <q-item-section avatar>
                  <q-avatar rounded flat icon="menu" />
                </q-item-section>

                <div style="width: 150px" class="q-mr-sm">
                  <q-img
                    src="/file/download?fileId=FIL11EDF9FA9289A8DCAAB90242AC110002"
                    fit="contain"
                  />
                </div>

                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption
                    >Secondary line text. Lorem ipsum dolor sit amet,
                    consectetur adipiscit elit.</q-item-label
                  >
                </q-item-section>

                <q-item-section side>
                  <q-btn round dense icon="delete" color="primary" />
                </q-item-section>
              </q-item>
            </VueDraggableNext>
          </q-list>

          <rawDisplays title="로그" :value="list"></rawDisplays>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Decline" color="primary" v-close-popup />
          <q-btn flat label="Accept" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
      <!-- </div> -->
    </q-dialog>
  </div>
  <DemoGrid
    :data="gridData"
    :columns="gridColumns"
    :filter-key="searchQuery"
  ></DemoGrid>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

import { VueDraggableNext } from "vue-draggable-next";
import rawDisplays from "components/rawDisplay.vue";
import DemoGrid from "components/GridComponent.vue";

import { post } from "src/js/com.js";

import { useCartStore } from "stores/cart";

const cart = useCartStore();

console.log(cart.count);
console.log(cart.temp);
cart.temp["bb"] = "bbb";
console.log(cart.temp["bb"]);

const $q = useQuasar();

const list = ref([
  { name: "John", id: 1 },
  { name: "Joao", id: 2 },
  { name: "Jean", id: 3 },
  { name: "Gerard", id: 4 },
]);

const searchQuery = ref("");
const gridColumns = ["name", "power", "age"];
const gridData = [
  { name: "Chuck Norris", power: Infinity, age: 11 },
  { name: "Bruce Lee", power: 9000, age: 13 },
  { name: "Jackie Chan", power: 7000, age: 13 },
  { name: "Jet Li", power: 8000, age: 12 },
];

const log = function (e) {};
const fixedPopup = ref();
const fixedPopup1 = ref();

const move = function (e) {
  console.log("Future index: " + e.draggedContext.futureIndex);
  console.log("element: " + e.draggedContext.element.name);
};

const addListBasket = function () {
  const uri = "/basket/insertListBasket";
  const body = [
    {
      userId: "USR11EDFB70738072929BBA0242AC110002",
      gradeCode: "COMGRDM2",
      subjectCode: "COMSBJ01",
      qstId: "QST11EDFA29753B32E2AAB90242AC110002",
      qstSort: 9,
    },
    {
      userId: "USR11EDFB70738072929BBA0242AC110002",
      gradeCode: "COMGRDM2",
      subjectCode: "COMSBJ01",
      qstId: "QST11EDFA29753B2E0FAAB90242AC110002",
      qstSort: 10,
    },
  ];

  post(uri, body)
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
};
</script>
