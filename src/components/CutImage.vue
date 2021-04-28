<template>
  <div>
    <div class="home-tab-body-img">
      <div class="imgList" v-for="(item,index) in fileImgList" :key="index">
        <div class="imgList-delete" @click="deleteImg(item)">
          <i class="el-icon-close" title="删除"></i>
        </div>
        <img :src="getReadImg(item.filePath)" alt="" @click="handlePictureCardPreview(item.filePath)">
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="getReadImg(filePathAdd)" alt="">
        </el-dialog>
      </div>
      <el-upload
          :multiple="false"
          :show-file-list="false"
          class="editor-slide-upload"
          :before-upload="beforeAvatarUploadPS"
          list-type="picture-card"
          action
          :limit="3"
      >
        <i class="el-icon-plus"></i>
        <p>(最多3张)</p>
      </el-upload>
    </div>
    <!-- 剪切图片的弹框-->
    <div class="upload-dialog">
      <el-dialog title="图片裁剪" :visible.sync="isShowCropper" :close-on-click-modal="false">
        <div class="vue-cropper-box">
          <div class="vue-cropper-content">
            <vueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="option.info"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :fixedBox="option.fixedBox"
                @realTime="realTime"
                @imgLoad="imgLoad"
            ></vueCropper>
          </div>
          <div class="operate-wrap">
            <div class="lf">
              <el-button type="primary" plain @click="turnLeft">左旋转</el-button>
              <el-button type="primary" plain @click="turnRight">右旋转</el-button>
              <el-button type="primary" plain @click="changeScale(1)">放大</el-button>
              <el-button type="primary" plain @click="changeScale(-1)">缩小</el-button>
              <el-button type="primary" @click="onCubeImg">上传</el-button>
            </div>
            <div class="rt">
              <el-button type="primary" @click="cancleCropper">取消</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "CutImage",
  data() {
    return {
      //裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: 'png', // 裁剪生成额图片的格式
        canMove: true,  // 能否拖动图片
        original: false,  // 上传图片是否显示原始宽高
        canMoveBox: true,  // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 740, // 默认生成截图框宽度
        autoCropHeight: 400, // 默认生成截图框高度
        fixedBox: true // 截图框固定大小
      },
      //切图尺寸是固定的，想可修改可把fixedBox设置为false
    }
  },
  methods: {
    beforeAvatarUploadPS(file) {
      if (this.imgLength > 2) {
        this.$message({
          type: "warning",
          message: "效果图最多上传3张"
        });
        return false
      }
      this.option.img = URL.createObjectURL(file);
      const isDWG = file.name.split('.');
      const format = isDWG[isDWG.length - 1];
      this.uploadParams.isFile = "1";
      // uploadParams.file="";
      if (format !== "png" && format !== "jpg") {
        this.$message.error('上传文件只能是 png或jpg 格式!');
        return false;
      }
      this.isShowCropper = true;
      // const dialog = new Promise((resolve,reject)=>{
      // });
      // return dialog
    },
    turnLeft() {
      this.$refs.cropper.rotateLeft();
    },
    turnRight() {
      this.$refs.cropper.rotateRight();
    },
    cancleCropper() {//取消截图
      this.isShowCropper = false;
    },
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    imgLoad(msg) {
      console.log('imgLoad')
      console.log(msg)
    },
    // 实时预览函数
    realTime(data) {
      console.log('realTime')
      this.previews = data
    },
    onCubeImg() {//剪切上传
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        // this.fileinfo.url = data;

        //先将显示图片地址清空，防止重复显示
        this.option.img = "";
        //将剪裁后base64的图片转化为file格式
        let file = this.convertBase64UrlToBlob(data);
        // this.fileImg=URL.createObjectURL(file);
        var formData = new FormData();
        formData.append("file", file);
        formData.append("isFile", '1');
        // eslint-disable-next-line no-undef
        projectResource.uploadImg(this.prjID, formData).then(res => {
          if (res.result === "0") {
            this.$message({
              type: "success",
              message: "上传成功"
            });
            this.fileTypeSearch();
            this.isShowCropper = false;
            // this.fileList=[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
          }
        });
      });
    },
// 将base64的图片转换为file文件
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], {type: "image/jpeg"});
    },
  }
}
</script>

<style scoped>

</style>
