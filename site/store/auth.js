import auth from 'auth0-js'

let auth0
let user

export const state = () => ({
  isAuthenticated: false,
  loggingIn: true,
  requiresAuth: false
})

export const mutations = {
  authenticate(state) {
    state.isAuthenticated = true
    state.loggingIn = false
  },
  loggingIn(state) {
    state.loggingIn = true
  },
  loggedIn(state) {
    state.loggingIn = false
  },
  requiresAuth(state) {
    state.requiresAuth = true
  },
  unrequireAuth(state) {
    state.requiresAuth = false
  }
}

export const actions = {
  async init() {
    if (auth0) {
      return auth0
    }

    auth0 = new auth.WebAuth({
      domain: this.app.context.env.AUTH0_DOMAIN,
      clientID: this.app.context.env.AUTH0_CLIENT_ID,
      redirectUri: window.location.origin + '/dashboard',
      responseType: 'id_token token',
    })
  },

  async login({
    dispatch
  }) {
    await dispatch('init')
    auth0.authorize({
      scope: 'offline_access profile email openid',
    })
  },

  async logout({
    dispatch
  }) {
    await dispatch('init')
    auth0.logout({
      returnTo: window.location.origin,
      clientID: this.app.context.env.AUTH0_CLIENT_ID,
    })
  },

  parseHash() {
    return new Promise((resolve, reject) => {
      auth0.parseHash({
          hash: window.location.hash,
          scope: 'profile openid email',
        },
        function (err, authResult) {
          if (err) {
            return reject(err)
          }

          auth0.client.userInfo(authResult.accessToken, function (err, user) {
            if (err) {
              return reject(err)
            }

            return resolve({
              ...authResult,
              user,
            })
          })
        }
      )
    })
  },

  async authenticate({
    dispatch,
    commit
  }) {
    await dispatch('init')
    user = await dispatch('parseHash')
    return user
  },

  async handleAuthentication({
    dispatch,
    state,
    commit
  }) {
    // If we are not on dashboard - do nothing. We only need authentication here
    if (window.location.pathname !== '/dashboard') {
      commit('unrequireAuth')
      return
    }

    commit('requiresAuth')

    // If we are authenticated, and we're still in authenticate mode, redirect
    if (
      state.isAuthenticated &&
      window.location.hash.includes('access_token')
    ) {
      this.app.router.push('/dashboard')
      return
    }

    // If we are authenticated, do nothing
    if (state.isAuthenticated) {
      return
    }

    // Now, if there is an access token, please parse it
    if (window.location.hash.includes('access_token')) {
      commit('loggingIn')
      let response = await dispatch('authenticate')
      user = response.user

      if (!user) {
        // @todo go to login page - something has gone wrong
        commit('loggedIn')
        return
      }

      if (response && response.user) {
        commit('authenticate')
        this.app.router.push('/dashboard')
        return
      }
    }

    if (!state.isAuthenticated) {
      return await dispatch('login')
    }
  },
}
