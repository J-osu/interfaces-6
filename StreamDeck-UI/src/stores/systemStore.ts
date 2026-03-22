import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CheckResult {
  label: string
  status: 'pending' | 'checking' | 'pass' | 'fail' | 'warn'
  detail: string
  icon: string
  optional: boolean
}

export const useSystemStore = defineStore('system', () => {
  const webGLSupported = ref(false)
  const opusSupported = ref(false)
  const h265Supported = ref(false)
  const batteryLevel = ref<number | null>(null)
  const isOnline = ref(true)
  const checksCompleted = ref(false)

  const allMandatoryChecksPassed = computed(
    () => webGLSupported.value && opusSupported.value
  )

  const canEnterDashboard = computed(
    () => checksCompleted.value && allMandatoryChecksPassed.value
  )

  function setResults(results: {
    webGL: boolean
    opus: boolean
    h265: boolean
    battery: number | null
    online: boolean
  }) {
    webGLSupported.value = results.webGL
    opusSupported.value = results.opus
    h265Supported.value = results.h265
    batteryLevel.value = results.battery
    isOnline.value = results.online
    checksCompleted.value = true
  }

  return {
    webGLSupported,
    opusSupported,
    h265Supported,
    batteryLevel,
    isOnline,
    checksCompleted,
    allMandatoryChecksPassed,
    canEnterDashboard,
    setResults,
  }
})
