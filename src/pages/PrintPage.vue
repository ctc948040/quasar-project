<template>
  <div>
    <!-- <div >======================================================</div> -->
    <div style="position: absolute; top: 20px; left: 10px">
      <q-chip icon="quiz" color="grey-6" text-color="white" dense size="20px">
        {{ route.query.gradeName }}, {{ route.query.subjectName }}
      </q-chip>
    </div>
    <div class="page" style="column-count: auto">
      <div
        style="
          text-align: center;
          border: 1px;
          border-color: #ed6666;
          height: 50px;
        "
        class="text-h4 text-grey-9 q-ma-sm"
      >
        {{ route.query.title }}
      </div>

      <div
        style="position: absolute; top: 20px; right: 10px"
        v-if="btnPrint"
        class="not-print"
      >
        <q-chip
          clickable
          icon="print"
          color="secondary"
          text-color="white"
          dense
          size="20px"
          @click="pagePrint"
        >
          프린트
        </q-chip>
      </div>

      <div
        style="
          margin-top: 0px;
          background: #ed6666;
          width: 100%;
          height: 5px;
          margin-bottom: 5px;
        "
      ></div>
      <!-- <div class="page-header-space" style="margin-top:20px;background: blue; width:100%;height:1px;"> </div> -->
    </div>

    <div class="page-footer" align="center" style="column-count: auto">
      <div style="margin-top: 5px; background: #ed6666; height: 3px"></div>
      <div style="text-align: right; margin-right: 10px; margin-top: 5px">
        <q-btn flat dense round style="margin-left: 10px">
          <q-avatar size="35px">
            <img src="icons/logo.png" />
          </q-avatar>
        </q-btn>
        [FBI {{ route.query.subjectName }}]
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <td></td>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td style="padding: 0px">
            <div class="page">
              <div>
                <div
                  v-for="(item, index) in cart.rawItems"
                  :key="index"
                  class="user-wrap"
                >
                  <div class="user-text">{{ index + 1 }}.</div>
                  <div class="user-image">
                    <img
                      :src="`/file/download?fileId=${item.qstFileId}`"
                      :style="`margin-bottom : ${route.query.distance}px;max-width: 490px`"
                    />
                    <!-- <q-separator /> -->
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td>
            <div class="page-footer-space"></div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRoute } from "vue-router";

import { useCartStore } from "stores/cart";

const route = useRoute();

const cart = useCartStore();

cart.fill(route.query.grade, route.query.subject);
const btnPrint = ref(true);
const pagePrint = function () {
  //btnPrint.value = false;
  self.print();
  //btnPrint.value = true;
};
</script>

<style>
.user-wrap {
  position: relative;
  margin-left: 15px;
  height: fit-content;
  width: 500px;
}
.user-image {
  vertical-align: middle;
  margin-left: 5px;
}
.user-text {
  position: absolute;
  left: 5px;
  top: 18px;
  transform: translate(-50%, -50%);
  font-size: 22px;
  font-weight: bold;
}
.page-footer {
  position: fixed;
  bottom: 5px;
  width: 100%;

  background: white;

  height: 50px;
  z-index: 999;
}

.page-header {
  position: fixed;
  top: 0mm;
  width: 100%;
  border-bottom: 1px solid black; /* for demo */
  background: yellow; /* for demo */
}

.page {
  page-break-after: page;
  column-count: 2;
  column-rule: solid 1px;
}

@page {
  margin-top: 15mm;
  margin-left: 12mm;
  margin-right: 12mm;
  margin-bottom: 10mm;
}

@media print {
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }

  button {
    display: none;
  }
  .not-print {
    display: none;
  }

  body {
    margin: 0;
  }
}
</style>
