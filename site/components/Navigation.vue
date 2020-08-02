<template>
  <div>
    <div>
      <nuxt-link to="/">
        Home
      </nuxt-link>
    </div>
    <div v-if="$store.state.auth.isAuthenticated">
      <div>
        <nuxt-link to="/dashboard">
          Dashboard
        </nuxt-link>
      </div>
    </div>
    <div>
      <button
        v-if="!$store.state.auth.isAuthenticated"
        v-on:click="$store.dispatch('auth/login')"
      >
        Login
      </button>
      <button v-else v-on:click="$store.dispatch('auth/logout')">
        Logout
      </button>
    </div>
  </div>
</template>
