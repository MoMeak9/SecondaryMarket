<template>
  <div id='page404'>
    <vue-particles
        color="#444444"
        :particleOpacity="0.7"
        :particlesNumber="50"
        shapeType="circle"
        :particleSize="3"
        linesColor="#E6E6FA"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.6"
        :linesDistance="150"
        :moveSpeed="6"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
    >
    </vue-particles>
  </div>
</template>

<script>
export default {
  name: "page404",
  data() {
  },
  mounted() {
    this.baseHost = this.$store.state.baseHost;
    this.$message({
      message: '未知页面-即将返回主页',
      type: 'error'
    });
    clearTimeout(this.timer);  //清除延迟执行
    this.timer = setTimeout(() => {   //设置延迟执行
      this.$router.push({path: '/login'});
    }, 1500);
  }
}
</script>

<style scoped>
#page404 {
  background: url("~@/assets/image/404.png") fixed no-repeat top;
  background-size: cover;
  height: 100%;
  width: 100%;
  position: fixed;
  overflow: scroll;
}
</style>
