import {
  mount
} from '@vue/test-utils'
import Logo from './Navigation.vue'

describe('Navigation', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo)
    expect(wrapper.vm).toBeTruthy()
  })
})
