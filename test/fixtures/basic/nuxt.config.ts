import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  nuxt3WinstonLog: {
    level: 'debug',
  }
})
