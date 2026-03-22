import { watch, type Ref } from 'vue'
import { useShepherd } from 'vue-shepherd'

export function useDashboardTour(filterState: Ref<'all' | 'delayed' | 'ontime'>) {
  // Composable must call inject-based hooks synchronously
  const tour = useShepherd({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'industrial-tour-theme',
      scrollTo: true,
      cancelIcon: { enabled: true }
    }
  })

  function startTour() {
    tour.addStep({
      id: 'welcome',
      title: 'Terminal 4 - Control de Equipaje',
      text: 'Bienvenido al sistema crítico de manejo de equipaje. Dada la peligrosidad de la interfaz, es obligatorio completar este tutorial rápido.',
      attachTo: { element: '.app-header', on: 'bottom' },
      buttons: [
        { text: 'Comenzar', action: tour.next, classes: 'shepherd-btn-primary' }
      ]
    })

    tour.addStep({
      id: 'table-info',
      title: 'Registro de Vuelos',
      text: 'Aquí verás el flujo en tiempo real de los vuelos y sus cintas asignadas.',
      attachTo: { element: '#flights-table-container', on: 'top' },
      buttons: [
        { text: 'Atrás', action: tour.back, classes: 'shepherd-btn-secondary' },
        { text: 'Siguiente', action: tour.next, classes: 'shepherd-btn-primary' }
      ]
    })

    tour.addStep({
      id: 'interactive-filter',
      title: '¡ACCIÓN REQUERIDA!',
      text: 'Por favor, activa el filtro de <b>Vuelos Retrasados</b> para continuar.',
      attachTo: { element: '#status-chips-container', on: 'bottom' },
      advanceOn: { selector: '#filter-delayed', event: 'click' },
      // Ocultar botones para forzar interacción
      buttons: [],
      when: {
        show() {
          const unwatch = watch(filterState, (newVal) => {
            if (newVal === 'delayed') {
              unwatch() // Limpiar el observador
              // Pequeño delay para UX
              setTimeout(() => {
                tour.next()
              }, 400)
            }
          })
        }
      }
    })

    tour.addStep({
      id: 'success-interactive',
      title: '¡Correcto!',
      text: 'Has filtrado los vuelos retrasados. Este comportamiento interactivo es clave en el sistema.',
      attachTo: { element: '#status-chips-container', on: 'bottom' },
      buttons: [
        { text: 'Siguiente', action: tour.next, classes: 'shepherd-btn-primary' }
      ]
    })

    tour.addStep({
      id: 'emergency-stop',
      title: 'PARADA DE EMERGENCIA',
      text: 'Este botón detiene de inmediato todas las cintas. <b>Úsalo SOLO en emergencias críticas.</b>',
      attachTo: { element: '#emergency-panel', on: 'left' },
      buttons: [
        { 
          text: 'Entendido, Finalizar', 
          action: () => {
             localStorage.setItem('baggageTourCompleted', 'true')
             tour.complete()
          }, 
          classes: 'shepherd-btn-danger' 
        }
      ]
    })

    if (localStorage.getItem('baggageTourCompleted') !== 'true') {
      tour.start()
    }
  }

  return { startTour, tour }
}
