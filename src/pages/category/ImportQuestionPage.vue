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
            <q-breadcrumbs-el label="학습문제" icon="widgets" />
            <q-breadcrumbs-el label="문제 가져오기" />
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
            <th class="text-left">카테고리명</th>
            <th class="text-left">문제타이틀</th>
            <th class="text-left">문제유형</th>
            <th class="text-left">답안</th>
            <th class="text-left">해설</th>
            <th class="text-left">문제파일명</th>
            <th class="text-left">해설파일명</th>
            <th class="text-left">문제타입명</th>
            <th class="text-left">답유형명</th>
            <th class="text-left">표시타입명</th>
            <th class="text-left">난이도명</th>
            <th class="text-left">비고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableList" :key="item.qstId">
            <td class="text-left">{{ item.ctgName }}</td>
            <td class="text-left">{{ item.qstTitle }}</td>
            <td class="text-left">{{ item.qstPattern }}</td>
            <td class="text-left">{{ item.answer }}</td>
            <td class="text-left">{{ item.comment }}</td>
            <td class="text-left">{{ item.qstFileName }}</td>
            <td class="text-left">{{ item.cmntFileName }}</td>
            <td class="text-left">{{ item.qstTypeName }}</td>
            <td class="text-left">{{ item.answerKindName }}</td>
            <td class="text-left">{{ item.displayTypeName }}</td>
            <td class="text-left">{{ item.dfcltLevelName }}</td>
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
const emitter = inject("emitter"); // inside setup()

const factoryFn = function (files) {
  return {
    url: "question/importExcel",
    method: "POST",
  };
};

const tableList = ref([]);

const uploaded = function (info) {
  tableList.value = JSON.parse(info.xhr.response).data;
};
</script>
