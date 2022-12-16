<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 20pc">
      <template v-slot:before>
        <q-scroll-area style="height: 100%">
          <div class="q-pa-md">
            <div class="text-h4 q-mb-md">Before</div>
            <div v-for="n in 20" :key="n" class="q-my-md">
              {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Quis praesentium cumque magnam odio iure quidem, quod illum
              numquam possimus obcaecati commodi minima assumenda consectetur
              culpa fuga nulla ullam. In, libero.
            </div>
          </div>
        </q-scroll-area>
      </template>

      <template v-slot:separator> </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md">
            {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.
          </div>
        </div>
      </template>
    </q-splitter>
  </div>

  <div class="q-pa-md">
    <q-scroll-area style="height: 200px; max-width: 500px">
      <div class="row items-start q-gutter-md">
        <q-responsive :ratio="3 / 2" style="width: 500px; max-width: 100%">
          <q-card class="column">
            <q-img class="col" src="https://cdn.quasar.dev/img/parallax1.jpg" />

            <q-card-section>
              <div>Ratio 4:3, but max height of 100px</div>
            </q-card-section>
          </q-card>
        </q-responsive>
      </div>
    </q-scroll-area>
  </div>

  <div class="q-pa-md">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 310px; width: 700px"
      class="shadow-2 rounded-borders"
    >
      <!-- <q-header elevated>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>

          <q-toolbar-title> Quasar Framework </q-toolbar-title>

          <q-btn flat round dense icon="whatshot" />
        </q-toolbar>
      </q-header> -->

      <q-page-container>
        <q-scroll-area style="height: 300px; width: 100%">
          <q-page padding>
            <p v-for="n in 15" :key="n">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              nihil praesentium molestias a adipisci, dolore vitae odit, quidem
              consequatur optio voluptates asperiores pariatur eos numquam rerum
              delectus commodi perferendis voluptate?
            </p>
          </q-page>
        </q-scroll-area>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
export default {
  setup() {
    defineComponent({ name: "IndexPage" });
    const $q = useQuasar();

    function showNotification() {
      $q.notify("Some other message");
    }

    function myTweak(offset) {
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration

      // this is actually what the default style-fn does in Quasar
      console.log(offset);
      return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
    }

    return {
      myTweak,
      showNotification,
      slide: ref(1),
      splitterModel: ref(50), // start at 50%
    };
  },
};
</script>
