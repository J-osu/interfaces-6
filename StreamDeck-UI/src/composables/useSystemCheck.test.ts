import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSystemCheck } from './useSystemCheck'
import { useSystemStore } from '@/stores/systemStore'

describe('useSystemCheck composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // @ts-ignore
    global.navigator = {
      onLine: true,
      getBattery: vi.fn().mockResolvedValue({ level: 0.8, charging: true }),
      connection: { effectiveType: '4g', downlink: 10 }
    }
  })

  it('initializes with pending checks', () => {
    const { checks } = useSystemCheck()
    expect(checks.value.length).toBe(5)
    checks.value.forEach(check => {
      expect(check.status).toBe('pending')
    })
  })

  it('runAllChecks updates store and checks status', async () => {
    // Mock canvas and audio/video elements globally
    const createElementSpy = vi.spyOn(document, 'createElement')
    createElementSpy.mockImplementation((tag) => {
      if (tag === 'canvas') {
        return {
          getContext: vi.fn().mockReturnValue({
            getParameter: vi.fn().mockReturnValue('Mock GPU')
          })
        } as unknown as HTMLCanvasElement
      }
      if (tag === 'audio' || tag === 'video') {
        return {
           canPlayType: vi.fn().mockReturnValue('probably')
        } as unknown as HTMLMediaElement
      }
      return document.createElement(tag)
    })

    const { checks, runAllChecks } = useSystemCheck()
    const store = useSystemStore()

    await runAllChecks()

    expect(store.checksCompleted).toBe(true)
    expect(store.webGLSupported).toBe(true)
    expect(store.opusSupported).toBe(true)
    expect(store.h265Supported).toBe(true)
    expect(store.isOnline).toBe(true)
    expect(store.batteryLevel).toBe(80)

    checks.value.forEach(check => {
      expect(check.status).toBe('pass')
    })

    createElementSpy.mockRestore()
  })
})
