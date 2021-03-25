<template>
  <div id="repassword">
    这个是找密码
    <header>

    </header>
    <div class="content">
      <vue-particles
          color="#dedede"
          :particleOpacity="0.7"
          :particlesNumber="80"
          shapeType="circle"
          :particleSize="4"
          linesColor="#dedede"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.4"
          :linesDistance="150"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push"
      >
      </vue-particles>

    </div>
  </div>
</template>

<script>
export default {
  name: "Repassword"
}
</script>

<style lang="scss">
#repassword{
  min-width: 1190px;
  width: 100%;
  padding: 22px 0;
  align-items: center;
}
</style>
