<template>
  <div class="container">
    <div>
      <div class="subtitle">
        Dashboard
      </div>
      <div>
        <button v-on:click="$store.dispatch('auth/logout')">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
}
</script>
