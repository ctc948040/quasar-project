<template>
  <div class="q-pa-md">
    <div class="q-mb-sm">
      <q-icon name="format_list_bulleted" color="primary" size="16px" />
      <span style="vertical-align: text-top"> 카테고리 IMPORT</span>
    </div>

    <div class="q-gutter-sm row items-start">
      <q-uploader
        field-name="file"
        :factory="factoryFn"
        label="카테고리 import 엑셀 업로드"
        style="width: 100%"
        @uploaded="uploaded"
      />
      <br />
      <!-- multiple
        batch -->

      <q-markup-table style="width: 100%" flat bordered separator="cell">
        <thead class="bg-grey-3">
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
const select = useSelectStore(); //학년,과목 저장 정보
const bus = inject("bus"); // inside setup()

const factoryFn = function (files) {
  return {
    url: "file/importExcel",
    method: "POST",
  };
};

const tableList = ref([]);

const uploaded = function (info) {
  tableList.value = JSON.parse(info.xhr.response).data;
  bus.emit("MainLayout.initTree", select.grade, select.subject);
};
</script>
