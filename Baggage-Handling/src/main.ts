import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

import VueShepherdPlugin from 'vue-shepherd'
import 'shepherd.js/dist/css/shepherd.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#bb86fc',
          secondary: '#03dac6',
          error: '#cf6679',
          warning: '#fb8c00',
        }
      }
    }
  }
})

const app = createApp(App)
app.use(vuetify)
app.use(VueShepherdPlugin)

app.mount('#app')
