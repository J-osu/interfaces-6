import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSystemStore } from './systemStore'

describe('System Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useSystemStore()
    expect(store.webGLSupported).toBe(false)
    expect(store.opusSupported).toBe(false)
    expect(store.h265Supported).toBe(false)
    expect(store.batteryLevel).toBeNull()
    expect(store.isOnline).toBe(true)
    expect(store.checksCompleted).toBe(false)
    expect(store.canEnterDashboard).toBe(false)
  })

  it('can enter dashboard if mandatory checks pass', () => {
    const store = useSystemStore()
    store.setResults({
      webGL: true,
      opus: true,
      h265: false,
      battery: 100,
      online: true,
    })
    
    expect(store.checksCompleted).toBe(true)
    expect(store.webGLSupported).toBe(true)
    expect(store.opusSupported).toBe(true)
    expect(store.allMandatoryChecksPassed).toBe(true)
    expect(store.canEnterDashboard).toBe(true)
  })

  it('cannot enter dashboard if webgl fails', () => {
    const store = useSystemStore()
    store.setResults({
      webGL: false,
      opus: true,
      h265: true,
      battery: null,
      online: true,
    })
    
    expect(store.allMandatoryChecksPassed).toBe(false)
    expect(store.canEnterDashboard).toBe(false)
  })

  it('cannot enter dashboard if opus fails', () => {
    const store = useSystemStore()
    store.setResults({
      webGL: true,
      opus: false,
      h265: true,
      battery: null,
      online: true,
    })
    
    expect(store.allMandatoryChecksPassed).toBe(false)
    expect(store.canEnterDashboard).toBe(false)
  })
})
