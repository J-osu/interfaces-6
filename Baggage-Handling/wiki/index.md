# Baggage Handling - Terminal 4 Control

Bienvenido a la Wiki de **Baggage Handling**, el sistema principal de control de equipaje para la Terminal 4 (TSA Control).

## Visión General
Esta aplicación Vue 3 está diseñada para monitorear el tránsito y el estado operativo de los vuelos en tiempo real, permitiendo a los operadores ver fácilmente qué vuelos están "A Tiempo" o "Retrasados", así como acceder rápidamente a protocolos de Parada de Emergencia (Código Rojo).

## Características Principales
- **Dashboard Neón / Glassmorphism**: Una interfaz moderna y oscura con acentos morados y cyan, diseñada para sentirse premium y altamente responsiva basándose en estéticas de sistemas de control tipo StreamDeck.
- **Filtros Dinámicos**: Permite filtrar los vuelos en tránsito según su estado actual (Global, Retrasados, A Tiempo).
- **Tour de Onboarding**: Integración de `vue-shepherd` para guiar a los nuevos operadores por la interfaz.
- **Botón de Emergencia Cyberpunk**: Un modal inmersivo para realizar paradas catastróficas mecánicas que secuestra la atención del usuario inmediatamente.

Explora `Architecture.md` para conocer más sobre la estructura del proyecto y `Troubleshooting.md` para la documentación de errores y soluciones.
