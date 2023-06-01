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

        <q-badge color="secondary" multi-line class="q-ma-md">
          Model: "{{ select.grade }} {{ select.subject }}"
        </q-badge>

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
          class="q-ma-sm"
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
          round
          size="md"
          icon="shopping_cart"
          @click="showDialog"
        >
          <q-badge color="purple" floating>{{ basketCnt }}</q-badge>
        </q-btn>

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

import { useSelectStore } from "stores/select";

const select = useSelectStore();

select.fillGrade();
select.fillSubject();

const leftDrawerOpen = ref(false);
const bus = inject("bus"); // inside setup()
const activeMenu = ref({ menu: "home" }); //active menu

const basketList = ref([]); //문제바구니 리스트
const basketCnt = ref(0); //문제바구니 건수

const shareValue = ref({}); //각 페이지와 공유맵

const showDialog = function () {};

// console.log(cart.count);

//왼편메뉴 토글 호출
bus.on("MainLayout.toggleLeftDrawer", (arg1) => {
  leftDrawerOpen.value = arg1;
});

//문제바구니에 담기
bus.on("MainLayout.addBasket", (item) => {
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

const essentialLinks = [
  {
    title: "Home",
    caption: "",
    icon: "home",
    link: "#/",
    target: "_self",
    name: "home",
  },
  {
    title: "카테고리설정",
    caption: "카테고리를 설정합니다.",
    icon: "school",
    link: "#/Category",
    target: "_self",
    name: "category",
  },
  {
    title: "그리드 데모",
    caption: "동적 그리드 그리기",
    icon: "chat",
    link: "#/GridDemo",
    target: "_self",
    name: "grid",
  },
  {
    title: "팝업 데모",
    caption: "팝업 샘플",
    icon: "announcement",
    link: "#/PopupPage",
    target: "_self",
    name: "PopupPage",
  },
];
</script>
