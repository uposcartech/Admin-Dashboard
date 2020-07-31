import createAuth0Client from '@auth0/auth0-spa-js'

// either with async/await
let auth0

export const actions = {
  async init() {
    if (auth0) {
      return
    }
    auth0 = await createAuth0Client({
      domain: this.app.context.env.AUTH0_DOMAIN,
      client_id: this.app.context.env.AUTH0_CLIENT_ID,
    })

    return auth0
  },

  async login({ dispatch }) {
    let root = ''
    if (typeof window !== 'undefined') {
      root = window.location.origin
    }
    await dispatch('init')
    await auth0.loginWithRedirect({
      redirect_uri: `${root}/dashboard`,
    })

    return auth0
  },

  async getUser({}) {
    return await auth0.getUser()
  },

  async logout({ dispatch }) {
    await dispatch('init')
    let loggedout = auth0.logout()
    return loggedout
  },

  async silentLogin() {},

  async fetch(url, obj) {
    const accessToken = await auth0.getTokenSilently()

    obj.headers = obj.headers || {}
    obj.headers.Authorization = 'Bearer ' + accessToken
    const result = await fetch(url, obj)
    const data = await result.json()
    return data
  },
}
