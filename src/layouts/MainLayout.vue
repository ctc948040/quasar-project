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

        <div>Quasar v{{ $q.version }}</div>
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

<script>
import { defineComponent, ref, inject } from "vue";
import EssentialLinkComponent from "src/components/EssentialLinkComponent.vue";

const linksList = [
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
  // {
  //   title: "Docs",
  //   caption: "quasar.dev",
  //   icon: "school",
  //   link: "https://quasar.dev",
  // },
  // {
  //   title: "Github",
  //   caption: "github.com/quasarframework",
  //   icon: "code",
  //   link: "https://github.com/quasarframework",
  // },
  // {
  //   title: "Discord Chat Channel",
  //   caption: "chat.quasar.dev",
  //   icon: "chat",
  //   link: "https://chat.quasar.dev",
  // },
  // {
  //   title: "Forum",
  //   caption: "forum.quasar.dev",
  //   icon: "record_voice_over",
  //   link: "https://forum.quasar.dev",
  // },
  // {
  //   title: "Twitter",
  //   caption: "@quasarframework",
  //   icon: "rss_feed",
  //   link: "https://twitter.quasar.dev",
  // },
  // {
  //   title: "Facebook",
  //   caption: "@QuasarFramework",
  //   icon: "public",
  //   link: "https://facebook.quasar.dev",
  // },
  // {
  //   title: "Quasar Awesome",
  //   caption: "Community Quasar projects",
  //   icon: "favorite",
  //   link: "https://awesome.quasar.dev",
  // },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLinkComponent,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const activeMenu = ref({ menu: "home" }); //active menu

    const bus = inject("bus"); // inside setup()

    //이벤트 버스 사용 예제
    bus.on("toggleLeftDrawer", (arg1) => {
      leftDrawerOpen.value = arg1;
    });

    return {
      essentialLinks: linksList,
      activeMenu,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
