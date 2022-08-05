# pacchetto

A minimal UI to build `package.json` files for Fastify projects. Built with [fastify-vite](https://fastify-vite.dev/).

<img width="1328" alt="Screen Shot 2022-01-30 at 08 53 24" src="https://user-images.githubusercontent.com/12291/151698515-a2cb977c-cd43-4fa6-bdbe-b5137746065c.png">

All data comes from `plugins.mjs`.

If you change/add/remove a package in the `plugins.mjs` file, you need to run `npm run generate`. This updates `data.json` with updated plugin information.
