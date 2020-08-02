<template>
  <div>
    <div v-if="loading">...</div>
    <div v-else>
      <div v-if="isAuthenticated">
        <button v-on:click="$store.dispatch('auth/logout')">Logout</button>
      </div>
      <Nuxt v-if="isAuthenticated" />
      <div v-else>
        You are not logged in to access this page.
        <nuxt-link to="/">Home</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
// @todo if not logged in, redirect
export default {
  computed: {
    isAuthenticated() {
      return this.$store.state.auth.isAuthenticated
    },
  },
  data() {
    return {
      loading: true,
    }
  },
  async mounted() {
    await this.$store.dispatch('auth/handleAuthentication')
    this.loading = this.$store.state.auth.loggingIn
  },
}
</script>
