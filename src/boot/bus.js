import { EventBus } from 'quasar'
import { boot } from 'quasar/wrappers'

// import useEventBus from 'src/js/event-bus'
import Emitter from 'src/js/emitter.js'

export default boot(({ app }) => {

  // const bus = useEventBus()
  const emitter = new Emitter();

  // const bus = new EventBus();

  // const emitter = new Emitter();

  // for Options API
  // app.config.globalProperties.$bus = bus
  app.config.globalProperties.$emitter = emitter

  // for Composition API
  // app.provide('bus', bus)
  app.provide('emitter', emitter);
})
