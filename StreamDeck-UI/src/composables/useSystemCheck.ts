import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemStore'

export interface CheckItem {
  id: string
  label: string
  description: string
  icon: string
  status: 'pending' | 'checking' | 'pass' | 'fail' | 'warn'
  optional: boolean
  detail: string
}

export function useSystemCheck() {
  const store = useSystemStore()

  const checks = ref<CheckItem[]>([
    {
      id: 'webgl',
      label: 'Aceleración WebGL',
      description: 'Renderizado 3D y efectos visuales',
      icon: 'mdi-vector-square',
      status: 'pending',
      optional: false,
      detail: '',
    },
    {
      id: 'opus',
      label: 'Codec de Audio Opus',
      description: 'Audio de alta calidad de baja latencia',
      icon: 'mdi-waveform',
      status: 'pending',
      optional: false,
      detail: '',
    },
    {
      id: 'h265',
      label: 'Video H.265 / HEVC',
      description: 'Reproducción de vídeo de alta eficiencia',
      icon: 'mdi-video-high-definition',
      status: 'pending',
      optional: true,
      detail: '',
    },
    {
      id: 'network',
      label: 'Conexión a Internet',
      description: 'Estado de la red y tipo de conexión',
      icon: 'mdi-wifi',
      status: 'pending',
      optional: true,
      detail: '',
    },
    {
      id: 'battery',
      label: 'Estado de Batería',
      description: 'Energía disponible para la sesión',
      icon: 'mdi-battery',
      status: 'pending',
      optional: true,
      detail: '',
    },
  ])

  function updateCheck(id: string, status: CheckItem['status'], detail: string) {
    const item = checks.value.find((c) => c.id === id)
    if (item) {
      item.status = status
      item.detail = detail
    }
  }

  function checkWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas')
      const ctx =
        canvas.getContext('webgl2') ?? canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
      if (ctx) {
        const gl = ctx as WebGLRenderingContext
        const renderer = gl.getParameter(gl.RENDERER) as string
        updateCheck('webgl', 'pass', `Soporte detectado: ${renderer}`)
        return true
      }
    } catch {
      // intentionally empty
    }
    updateCheck('webgl', 'fail', 'WebGL no está disponible en este navegador')
    return false
  }

  function checkAudioOpus(): boolean {
    try {
      const audio = document.createElement('audio')
      const support =
        audio.canPlayType('audio/ogg; codecs=opus') !== '' ||
        audio.canPlayType('audio/webm; codecs=opus') !== ''
      if (support) {
        updateCheck('opus', 'pass', 'Codec Opus soportado')
        return true
      }
    } catch {
      // intentionally empty
    }
    updateCheck('opus', 'fail', 'El codec Opus no está soportado')
    return false
  }

  function checkH265(): boolean {
    try {
      const video = document.createElement('video')
      const support =
        video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') !== '' ||
        video.canPlayType('video/mp4; codecs="hvc1"') !== '' ||
        (typeof MediaSource !== 'undefined' &&
          MediaSource.isTypeSupported('video/mp4; codecs="hev1.1.6.L93.B0"'))
      if (support) {
        updateCheck('h265', 'pass', 'H.265/HEVC soportado')
        return true
      }
    } catch {
      // intentionally empty
    }
    updateCheck('h265', 'warn', 'H.265 no disponible — se usará fallback')
    return false
  }

  function checkNetwork(): boolean {
    const online = navigator.onLine
    if (!online) {
      updateCheck('network', 'fail', 'Sin conexión a Internet')
      return false
    }
    // Optional extended info from Network Information API
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number }
    }
    const conn = nav.connection
    if (conn) {
      const type = conn.effectiveType ?? 'desconocido'
      const speed = conn.downlink != null ? `${conn.downlink} Mbps` : ''
      updateCheck('network', 'pass', `Online · ${type}${speed ? ` · ${speed}` : ''}`)
    } else {
      updateCheck('network', 'pass', 'Conectado')
    }
    return true
  }

  async function checkBattery(): Promise<number | null> {
    if (!('getBattery' in navigator)) {
      updateCheck('battery', 'warn', 'Battery API no disponible')
      return null
    }
    try {
      const battery = await (navigator as Navigator & {
        getBattery: () => Promise<{ level: number; charging: boolean }>
      }).getBattery()
      const percent = Math.round(battery.level * 100)
      const chargingText = battery.charging ? ' · Cargando' : ''
      if (percent < 15 && !battery.charging) {
        updateCheck('battery', 'warn', `Batería baja: ${percent}%${chargingText}`)
      } else {
        updateCheck('battery', 'pass', `Batería: ${percent}%${chargingText}`)
      }
      return percent
    } catch {
      updateCheck('battery', 'warn', 'Battery API no disponible')
      return null
    }
  }

  function sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
  }

  async function runAllChecks(): Promise<void> {
    // Run checks sequentially with a small delay for UX effect
    const checkId = (id: string) => {
      const item = checks.value.find((c) => c.id === id)
      if (item) item.status = 'checking'
    }

    checkId('webgl')
    await sleep(700)
    const webGL = checkWebGL()

    checkId('opus')
    await sleep(600)
    const opus = checkAudioOpus()

    checkId('h265')
    await sleep(600)
    const h265 = checkH265()

    checkId('network')
    await sleep(500)
    const online = checkNetwork()

    checkId('battery')
    await sleep(500)
    const battery = await checkBattery()

    store.setResults({ webGL, opus, h265, battery, online })
  }

  return { checks, runAllChecks }
}
