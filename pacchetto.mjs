import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyViteVue from 'fastify-vite-vue'
import data from './data.mjs'
import viteConfig from './vite.config.mjs'

const app = Fastify()

app.register(data)

await app.register(FastifyVite, {
  root: import.meta.url,
  renderer: FastifyViteVue,
  generate: {
    paths: ['/'],
  },
  entry: {
    server: '/entry/server.js',
  },
  vite: {
    ...viteConfig,
    configFile: false,
  }
})

await app.vite.commands()
await app.listen(3000)
