<template>
  <div class="profile">
    <div class="all">
      <div class="pro_top">
       <div class="text">头像:</div>
       <img :src="avatar" id="head" :key="avatar" alt="">
       <el-button @click="dialogVisible=true">上传头像</el-button>
     </div>
    <!-- 弹出层-裁剪 -->
     <div class="footerBtn">
    <el-dialog title="编辑头像" :visible.sync="dialogVisible" :before-close="handleClose">
      <span>
        <el-row>
          <input
              ref="filElem"
              type="file"
              id="uploads"
              accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="uploadImg($event,1)"
              class="el-button hide"
              style="margin-bottom:15px"
          />
          <el-button type="primary" class="upload-img" size="medium" @click="clickUpload">上传图片</el-button>
        </el-row>
        <el-row>
          <el-col :span="14">
            <!-- 裁剪 -->
            <vueCropper
                style="width:100%;height:300px"
                ref="cropper"
                :img="attach.customaryUrl"
                :autoCrop="options.autoCrop"
                :fixedBox="options.fixedBox"
                :canMoveBox="options.canMoveBox"
                :autoCropWidth="options.autoCropWidth"
                :autoCropHeight="options.autoCropHeight"
                :centerBox="options.centerBox"
                @realTime="realTime"
            ></vueCropper>
          </el-col>
          <el-col :span="6.5">
            <h2 align="center" class=" mar-left-50">头像预览</h2>
            <div class="show-preview">
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img" width="100%" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="footerBtn" align="center">
          <el-button type="primary " size="medium" round @click="confirm('blob')">确认</el-button>
          <el-button type="info" size="medium" round @click="handleClose">取消</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
     <div class="text">性别:</div>
      <template>
        <el-radio-group v-model="form.isMan">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </template>
      <br>
      <div class="text">邮箱:</div>
      <div class="text2" v-if="emailShow">
        {{form.email}}
      </div>
      <input type="text" v-model="form.email" v-if="!emailShow" class="inpputted">
      <div class="text3" @click="emailShow = !emailShow; emailMsg= emailMsg==='确定'?'修改邮箱':'确定'  ">
        {{emailMsg}}
      </div>
      <br>
      <div class="text">手机:</div>
      <div class="text2" v-if="telephoneShow">
        {{form.telephone}}
      </div>
      <input type="text" v-model="form.telephone" v-if="!telephoneShow" class="inpputted">
      <div class="text3" @click="telephoneShow = !telephoneShow; telephoneMsg= telephoneMsg==='确定'?'修改手机号':'确定'  ">
        {{telephoneMsg}}
      </div>
      <br>
      <div class="text">管理员:</div>
      <el-switch
          disabled
          v-model="isAdmin"
          active-color="#13ce66"
          inactive-color="#ff4949">
      </el-switch>
      <br>
      <div class="text">所属公司:</div>
      <div class="text2">{{$store.state.userGroup}}</div>
      <div class="save_pr">
      <button id="save" @click="submit">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
