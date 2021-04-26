<template>
  <div id="login">
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
      </div>
      <div class="login-form">
        <div class="form-wrap">
          <div class="login-switch-tab">
            <a href="#" v-for="(item, index) in menuTab" :key="item.id" :class="{'item-active':item.isActive}"
               @click="toggleMenu(item, index)">{{ item.txt }}</a>
          </div>
          <el-form :model="loginForm" v-show="menuTab[0].isActive" status-icon :rules="rules" ref="loginForm">
            <el-form-item prop="email" props="email">
              <el-input v-model="loginForm.email" placeholder="用户邮箱" prefix-icon="el-icon-message"></el-input>
            </el-form-item>
            <el-form-item prop="password" props="password">
              <el-input type="password" v-model="loginForm.password" placeholder="请输入登录密码"
                        prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <div class="form-bottom">
              <el-link @click="goRepassword">忘记密码</el-link>
            </div>
            <el-button type="primary" @click="login()">登录</el-button>
          </el-form>
          <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" v-show="menuTab[1].isActive">
            <el-form-item prop="name">
              <el-input v-model="registerForm.name" placeholder="用户名称" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="registerForm.email" placeholder="用户邮箱" prefix-icon="el-icon-message"
                        style="width: 70%;float: left" :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]"></el-input>
              <el-button type="primary" icon="el-icon-s-promotion" @click="validation()">验证</el-button>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="code" placeholder="验证码" prefix-icon="el-icon-chat-line-round"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="registerForm.password" placeholder="请输入登录密码"
                        prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input type="password" v-model="registerForm.checkPassword" placeholder="请再次输入密码"
                        prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPassword !== '') {
          this.$refs.registerForm.validateField('checkPassword')
        }
        callback()
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validatePass3 = (rule, value, callback) => {
      const reg = '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$'
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (value.search(reg)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    let validatePass4 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    let validatePass5 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
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
      },
      //验证码
      code: '',
      //  加密验证码
      encryptionCode: '',
      //  验证码时效
      time: '',
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
        code: [
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
      if (this.loginForm.email === '' || this.loginForm.password === '') {
        this.$notify.error({
          title: '错误',
          message: '请填写相应的邮箱和密码后登入！',
          type: 'error'
        })
      } else {
        this.$axios.post('/shop/user/login', this.$qs.stringify({
          userEmail: this.loginForm.email,
          userPassword: this.loginForm.password,
        })).then((resp) => {
          const data = resp.data
          if (data.code === 1) {
            if (data.obj.userBean.isBan === 1) {
              this.$notify({
                title: 'Error',
                message: '账户被封禁',
                type: 'error'
              })
            } else {
              //用户数据
              this.$store.commit('SET_TOKEN', data.obj.token)
              this.$store.commit('GET_USER', data.obj.userBean)
              console.log(this.$store.state.token)
              console.log(this.$store.state.user)
              if (data.obj.userBean.userRoot === 0) {
                this.$notify({
                  title: '登入成功',
                  message: '福大二手交易市场欢迎您',
                  type: 'success'
                })
                this.$router.push({path: '/home'})
              } else {
                this.$notify({
                  title: '登入成功',
                  message: '欢迎您，管理员',
                  type: 'success'
                })
                this.$router.push({path: '/adminHome'})
              }
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '用户名或密码错误！'
            })
          }
        })
      }
    },
    register() {
      if (this.registerForm.email === '' || this.registerForm.code === '' || this.registerForm.password === '' || this.registerForm.checkPassword === '' || this.registerForm.name === '') {
        this.$notify.error({
          title: '错误',
          message: '您是不是漏了什么？',
          type: 'error',
        })
      } else {
        this.$axios.post('/shop/user/register', this.$qs.stringify({
          code: this.code,
          encryptionCode: this.encryptionCode,
          time: this.time,
          userEmail: this.registerForm.email,
          userName: this.registerForm.name,
          userPassword: this.registerForm.password,
        })).then((resp) => {
          const data = resp.data
          if (data.code === 1) {
            this.$notify({
              title: '注册成功',
              message: '福大二手交易市场欢迎您',
              type: 'success'
            })
            this.registerForm = []
            this.menuTab[0].isActive = true
            this.menuTab[1].isActive = false
          } else {
            this.$notify.error({
              title: '错误',
              message: '邮箱验证码错误！',
              type: 'error'
            })
          }
        })
      }
    },
    validation() {
      this.$axios.get('/shop/message/sendEmail', {
        params: {
          userEmail: this.registerForm.email,
        }
      }).then((response) => {
        const data = response.data
        if (data.code === 1) {
          this.$notify({
            title: '发送成功',
            message: '请查看您的邮箱',
            type: 'success'
          })
          this.encryptionCode = data.obj.code;
          this.time = data.obj.time;
          console.log(this.encryptionCode)
          console.log(this.time)
        } else {
          this.$notify.error({
            title: '错误',
            message: '邮箱已被注册！',
            type: 'error'
          })
        }
      })
    },
    goRepassword() {
      this.$router.push({path: '/repassword'})
    }
  }
}
</script>
<style lang="scss">
@import "src/styles/main";

#login {
  width: 100%;
  align-items: center;

  .content {
    background-color: rgb(198, 235, 253);
    display: flex;
    position: relative;

    .login-banner-wrap {
      background-size: contain;
      background: url("~@/assets/image/背景.png") fixed no-repeat top;
      height: 100vh;
      width: 100vw;
    }

    .login-form {
      width: 350px;
      display: flex;
      padding-bottom: 20px;
      position: absolute;
      top: 20%;
      right: 30%;
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
          margin-bottom: 10px;

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
