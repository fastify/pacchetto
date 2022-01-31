import { createSSRApp } from 'vue'
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createBeforeEachHandler } from 'fastify-vite-vue/routing'
import { Inkline, components } from '@inkline/inkline'

import baseLayout from '@app/client.vue'
import loadRoutes from '@app/routes.js'

import '@inkline/inkline/inkline.scss'
import './main.scss'

const createHistory = import.meta.env.SSR
  ? createMemoryHistory
  : createWebHistory

export async function createApp (ctx) {
  const resolvedRoutes = await loadRoutes()
  const app = createSSRApp(baseLayout)
  const head = createHead()
  const router = createRouter({
    history: createHistory('/pacchetto/'),
    routes: resolvedRoutes
  })
  if (!import.meta.env.SSR) {
    router.beforeEach(createBeforeEachHandler(resolvedRoutes))
  }
  app.use(router)
  app.use(head)
  app.use(Inkline, { components })  
  return { ctx, app, head, router, routes: resolvedRoutes }
}