//数据库里需要存两份图片地址，一张为原图地址，一张为裁剪后的头像地址
export default {
  data() {
    return {
      avatar:'https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=5572fa498d4958a498bb78944d1b285c&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2F47d1a7efce1b9d165ef50303fcdeb48f8c5464bd.jpg',
      emailShow:1,
      telephoneShow:1,
      isAdmin:true,
      emailMsg:'修改邮箱',
      telephoneMsg:'修改手机号',
      dialogVisible: false,
      options: {
        autoCrop: true, //默认生成截图框
        fixedBox: true, //固定截图框大小
        canMoveBox: true, //截图框不能拖动
        centerBox: false, //截图框被限制在图片里面
        autoCropWidth:120,  //截图框宽度
        autoCropHeight:120, //截图框高度
      },
      previews: {}, //实时预览图数据
      attach: {
        //后端附件表
        id: "",
        userId: "",
        customaryUrl: "", //原图片路径
        laterUrl: "", //裁剪后图片路径  /static/logo.png
        attachType: "photo" //附件类型
      },
      form:{
        isMan:'',
        email:'',
        telephone:''
      }
    };
  },
  methods: {
     dataURLtoFile(dataurl, filename) {
     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
     while(n--){
    u8arr[n] = bstr.charCodeAt(n);
    }
      return new File([u8arr], filename, {type:mime});
    },
    //控制弹出层关闭
    handleClose() {
      this.dialogVisible = false;
    },
    //实时预览
    realTime(data) {
      this.previews = data;
    },
    //点击图片调取input
    clickUpload(){
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //选择本地图片
    uploadImg(e) {
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      //fileReader 接口，用于异步读取文件数据
      var reader = new FileReader();
      reader.readAsDataURL(file); //重要 以dataURL形式读取文件
      reader.onload = e => {
        // data = window.URL.createObjectURL(new Blob([e.target.result])) 转化为blob格式
        this.attach.customaryUrl = e.target.result;
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
      };
    },
    //确认截图,上传
    confirm() {
      this.$refs.cropper.getCropData(res => {
        this.avatar = res
        let data = this.dataURLtoFile(res,'avatar.png')
        let formData = new FormData()
        formData.append('profile',data)
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          onUploadProgress: (progressEvent) => {
            this.pro = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          }
        }
        this.axios.post('/user/updateProfile', formData, config)
          .then(()=>{
            this.$message.success('修改成功')
            this.dialogVisible = false
            this.axios.get('/user/getMsg')
                .then(res=>{
                  this.$store.commit('changeProfile',res.data.user)
                })
          })
      });
    },
    submit(){
       let data = JSON.stringify(this.form)
      this.axios.post('/user/updateMsg',data)
          .then(res=>{
            if (res.status)
              this.$message.success('保存成功')
            this.axios.get('/user/getMsg')
                .then(res=>{
                  this.$store.commit('changeProfile',res.data.user)
                })
          })
    }
  },
  created() {
    if (this.$store.state.profile.profileUrl !== null )
    this.avatar = this.$store.state.profile.profileUrl
    this.form.isMan = this.$store.state.profile.isMan
    this.isAdmin = this.$store.state.isAdmin===1
    this.form.email = this.$store.state.profile.email
    this.form.telephone = this.$store.state.profile.telephone
  }
};
</script>
<style scoped>
*{
  font-weight: bold !important;
  font-size: 16px;
}
/* 弹性布局 水平居中 */
.el-dialog{
  width: 700px !important;
  height: auto;
}
.show-preview {
  display: flex;
  justify-content: center;
}
.preview {
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
  width: 120px !important;
  height: 120px !important;
  margin-left: 50px;
  margin-top: 50px;
}
.upload-img{
  width: 100px;
  height: 30px;
  border:1px solid #f08512;
  margin-bottom: 5px;
  text-align: center;
  cursor: pointer;
}
.footerBtn {
  display: flex;
  justify-content: center;
}
#uploads{
  display: none;
}

.all{
  height: 65vh;
  padding-left: 5vw;
  background-color: white;
  width: 70% !important;
  margin-left: 8vw;
  margin-top: 5vh;
  box-shadow: 0 0 10px skyblue;
}
.text{
  display: inline-block;
  text-align: center;
  line-height: 8vh;
  margin-right: 3vw;
  font-size: 16px;
}
#head{
  border-radius: 50px;
  width: 8vh;
  height: 8vh;
  margin-top: 2vh;
  margin-left: 1vw;
  border: solid 1px gray;
  display: inline-block;
}
.profile .text2{
  display: inline-block;
  font-weight: lighter !important;
  width: 13vw;
}
.profile .inpputted{
  display: inline-block;
  font-weight: lighter !important;
  width: 13vw;
}
.profile .text3{
  display: inline-block;
  font-weight: lighter;
  color: rgb(112, 191, 133);
  margin-left: 2vw;
}
.profile .text3:hover{
  cursor: pointer;
  color: rgb(37, 158, 70);
}
</style>

<style>
.profile .el-button{
  margin-bottom: 20px !important;
}
.pro_top>.el-button{
  margin-left: 2vw;
  position: relative;
  bottom: 2vh;
}
.save_pr{
  width: 100%;
}
#save{
  width: 10vw;
  border-radius: 50px;
  height: 5vh;
  background-color: rgb(77,128,219);
  border: none;
  position: relative;
  left: 23vw;
  color: white;
}
#save:hover{
  background-color: rgb(39, 99, 206);
}
</style>
