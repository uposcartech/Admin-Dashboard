import auth from 'auth0-js'

let auth0
let user

export const state = () => ({
  isAuthenticated: false,
  loggingIn: true
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

    console.log(auth, auth0)
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

          console.log(authResult)

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
    console.log(auth0, user, 'user')
    // auth0.parseHash({ hash: window.location.hash })
    return user
  },

  async handleAuthentication({
    dispatch,
    state,
    commit
  }) {
    console.log('state', state.isAuthenticated)
    // If we are not on dashboard - do nothing. We only need authentication here
    if (window.location.pathname !== '/dashboard') {
      return
    }

    // If user is set we are authenticated
    // if (user) {
    //   console.log('we have a user')
    //   return
    // }

    // If we are authenticated, and we're still in authenticate mode, redirect
    if (
      state.isAuthenticated &&
      window.location.hash.includes('access_token')
    ) {
      console.log('we are authenticated but in authenticate mode still')
      this.app.router.push('/dashboard')
      return
    }
    console.log('+1', state.loggingIn)
    // If we are authenticated, do nothing
    if (state.isAuthenticated) {
      commit('loggedIn')
      console.log('we are authenticated')
      return
    }
    console.log('+2', state.loggingIn)
    // Now, if there is an access token, please parse it
    if (window.location.hash.includes('access_token')) {
      console.log('we are going to access a token')
      commit('loggingIn')
      let response = await dispatch('authenticate')
      user = response.user

      if (!user) {
        // @todo go to login page - something has gone wrong
        console.log('go to login page - something has gone wrong')
        commit('loggedIn')
        return
      }

      if (response && response.user) {
        console.log('Great! Logged in')
        commit('authenticate')
        this.app.router.push('/dashboard')
        return
      }
    }
    console.log('+', state.loggingIn)
    if (!state.isAuthenticated) {
      console.log('isNotAuthenticated')
      return await dispatch('login')
    }

    console.log('user', user)
  }
}
