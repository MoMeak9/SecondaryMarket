<template>
<div id="search"></div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      searchText: '',

    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.searchText = this.$store.state.searchText

    },
  }
}
</script>

<style lang="scss">

</style>
