<template>
  <div id="app">
    Hello {{ text }}
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      text: 'Something'
    }
  },
  components: {

  }
}
</script>

<style lang="scss">
#app {

}
</style>
