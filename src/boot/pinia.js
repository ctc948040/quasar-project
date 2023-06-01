import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'

export default boot(({ app }) => {
  // for Composition API
  app.use(createPinia())
})
