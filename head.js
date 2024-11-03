// https://github.com/vueuse/head#useheadhead-headobject--refheadobject

// This file can either have individual exports matching the
// properties of @vueuse/useHead's HeadObject type (linked above)

export const title = null
export const base = null

export const meta = []
export const link = []
export const style = []
export const script = []

export const htmlAttrs = {}
export const bodyAttrs = {}

// Or a default export with the same properties

export default {
  title: 'Pacchetto',
  base: null,
  meta: [
    {
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ],
  link: [],
  style: [],
  script: [],
  htmlAttrs: {
    'lang': 'en'
  },
  bodyAttrs: {}
}

// If a default export is present, it'll be used over any
// other individually exported properties from the file
