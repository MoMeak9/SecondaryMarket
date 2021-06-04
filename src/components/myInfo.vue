<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="个人信息" name="first">
      <el-form :model="userBean" style="width: 50%;margin: 3em">
        <div class="right-item">
          <div class="item-label">余额 :</div>
          <div class="item-info">{{ this.userBean.userEmail }}</div>
        </div>
        <div class="right-item">
          <div class="item-label">邮箱 :</div>
          <div class="item-info">{{ this.userBean.userEmail }}</div>
        </div>
        <el-form-item prop="userName">
          用户：
          <el-input v-model="userBean.userName" placeholder="用户名称" prefix-icon="el-icon-user"
                    style="width: 85%;float: right"></el-input>
        </el-form-item>
        <el-form-item prop="userSex">
          性别：
          <div style="width: 85%;float: right">
            <el-radio v-model="userBean.userSex" label="男">男</el-radio>
            <el-radio v-model="userBean.userSex" label="女">女</el-radio>
            <el-radio v-model="userBean.userSex" label="">保密</el-radio>
          </div>
        </el-form-item>
        <el-form-item prop="userInfo">
          简介：
          <el-input type="textarea" :rows="4" v-model="userBean.userInfo" placeholder="简介"
                    prefix-icon="el-icon-message" style="width: 85%;float: right"></el-input>
        </el-form-item>
        <div class="right-item">
          <div class="item-label">权限 :</div>
          <div class="item-info" v-if="userBean.userRoot === 0">普通用户</div>
          <div class="item-info" v-else>管理员</div>
        </div>
        <div class="right-item">
          <div class="item-label">状态 :</div>
          <div class="item-info" v-if="userBean.authentication === 2">已认证</div>
          <div class="item-info" v-else>未认证</div>
        </div>
        <div class="right-item">
          <div class="item-label">学院 :</div>
          <div class="item-info">{{ userBean.college }}</div>
        </div>
        <div class="right-item">
          <div class="item-label">学号 :</div>
          <div class="item-info">{{ userBean.sno }}</div>
        </div>
        <el-button type="primary" @click="reset()">保存修改</el-button>
        <el-button type="danger" @click="logout()">登出账号</el-button>
      </el-form>
    </el-tab-pane>
    <!--              修改密码-->
    <el-tab-pane label="更改密码" name="second">
      <el-form :model="resetForm" ref="resetForm" style="width: 50%;margin: 3em" :rules="rules" status-icon>
        <el-form-item prop="password">
          旧密码：
          <el-input type="password" v-model="resetForm.password" placeholder="请输入旧密码"
                    prefix-icon="el-icon-lock" show-password style="width: 85%;float: right"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          新密码：
          <el-input type="password" v-model="resetForm.repassword" placeholder="请输入新密码"
                    prefix-icon="el-icon-lock" show-password style="width: 85%;float: right"></el-input>
        </el-form-item>
        <el-button type="danger" @click="repassword()">更改密码</el-button>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="身份认证" name="third" v-if="userBean.authentication!==2">
      <el-form :model="authenticationForm" status-icon :rules="rules" ref="ruleForm" label-width="80px"
               class="demo-ruleForm" style="width: 50%;margin: 3em">
        <el-form-item label="学院" prop="college" wi>
          <el-input v-model="authenticationForm.college" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="userRealName">
          <el-input v-model="authenticationForm.userRealName"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="sno">
          <el-input v-model.number="authenticationForm.sno" autocomplete="off"></el-input>
        </el-form-item>
        <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action=profilePhotoAction
            :show-file-list="false"
            name="profile"
            :before-upload="beforeAuthenticationPhotoUpload">
          <img v-if="authenticationForm.profileUrl" :src="authenticationForm.profileUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form>
      <el-button type="primary" @click="submitAuthentication()">提交审核</el-button>
    </el-tab-pane>
    <el-tab-pane label="收益" name="fifth">
      <div v-if="userBean.authentication===2">
        <el-image></el-image>
      </div>
      <div v-else>
        <div class="title">账户余额</div>
        <div class="money">
          998.00
        </div>
        <el-button @click="drawings">提现</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {Server} from "@/service/api";

export default {
  name: "myInfo",
  data() {
    //检测规则
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      headers: {
        Authorization: this.$store.state.token
      },
      activeName: 'first',
      first: '',
      userBean: '',
      authenticationForm: '',
      resetForm: {
        password: '',
        repassword: '',
      },
      profilePhotoAction:'',
      rules: {
        repassword: [
          {validator: validatePass, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    reset(){

    },
    //登出
    logout() {
      this.$store.commit('DEL_TOKEN')
      this.$store.commit('LOGOUT')
      this.$router.push({path: '/login'});
      this.$notify({
        title: '登出',
        message: '退出登入',
        type: 'error'
      })
    },
    //修改密码
    repassword() {
      Server.changePassword({
        newPassword: this.resetForm.repassword,
        oldPassword: this.resetForm.password
      },this.token).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '密码修改成功',
            type: 'success'
          })
        }
      })
    },
    //提交审核内容
    submitAuthentication() {
      let config = {
        headers: {
          Authorization: this.token,
          'Content-Type': 'multipart/form-data'
        }
      }
      let param = this.AuthenticationImageFile;
      param.append('college', this.authenticationForm.college)
      param.append('sno', this.authenticationForm.sno)
      param.append('userRealName', this.authenticationForm.userRealName)
      this.$axios.post('/shop/user/uploadAuthenticationInfo', param, config).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '提交审核成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '错误',
            message: '提交失败',
            type: 'error'
          })
        }
        this.authenticationForm = {
          college: '',
          sno: '',
          userRealName: '',
          profileUrl: ''
        }
      })
    },
    //证件上传
    beforeAuthenticationPhotoUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传的证件图片只能是 JPG/PNG/JPEG 格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传的证件图片大小不能超过 10MB!')
        return false
      }
      var windowURL = window.URL || window.webkitURL
      this.authenticationForm.profileUrl = windowURL.createObjectURL(file)
      //设置图片表单
      var commImages = new FormData()
      commImages.append('photo', file, file.name)
      this.AuthenticationImageFile = commImages
      return false
    },
    //提现
    drawings(){

    }
  }
}
</script>

<style scoped>

</style>
