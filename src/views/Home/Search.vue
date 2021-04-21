<template>
  <div id="search"></div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      searchText: '',
      commList: [],

    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.searchText = this.$store.state.searchText
      // 获取搜索列表
      this.$axios.get('/apis/commodity/searchComm', {
        keyName: this.searchText,
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.commList = data.obj
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    getCommodityInfo(commNo) {
      this.$store.commit('GET_COMM', commNo)
      // 跳转至商品页面
      this.$router.push({path: '/CommodityInfo'})
    },
  }
}
</script>

<style lang="scss">

</style>
