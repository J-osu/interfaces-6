import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import BaggageDashboard from '../src/components/BaggageDashboard.vue'

// Vuetify setup for tests
const vuetify = createVuetify({
  components,
  directives,
})

describe('BaggageDashboard.vue', () => {
  it('renders dashboard correctly', () => {
    const wrapper = mount(BaggageDashboard, {
      global: {
        plugins: [vuetify],
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('TSA Control')
  })

  it('updates filter status when tabs are selected', async () => {
    const wrapper = mount(BaggageDashboard, {
      global: {
        plugins: [vuetify],
      },
    })

    // Find the 'delayed' button
    const delayedBtn = wrapper.find('#filter-delayed')
    await delayedBtn.trigger('click')

    // Verify filter updated
    expect(wrapper.vm.filter).toBe('delayed')
    expect(wrapper.emitted('update:filter')).toBeTruthy()
    expect(wrapper.emitted('update:filter')?.[0]).toEqual(['delayed'])
  })
})
