import { defineStore } from 'pinia'
import { post, get } from "src/js/com.js";

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    rawItems: [],
  }),
  getters: {
    count : (state) => state.rawItems.length,
  },
  actions: {
    addItem(item) {

      let i = this.findIndex(item);
      if (i == -1) this.rawItems.push(item);


    },
    saveSort(grade,subject) {
      let body = [];
      this.rawItems.forEach((item,idx)=>{
        // console.log(item,idx);
        let m = {};
        m["userId"] = "USR11EDFB70738072929BBA0242AC110002";
        m["gradeCode"] = grade;
        m["subjectCode"] = subject;
        m["qstId"] = item.qstId;
        m["qstSort"] = idx;
        body.push(m);

      });

      const uri = "/basket/saveSortBasket";
        post(uri, body)
        .then((res) => console.log(res))
        .catch((error) => console.log(error));

    },

    removeItem(grade,subject,item) {

      let i = this.findIndex(item);

      if (i > -1){

        const uri = "/basket/deleteBasket";

        const body = {
          userId: "USR11EDFB70738072929BBA0242AC110002",
          gradeCode: grade,
          subjectCode: subject,
          qstId: item.qstId,
        };

        post(uri, body)
        .then((res)=>this.rawItems.splice(i, 1))
        .catch((error) => console.log(error));

      }
    },
    removeAll(grade,subject){
      const uri = "/basket/deleteAllBasket";

        const body = {
          userId: "USR11EDFB70738072929BBA0242AC110002",
          gradeCode: grade,
          subjectCode: subject
        };

        post(uri, body)
        .then((res) => this.rawItems = [])
        .catch((error) => console.log(error));
    },
    findIndex(item){
      return this.rawItems.findIndex(function (element) {

        if (element.qstId == item.qstId) {
          return true;
        }
      });
    },

    fill(grade,subject) {
      const uri = "/basket/selectListBasket";

      const body = {
        userId: "USR11EDFB70738072929BBA0242AC110002",
        gradeCode: grade,
        subjectCode: subject,
      };

      post(uri, body)
      .then((res) => {
          this.rawItems =  res.data === null?[]:res.data;
          // console.info(this.rawItems);
        })
      .catch((error) => console.log(error));

    },
  },
})
