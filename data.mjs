import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fp from 'fastify-plugin'
import pMap from 'p-map'
import { createRequire } from 'module'
import plugins from './plugins.mjs'

const require = createRequire(import.meta.url)
const { getPackageManifest } = require('query-registry')

export default fp(async function (fastify) {
  let data
  const dataPath = join(dirname(fileURLToPath(import.meta.url)), 'data.json')
  if (!process.argv.includes('update') && existsSync(dataPath)) {
    data = JSON.parse(await readFile(dataPath, 'utf8'))
  } else {
    data = JSON.parse(JSON.stringify(plugins))
    await pMap(Object.keys(data), (category) => Promise.all(
      data[category].map(async (pkg, i) => {
        const { description, version } = await getPackageManifest({ name: pkg })
        data[category][i] = { name: pkg, description, version }
      })
    ))
    await writeFile(dataPath, JSON.stringify(data, null, 2))
  }
  fastify.decorate('data', data)
})
