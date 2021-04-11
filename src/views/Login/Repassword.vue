<template>

  <el-row id="register">

    <vue-particles
        color="#ffffff"
        :particleOpacity="0.7"
        :particlesNumber="50"
        shapeType="circle"
        :particleSize="3"
        linesColor="#aaaaaa"
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
    <div class="reset-content">
      <h2>邮箱找回</h2>
      <el-form :model="resetForm" status-icon :rules="rules" ref="registerForm">
        <el-form-item prop="email">
          <el-input v-model="resetForm.userEmail" placeholder="用户邮箱" prefix-icon="el-icon-message"
                    style="width: 70%;float: left"></el-input>
          <el-button type="primary" icon="el-icon-s-promotion" @click="validation()">验证</el-button>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="resetForm.code" placeholder="验证码"
                    prefix-icon="el-icon-paperclip"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="resetForm.password" placeholder="请输入登录密码"
                    prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input type="password" v-model="resetForm.checkPassword" placeholder="请再次输入密码"
                    prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-button type="danger" @click="resetpassword()">>修改密码</el-button>
      </el-form>
    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.resetForm.checkPassword !== '') {
          this.$refs.resetForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      resetForm: {
        userEmail: '',
        password: '',
        checkPassword: '',
        code: '',
        encryptionCode: '',
        time: '',
      },
      rules: {
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        code: [
          {validator: validatePass3, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    validation() {
      this.$axios.get('/apis/message/sendEmail', {
        params: {
          userEmail: this.resetForm.userEmail,
        }
      }).then((response) => {
        const data = response.data
        if (data.code === 1) {
          this.$notify({
            title: '发送成功',
            message: '请查看您的邮箱',
            type: 'success'
          })
          this.resetForm.encryptionCode = data.obj.code;
          this.resetForm.time = data.obj.time;
          console.log(this.resetForm.encryptionCode)
          console.log(this.resetForm.time)
        } else {
          this.$notify.error({
            title: '错误',
            message: '邮箱格式错误',
            type: 'error'
          })
        }
      })
    },
    resetpassword() {
      if (this.resetForm.password === '' || this.resetForm.code === '' || this.resetForm.userEmail === '' || this.resetForm.checkPassword === '') {
        this.$notify.error({
          title: '错误',
          message: '不要漏填哦',
          type: 'error'
        })
      } else {
        this.$axios.post('/apis/user/forgetPassword', this.$qs.stringify({
          code: this.resetForm.code,
          encryptionCode: this.resetForm.encryptionCode,
          time: this.resetForm.time,
          userEmail: this.resetForm.userEmail,
          userPassword: this.resetForm.password
        })).then((response) => {
          const data = response.data
          if (data.code === 1) {
            this.$notify({
              title: '修改成功',
              message: '可以愉快地登入',
              type: 'success'
            })
            this.$router.push({path: '/login'});
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
}

</script>

<style scoped>
#register {
  background-size: cover;
  background: url("~@/assets/image/62249052.jpg") fixed no-repeat top;
  height: 100vh;
  width: 100vw;
  position: fixed;
  overflow: scroll;
  z-index: -1;
}

.reset-content {
  background: white;
  width: 30em;
  padding: 2em;
  position: absolute;
  top: 10%;
  right: 40%;
  border-radius: 1em;
  box-shadow: black 0 0 2em;
}
</style>
