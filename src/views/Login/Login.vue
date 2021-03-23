<template>
  <div id="login">
    <div class="header">
      <a href="/"><i class="iconfont icon-B"></i></a>
    </div>
    <div class="content">
      <div class="login-banner-wrap">
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
        <!--          <img src="~@/assets/image/68128465.png">-->
      </div>
      <div class="login-form">
        <div class="form-wrap">
          <div class="login-switch-tab">
            <a href="#" v-for="(item, index) in menuTab" :key="item.id" :class="{'item-active':item.isActive}"
               @click="toggleMenu(item, index)">{{ item.txt }}</a>
          </div>
          <el-form :model="loginForm" v-show="menuTab[0].isActive" status-icon :rules="rules" ref="loginForm">
            <el-form-item prop="email" props="email">
              <el-input v-model="loginForm.email" placeholder="用户邮箱" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <el-form-item prop="password" props="password">
              <el-input type="password" v-model="loginForm.password" placeholder="请输入登录密码"
                        prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <div class="form-bottom">
              <a href="#">忘记密码</a>
            </div>
            <el-button type="danger" @click="login()">登录</el-button>
          </el-form>
          <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" v-show="menuTab[1].isActive">
            <el-form-item prop="name">
              <el-input v-model="registerForm.name" placeholder="用户名称" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="registerForm.email" placeholder="用户邮箱" prefix-icon="el-icon-message"
                        style="width: 70%;float: left"></el-input>
              <el-button type="primary" icon="el-icon-s-promotion" @click="validation()">验证</el-button>
            </el-form-item>
            <el-form-item prop="emailCode">
              <el-input v-model="registerForm.emailCode" placeholder="验证码"
                        prefix-icon="el-icon-chat-dot-square"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="registerForm.password" placeholder="请输入登录密码"
                        prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input type="password" v-model="registerForm.checkPassword" placeholder="请再次输入密码"
                        prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-button type="danger" @click="register()">注册</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPassword !== '') {
          this.$refs.registerForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      const reg = '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$'
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (value.search(reg)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    var validatePass4 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var validatePass5 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      }
    }
    return {
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        name: '',
        email: '',
        password: '',
        checkPassword: '',
        emailCode: ''
      },
      menuTab: [
        {txt: '登录', isActive: true},
        {txt: '注册', isActive: false}
      ],
      rules: {
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        name: [
          {validator: validatePass4, trigger: 'blur'}
        ],
        email: [
          {validator: validatePass3, trigger: 'blur'}
          //  自定义验证器vue-validator
        ],
        emailCode: [
          {validator: validatePass5, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    toggleMenu(item, index) {
      if (item.isActive !== true) {
        this.menuTab[1 - index].isActive = item.isActive
        item.isActive = !item.isActive
      }
    },
    login() {
      this.$axios.post('/apis/user', this.loginForm).then((resp) => {
        const data = resp.data
        if (data.code === 200) {
          this.$store.commit('GET_USER', data.data)
          this.$router.push({
            name: 'Home'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '用户名或密码错误！'
          })
        }
      })
    },
    register() {
      this.$axios.post('/apis/users', this.registerForm).then((resp) => {
        const data = resp.data
        if (data.code === 200) {
          this.$notify({
            title: '成功',
            message: '您已成功注册，请等待管理员审核通过',
            type: 'success'
          })
          this.registerForm = []
          this.menuTab[0].isActive = true
          this.menuTab[1].isActive = false
        } else {
          this.$notify.error({
            title: '错误',
            message: '邮箱验证码错误！'
          })
        }
      })
    },
    validation() {
      this.$axios.post('/apis/users', this.registerForm.email).then((resp) => {
        const data = resp.data
        if (data.code === 200) {
          this.$notify({
            title: '成功',
            message: '请查看您的邮箱',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '邮箱已被注册！'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
#login {
  min-width: 1190px;
  width: 100%;
  padding: 22px 0;
  align-items: center;

  .header {
    margin: 0 18vw;
    height: 44px;

    .icon-B {
      font-size: 35px;
    }
  }

  .content {
    background-color: rgb(198, 235, 253);
    margin-top: 25px;
    display: flex;
    position: relative;

    .login-banner-wrap {
      background-size: cover;
      background: url("~@/assets/image/68128465.png") fixed no-repeat top;
      height: 100vh;
      width: 100vw;
    }

    .login-form {
      width: 350px;
      display: flex;
      padding-bottom: 20px;
      position: absolute;
      top: 91px;
      right: 425px;
      background-color: #fff;
      border: #8c939d solid 1px;
      border-radius: 6px;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
      justify-content: center;

      .form-wrap {
        margin: 0 25px;
        width: 100%;

        .login-switch-tab {
          margin-bottom: 20px;
          margin-top: 20px;

          .item-active {
            border-bottom: 2px solid #000000;
          }

          a {
            height: 18px;
            line-height: 5px;
            font-size: 16px;
            color: #3c3c3c;
            margin: 9px 20px 0 5px;
            font-weight: 700;
          }
        }

        .el-button--danger {
          width: 100%;
        }

        .form-bottom {
          text-align: right;
          margin-top: 10px;

          a {
            font-size: 12px;
            color: #6c6c6c;
          }
        }
      }
    }
  }
}
</style>
