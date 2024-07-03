import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  nuxt3WinstonLog: {
    singleLogPath: 'logs',
    singleLogName: 'nuxt-log.log',
    level: 'debug',
    skipRequestMiddlewareHandler: true
  }
})
