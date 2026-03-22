import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import { streamDeckTheme } from './styles/theme'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'streamDeckTheme',
    themes: {
      streamDeckTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
