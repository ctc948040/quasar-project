import {ref, watch} from "vue";

/**
 * Event Bus
 * @typedef {Object} EventBus
 */
/**
 * add event listener
 * @method
 * @name EventBus#on
 * @param {string} name
 * @param {Function} callback
 * @returns {EventBus}
 */
/**
 * remove event listener
 * @method
 * @name EventBus#off
 * @param {string} name
 * @param {Function?} callback
 * @returns {EventBus}
 */
/**
 * fire event listener
 * @method
 * @name EventBus#emit
 * @param {string} name
 * @param {...any} args
 * @returns {EventBus}
 */

/**
 * @type {{[name: string]: { callbacks: Function[], trigger: UnwrapRef<any[]>, stopper: import('vue').WatchStopHandle } }}
 */
const bus_ = {}

/**
 * Composition API Event Bus
 * @return {EventBus}
 */
export default function useEventBus() {
  return {
    on(name, callback) {
      if (!bus_[name]) {
        bus_[name] = {
          callbacks: [],
          trigger: ref([])
        }

        bus_[name].stopper = watch(bus_[name].trigger, (params) => {
          console.log("watch call",params)
          bus_[name].callbacks.forEach(cb => cb.apply(undefined, params))
        })
      }



      const idx = bus_[name].callbacks.findIndex(f => {
        console.log(f.name,callback.name);
        if(f.name === callback.name)  return true;
      });

      if (idx === -1){
        bus_[name].callbacks.push(callback);
      }
      console.log(name,bus_[name].callbacks);
      return this
    },
    off(name, callback = undefined) {
      if(bus_[name]) {
        if (callback) {
          const idx = bus_[name].callbacks.findIndex(f => f.name === callback.name)
          if (idx > -1) bus_[name].callbacks.splice(idx, 1)
        }
        if (!bus_[name].callbacks.length || !callback) {
          bus_[name].stopper()
          delete bus_[name]
        }
      }
      return this
    },
    emit(name, ...args) {
      if(bus_[name]) {
        console.log("emit",args);
        console.log(bus_[name].trigger.value , args);
        bus_[name].trigger.value = args;
        console.log(bus_[name].stopper);
      }
      return this
    }
  }
}
