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

    removeItem(grade,subject,item) {

      let i = this.findIndex(item);

      if (i > -1){
        this.rawItems.splice(i, 1);

        const uri = "/basket/deleteBasket";

        const body = {
          userId: "USR11EDFB70738072929BBA0242AC110002",
          gradeCode: grade,
          subjectCode: subject,
          qstId: item.qstId,
        };

        post(uri, body)
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
          console.info(this.rawItems);
        })
      .catch((error) => console.log(error));

    },
  },
})
