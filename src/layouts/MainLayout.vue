<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-btn flat dense round href="#/" style="margin-left: 10px">
          <q-avatar size="42px">
            <img src="icons/logo.png" />
          </q-avatar>
        </q-btn>
        <q-toolbar-title> HSMS </q-toolbar-title>

        <!-- <q-badge color="secondary" multi-line class="q-ma-md">
          Model: "{{ select.grade }} {{ select.subject }}"
        </q-badge> -->

        <!-- 등급 선택 박스 시작-->
        <q-select
          v-model="select.selectedGrade"
          :options="select.gradeItems"
          option-value="id"
          option-label="desc"
          label="학년"
          bg-color="white"
          outlined
          rounded
          dense
          style="width: 150px"
          color="primary"
          @update:model-value="select.updateSelect"
          class="q-ma-none q-pa-xs"
        >
          <!-- emit-value -->
          <template v-slot:prepend>
            <q-icon name="school" color="primary" @click.stop.prevent />
          </template>
        </q-select>
        <!-- 등급 선택 박스 종료 -->
        <!-- <q-space></q-space> -->
        <!-- 과목 선택 박스 시작-->
        <q-select
          v-model="select.selectedSubject"
          :options="select.subjectItems"
          option-value="id"
          option-label="desc"
          class="q-ma-none q-pa-xs"
          label="과목"
          bg-color="white"
          outlined
          rounded
          dense
          style="width: 150px"
          color="secondary"
          @update:model-value="select.updateSelect"
        >
          <template v-slot:prepend>
            <q-icon name="class" color="secondary" @click.stop.prevent />
          </template>
        </q-select>

        <q-btn
          color="teal"
          rounded
          size="md"
          icon="shopping_cart"
          @click="fixedPopup = true"
        >
          <q-badge color="red" floating transparent>{{ cart.count }}</q-badge>
        </q-btn>
        <!-- <q-item clickable @click="showDialog">
          <q-item-section>
            <q-avatar color="teal" text-color="white" icon="shopping_cart">
              <q-badge color="red" transparent floating>{{
                cart.count
              }}</q-badge>
            </q-avatar>
          </q-item-section>
        </q-item> -->

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-pa-md">
        <q-list separator padding class="text-secondary">
          <EssentialLinkComponent
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
            :activeMenu="activeMenu"
          />
        </q-list>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <q-dialog v-model="fixedPopup" full-height
    ><BasketListComponent></BasketListComponent
  ></q-dialog>
</template>

<style lang="sass">
.example-row-equal-width
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>

<script setup>
import { ref, inject } from "vue";
import EssentialLinkComponent from "components/EssentialLinkComponent.vue";
import BasketListComponent from "components/BasketListComponent.vue";

import { useSelectStore } from "stores/select";
import { useCartStore } from "stores/cart";

const select = useSelectStore();
select.fillGrade();
select.fillSubject();

const cart = useCartStore();

const fixedPopup = ref();

cart.fill(select.grade, select.subject);

const leftDrawerOpen = ref(false);
const emitter = inject("emitter"); // inside setup()
const activeMenu = ref({ menu: "home" }); //active menu

const basketList = ref([]); //문제바구니 리스트
const basketCnt = ref(0); //문제바구니 건수

const shareValue = ref({}); //각 페이지와 공유맵

const showDialog = function () {};

// console.log(cart.count);

//왼편메뉴 토글 호출
emitter.on("MainLayout.toggleLeftDrawer", function toggleLeftDrawer(arg1) {
  leftDrawerOpen.value = arg1;
});

//상단 학년, 과목에서 호출됨
emitter.on("MainLayout.chageSelect", function chageSelect(grade, subject) {
  cart.fill(select.grade, select.subject);
});

//문제바구니에 담기
emitter.on("MainLayout.addBasket", function addBasket(item) {
  let isItem = basketList.value.findIndex(function (element) {
    // console.info(element.qstId, item.qstId);
    if (element.qstId == item.qstId) {
      return true;
    }
  });

  // console.info("isItem", isItem);

  if (isItem == -1) {
    basketList.value.push(item);
  }
  basketCnt.value = basketList.value.length;
});

const toggleLeftDrawer = function () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const essentialLinks = ref([]);

async function fillLink() {
  essentialLinks.value = (await import("src/data/link.json")).default;
}

fillLink();
</script>
