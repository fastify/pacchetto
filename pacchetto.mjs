import Fastify from 'fastify'
import FastifyVite from 'fastify-vite'
import FastifyViteVue from 'fastify-vite-vue'
import data from './data.mjs'

const app = Fastify()

app.register(data)

await app.register(FastifyVite, {
  root: import.meta.url,
  renderer: FastifyViteVue
})

await app.vite.commands()
await app.listen(3000)
