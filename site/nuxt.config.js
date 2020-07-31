const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

const envFile = path.resolve(__dirname, '../.env')

if (process.env.NODE_ENV === 'development' && fs.existsSync(envFile)) {
  const envConfig = dotenv.parse(fs.readFileSync(envFile))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

export default {
  env: {
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  /**
   * Use babel
   */
  babel: {
    presets({
      envName
    }) {
      const envTargets = {
        client: {
          browsers: ['last 2 versions', 'iOS >= 8', 'Safari >= 8'],
        },
        server: {
          node: 'current',
        },
      }
      return [
        [
          '@nuxt/babel-preset-app',
          {
            targets: envTargets[envName],
          },
        ],
      ]
    },
  },
}
