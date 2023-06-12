<template>
  <div class="q-pa-md">
    <q-card bordered flat class="q-mb-sm">
      <q-item>
        <q-item-section>
          <q-breadcrumbs class="text-secondary">
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>

            <q-breadcrumbs-el label="Home" icon="home" />
            <q-breadcrumbs-el label="category" icon="widgets" />
            <q-breadcrumbs-el label="카테고리 가져오기" />
          </q-breadcrumbs>
        </q-item-section>
      </q-item>
    </q-card>

    <div class="q-gutter-sm row items-start">
      <q-uploader
        field-name="file"
        :factory="factoryFn"
        label="엑셀 업로드"
        style="width: 100%"
        @uploaded="uploaded"
        color="blue-grey-4"
      />
      <br />
      <!-- multiple
        batch -->

      <q-markup-table style="width: 100%" flat bordered separator="cell">
        <thead class="bg-blue-grey-1">
          <tr>
            <th class="text-left">학년</th>
            <th class="text-left">과목</th>
            <th class="text-left">부모카테고리명</th>
            <th class="text-left">카테고리명</th>
            <th class="text-left">레벨</th>
            <th class="text-left">소팅</th>
            <th class="text-left">비고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableList" :key="item.qstId">
            <td class="text-left">{{ item.gradeName }}</td>
            <td class="text-left">{{ item.subjectName }}</td>
            <td class="text-left">{{ item.parentCtgName }}</td>
            <td class="text-left">{{ item.ctgName }}</td>
            <td class="text-left">{{ item.ctgLevel }}</td>
            <td class="text-left">{{ item.ctgSort }}</td>
            <td class="text-left">{{ item.importState }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, inject } from "vue";
import { useSelectStore } from "stores/select";
// import { useRouter, useRoute } from "vue-router";

// const router = useRouter();
const select = useSelectStore(); //학년,과목 저장 정보
// const emitter = inject("emitter"); // inside setup()

const factoryFn = function (files) {
  return {
    url: "file/importExcel",
    method: "POST",
  };
};

const tableList = ref([]);

const uploaded = function (info) {
  tableList.value = JSON.parse(info.xhr.response).data;
  // emitter.emit("MainLayout.initTree", select.grade, select.subject);
};
</script>
