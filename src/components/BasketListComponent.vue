<template>
  <div
    class="q-pa-sm"
    style="/*background-color: aliceblue;*/ display: inline-table"
  >
    <q-card style="display: inline-table">
      <q-card-section class="row items-center q-pb-none">
        <q-avatar
          color="teal"
          text-color="white"
          icon="shopping_cart"
          size="35px"
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

      <q-card-section class="q-pa-none row">
        <div class="q-pa-sm text-subtitle2 text-grey-9">
          {{ select.gradeName }}, {{ select.subjectName }}
        </div>
        <q-space />
        <q-chip
          clickable
          icon="save"
          color="primary"
          text-color="white"
          :disable="cart.count === 0"
        >
          시험지저장
        </q-chip>
        <q-chip
          clickable
          @click="confirm2 = true"
          icon="delete"
          color="secondary"
          text-color="white"
          :disable="cart.count === 0"
        >
          전체 비우기
        </q-chip>
        <q-chip
          clickable
          icon="print"
          color="secondary"
          text-color="white"
          :disable="cart.count === 0"
          @click="popupPrint"
        >
          프린트
        </q-chip>
      </q-card-section>
      <!-- <q-separator /> -->
      <q-card-section
        style="max-height: 75vh; min-height: 75vh"
        class="scroll q-pa-none"
      >
        <q-list bordered style="min-width: 600px; max-width: 800px">
          <!-- <q-item-label header
            >{{ select.gradeName }}, {{ select.subjectName }}</q-item-label
          > -->

          <q-item v-if="cart.count === 0">
            <q-item-section class="q-ma-md">
              <q-item-label align="center" class="text-body2 text-grey-8"
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
                  "유형:" + item.qstPattern + ", 난이도:" + item.dfcltLevelName
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
                      confirm1 = true;
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
        <q-btn flat label="닫기" color="primary" v-close-popup />
        <!-- <q-btn flat label="Accept" color="primary" v-close-popup /> -->
      </q-card-actions>
    </q-card>
  </div>
  <q-dialog v-model="confirm1" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="info" color="primary" text-color="white" />
        <span class="q-ml-sm">문제를 삭제하시겠습니까?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="취소" color="primary" v-close-popup />
        <q-btn
          flat
          label="확인"
          color="primary"
          v-close-popup
          @click="
            {
              confirm1 = false;
              cart.removeItem(select.grade, select.subject, currItem);
            }
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirm2" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="info" color="primary" text-color="white" />
        <span class="q-ml-sm">전체 문제를 삭제하시겠습니까?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="취소" color="primary" v-close-popup />
        <q-btn
          flat
          label="확인"
          color="primary"
          v-close-popup
          @click="
            {
              confirm2 = false;
              cart.removeAll(select.grade, select.subject);
            }
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="printModel" full-height>
    <BasketPrintComponent></BasketPrintComponent>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

import { VueDraggableNext } from "vue-draggable-next";
// import BasketPrintComponent from "components/BasketPrintComponent.vue";
// import rawDisplays from "components/rawDisplay.vue";
// import DemoGrid from "components/GridComponent.vue";

import { post } from "src/js/com.js";

import { useCartStore } from "stores/cart";

import { useSelectStore } from "stores/select";

const select = useSelectStore(); //학년,과목 저장 정보

const cart = useCartStore();

const popupPrint = function () {
  let newWin = window.open(
    "/#PrintPage?text=hello",
    "",
    "left=200,top=100,width=1070,height=900,toolbar=0,scrollbars=0,status=0"
  );

  setTimeout(function () {
    newWin.print(); // 인쇄
    //newWin.close(); // 창을 닫습니다
  }, 3000);
};

// const $q = useQuasar();

const confirm1 = ref(false);
const confirm2 = ref(false);
const currItem = ref(null);
const printModel = ref(false);

const log = function (e) {};
const fixedPopup = ref();
// const fixedPopup1 = ref();

const move = function (e) {
  console.log("Future index: " + e.draggedContext.futureIndex);
  console.log("element: " + e.draggedContext.element.name);
};
</script>
