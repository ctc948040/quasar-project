import { defineStore } from 'pinia'

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    rawItems: ["a"],
    temp: {bb:"bb",cc:"cc"},
  }),
  getters: {
    count : (state) => state.rawItems.length,
  },
  actions: {
    addItem(item) {
      this.rawItems.push(item)
    },

    removeItem(item) {
      const i = this.rawItems.lastIndexOf(item)
      if (i > -1) this.rawItems.splice(i, 1)
    },
  },
})
