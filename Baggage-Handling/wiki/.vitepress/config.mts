import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Baggage Handling Wiki",
  description: "Terminal 4 Control Documentation",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' }
    ],
    sidebar: [
      {
        text: 'Documentación',
        items: [
          { text: 'Inicio', link: '/' },
          { text: 'Arquitectura', link: '/Architecture' },
          { text: 'Resolución de Errores', link: '/Troubleshooting' }
        ]
      }
    ]
  }
})
