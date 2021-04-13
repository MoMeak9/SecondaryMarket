<template>
  <div class="menu">
    <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            快捷菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="1">首页</el-dropdown-item>
        <el-dropdown-item command="2">个人中心</el-dropdown-item>
        <el-dropdown-item v-if="this.$store.state.userBean.userRoot === 1" command="3">管理系统</el-dropdown-item>
        <el-dropdown-item command="4">退出登入</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Menu.vue",
  data() {
    return {}
  },
  methods: {
    handleCommand(command) {
      if (command === '1') {
        this.$router.push({path: '/home'});
        this.$notify({
          title: '跳转成功',
          message: '二手商城主页',
          type: 'success'
        })
      } else if (command === '2') {
        this.$notify({
          title: '跳转成功',
          message: '个人主页',
          type: 'success'
        })
        this.$router.push({path: '/user'});
      } else if (command === '3') {
        this.$notify({
          title: '跳转成功',
          message: '管理中心',
          type: 'success'
        })
        this.$router.push({path: '/adminHome'});
      } else {
        this.$store.commit('DEL_TOKEN', this.userBean)
        this.$store.commit('LOGOUT', this.token)
        this.$router.push({path: '/login'});
        this.$notify({
          title: '登出',
          message: '退出登入',
          type: 'error'
        })
      }
    },
  }
}

</script>

<style lang="scss">
.menu {
}

.el-dropdown-link {
  font-size: 1em;
  cursor: pointer;
  color: black;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
