import {  inject,ref,computed } from "vue";
import { defineStore } from 'pinia';

// #Option Stores 과 Setup Stores 방식 중에서 Setup Stores 방식으로 설정

export const useSelectStore = defineStore('select', () => {

    const bus = inject("bus"); // inside setup()
    const  gradeItems = ref([]);
    const  subjectItems  = ref([]);
    const  selectedGrade = ref({ id: "COMGRDM2", desc: "중2" });
    const  selectedSubject = ref({ id: "COMSBJ01", desc: "과학" });

    const grade = computed(() => selectedGrade.value.id);
    const subject = computed(() => selectedSubject.value.id);

    async function  fillGrade() {
      gradeItems.value = (await import("src/data/grade.json")).default;
      console.info(gradeItems.value);
    };

    async function  fillSubject() {
      subjectItems.value = (await import("src/data/subject.json")).default;
      console.info(subjectItems.value);
    };
    function updateSelect() {

      console.info(this.selectedGrade.id,this.selectedSubject.id);
      bus.emit("MainLayout.initTree", this.selectedGrade.id,this.selectedSubject.id);
    };

    return { gradeItems, subjectItems, selectedGrade, selectedSubject,grade,subject ,fillGrade,fillSubject,updateSelect }
});
