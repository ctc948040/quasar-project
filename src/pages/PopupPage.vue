<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- <q-btn label="Basic scroll" color="primary" @click="basic = true" /> -->
    <q-btn label="Fixed size" color="primary" @click="fixedPopup = true" />

    <q-dialog v-model="fixedPopup">
      <div class="q-pa-md" style="max-width: 750px">
        <q-card>
          <q-card-section>
            <div class="text-h5 text-primary">문제 바구니</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 75vh" class="scroll">
            <q-list bordered style="max-width: 750px">
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
                  class="q-pa-none"
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
      </div>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import rawDisplays from "components/rawDisplay.vue";

const log = function (e) {};

const move = function (e) {
  console.log("Future index: " + e.draggedContext.futureIndex);
  console.log("element: " + e.draggedContext.element.name);
};

const list = ref([
  { name: "John", id: 1 },
  { name: "Joao", id: 2 },
  { name: "Jean", id: 3 },
  { name: "Gerard", id: 4 },
]);

const fixedPopup = ref();
</script>
