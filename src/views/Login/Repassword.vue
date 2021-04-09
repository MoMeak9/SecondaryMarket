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
      <el-form :model="resetFrom" status-icon :rules="rules" ref="resetFrom">
        <el-form-item prop="email">
          <el-input v-model="resetFrom.email" placeholder="用户邮箱" prefix-icon="el-icon-message"
                    style="width: 70%;float: left"></el-input>
          <el-button type="primary" icon="el-icon-s-promotion" @click="validation()">验证</el-button>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="code" placeholder="验证码"
                    prefix-icon="el-icon-paperclip"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="resetForm.password" placeholder="请输入新密码"
                    prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input type="password" v-model="resetFrom.checkPassword" placeholder="请再次输入密码"
                    prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-button type="danger" @click="register">注册</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Repassword",
  data(){
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
    return{
      resetForm:{
        email: '',
        password: '',
        checkPassword: '',
        code:'',
        encryptionCode:'',
        time:''
      },
      rules: {
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    }
  }
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
