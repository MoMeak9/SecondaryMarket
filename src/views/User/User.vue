<template>
  <el-container id="user">
    <el-header class="header" style="height:30px">
      <div class="header-wrap">
<!--        <a href="/home">-->
<!--          <span>首页</span>-->
<!--        </a>-->
<!--        网站导航-->
      </div>
    </el-header>
    <el-container class="nav">
      <div class="nav-wrap">
        <a href="/home">
          <i class="iconfont icon-B"></i>
        </a>
      </div>
    </el-container>
    <el-container class="content">
      <div class="container">
        <el-col :span="4" class="ct-left">
          <div class="img-wrap">
            <el-upload
                class="avatar-uploader"
                :headers="headers"
                :action=profilePhotoAction
                :show-file-list="false"
                :on-success="handleProfilePhotoSuccess"
                :before-upload="beforeProfilePhotoUpload">
              <img v-if="userBean.profileUrl" :src="userBean.profileUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="img-bottom">上传头像</div>
            </el-upload>
          </div>
          <div class="menu-tab">
            <div v-for="item in menuTab" :key="item.id" :tabindex="item.id"
                 :class="[ {'isActive':item.isActive}, 'menu-tab-item' ]" @click="toggleMenuItem(item)">{{ item.txt }}
            </div>
          </div>
        </el-col>
        <el-col :span="20" class="ct-right">
          <div class="right-container">
            <!--            用户信息展示-->
            <div class="user-info" v-show="menuTab[0].isActive">
              <el-form :model="userBean" style="width: 50%;margin: 3em">
                <el-form-item prop="userName">
                  用户名：
                  <el-input v-model="userBean.userName" placeholder="用户名称" prefix-icon="el-icon-user"
                            style="width: 85%;float: right"></el-input>
                </el-form-item>
                <el-form-item prop="userEmail">
                  邮箱：
                  <el-input v-model="userBean.userEmail" placeholder="邮箱账号" prefix-icon="el-icon-message"
                            style="width: 85%;float: right"></el-input>
                </el-form-item>
                <el-form-item prop="userSex">
                  性别：
                  <div style="width: 85%;float: right">
                    <el-radio v-model="userBean.userSex" label="男">男</el-radio>
                    <el-radio v-model="userBean.userSex" label="女">女</el-radio>
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
                <el-button type="danger" @click="reset()">保存修改</el-button>
              </el-form>
            </div>
            <!--            历史订单展示-->
            <div class="history-order" v-show="menuTab[1].isActive">
              <el-table :data="historyOrder" stripe style="width: 100%">
                <!--                商品图片-->
                <el-table-column label="图片">
                  <!--                  <template slot-scope="scope">-->
                  <!--                    <el-image :src="scope.row.commPicList[0]" fit='cover' :preview-src-list="scope.row.commPicList"-->
                  <!--                              style="width: 50px;height: 50px"></el-image>-->
                  <!--                  </template>-->
                </el-table-column>
                <el-table-column prop="createTime" label="下单时间" width="120"></el-table-column>
                <el-table-column prop="commodityName" label="商品名称"></el-table-column>
                <el-table-column prop="num" label="数量" width="50"></el-table-column>
                <!--                描述-->
                <el-table-column prop="note" label="商品描述"></el-table-column>
                <el-table-column label="状态">
                  <div slot-scope="scope">
                    <div v-if="scope.row.orderStatus === 0">待处理</div>
                    <div v-else-if="scope.row.orderStatus === 1">发货中</div>
                    <div v-else-if="scope.row.orderStatus === 2">待确认</div>
                    <div v-else-if="scope.row.orderStatus === 3">申请取消</div>
                    <div v-else>已取消</div>
                  </div>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <div slot-scope="scope">
                    <div v-if="scope.row.orderStatus === 0">
                      <el-button type="danger" size="small" @click="changeStatus(scope.row, false)">取消订单</el-button>
                    </div>
                    <div v-else-if="scope.row.orderStatus === 1">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">取消订单</el-button>
                    </div>
                    <div v-if="scope.row.orderStatus === 2">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">确认收货</el-button>
                      <el-button type="danger" size="small" @click="changeStatus(scope.row, false)">取消</el-button>
                    </div>
                    <div v-else-if="scope.row.orderStatus === 3">
                      <el-tag>等待确认</el-tag>
                    </div>
                    <div v-else-if="scope.row.orderStatus === 4">
                      <el-tag type="success">订单已取消！</el-tag>
                    </div>
                  </div>
                </el-table-column>
              </el-table>
            </div>
            <!--            我的商品 个人商品发布列表 myCommodity-->
            <div class="my-commodity" v-show="menuTab[2].isActive">
              <el-table :data="myCommodity" stripe style="width: 100%">
                <!--                商品图片-->
                <el-table-column label="图片">
                  <!--                  <template slot-scope="scope">-->
                  <!--                    <el-image :src="scope.row.commPicList[0]" fit='cover' :preview-src-list="scope.row.commPicList"-->
                  <!--                              style="width: 50px;height: 50px"></el-image>-->
                  <!--                  </template>-->
                </el-table-column>
                <el-table-column prop="commodity.commName" label="商品名称"></el-table-column>
                <el-table-column prop="commodity.commDesc" label="商品描述"></el-table-column>
                <el-table-column prop="commodity.commSale" label="卖出" width="50"></el-table-column>
                <el-table-column prop="commodity.commStock" label="数量" width="50"></el-table-column>
                <el-table-column prop="commodity.auditStatus" label="审核状态"></el-table-column>
                <el-table-column label="商品操作">
                  <div slot-scope="scope">
                    <el-button type="danger" size="small" @click="deleteComm(scope.row.commodity.commNo)">下架商品
                    </el-button>
                  </div>
                </el-table-column>
              </el-table>
            </div>
            <div class="publish" v-show="menuTab[3].isActive">
              <div class="right-item" style="height: 195px; line-height:195px">
                <div class="item-label">图片</div>
                <div class="item-info">
                  <el-upload
                      class="upload-demo"
                      action=""
                      :show-file-list="true"
                      :list-type="picture"
                      limit="5"
                      :file-list="fileList"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">名称</div>
                <div class="item-info" style="width: 500px">
                  <el-input v-model="commodity.name" placeholder="请输入商品名称" maxlength="50" show-word-limit></el-input>
                </div>
              </div>
              <div class="right-item" style="padding-bottom: 7em">
                <div class="item-label">描述</div>
                <div class="item-info" style="width: 500px">
                  <el-input
                      type="textarea"
                      placeholder="请输入商品描述"
                      v-model="commodity.description"
                      :autosize="{ minRows:7, maxRows: 8}"
                      maxlength="150"
                      show-word-limit
                  >
                  </el-input>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">数量</div>
                <div class="item-info">
                  <el-input-number v-model="commodity.quantity" :min="1" :max="99" size="small"></el-input-number>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">单价</div>
                <div class="item-info" style="width:300px">
                  <el-input v-model="commodity.price" placeholder="请输入单件商品价格，单位：元"></el-input>
                </div>
              </div>
              <div class="right-item">
                <div class="item-label">标签</div>
                <el-radio-group v-model="commType" @change="select(commType)">
                  <el-radio-button label="衣物"></el-radio-button>
                  <el-radio-button label="数码"></el-radio-button>
                  <el-radio-button label="食品"></el-radio-button>
                  <el-radio-button label="图书"></el-radio-button>
                  <el-radio-button label="化妆品"></el-radio-button>
                  <el-radio-button label="文具"></el-radio-button>
                  <el-radio-button label="居家"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="right-item">
                <div class="item-label"></div>
                <div class="item-info">
                  <el-button type="danger" @click="publish()">发布</el-button>
                </div>
              </div>
            </div>
            <!--            卖家订单管理-->
            <div class="pending-order" v-show="menuTab[4].isActive">
              <el-table :data="pendingOrder" stripe style="width: 100%">
                <el-table-column prop="commNo" label="订单号" width="70"></el-table-column>
                <el-table-column prop="createTime" label="下单时间" width="160"></el-table-column>
                <el-table-column prop="commodityName" label="商品名称"></el-table-column>
                <el-table-column prop="num" label="商品数量"></el-table-column>
                <el-table-column prop="note" label="备注信息"></el-table-column>
                <el-table-column label="状态">
                  <div slot-scope="scope">
                    <div v-if="scope.row.orderStatus === 0">待处理</div>
                    <div v-else-if="scope.row.orderStatus === 1">发货中</div>
                    <div v-else-if="scope.row.orderStatus === 2">待确认</div>
                    <div v-else-if="scope.row.orderStatus === 3">申请取消</div>
                    <div v-else>已取消</div>
                  </div>
                </el-table-column>
                <el-table-column label="处理" width="180">
                  <div slot-scope="scope">
                    <div v-if="scope.row.status === 0">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">发货</el-button>
                      <el-button type="danger" size="small" @click="changeStatus(scope.row, false)">取消</el-button>
                    </div>
                    <div v-else-if="scope.row.status === 1">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">已完成</el-button>
                    </div>
                    <div v-if="scope.row.status === -2">
                      <el-button type="primary" size="small" @click="changeStatus(scope.row, true)">同意</el-button>
                      <el-button type="danger" size="small" @click="changeStatus(scope.row, false)">取消</el-button>
                    </div>
                    <div v-else-if="scope.row.status === 2">
                      <el-tag>等待确认</el-tag>
                    </div>
                    <div v-else-if="scope.row.status === 3">
                      <el-tag type="success">已完成！</el-tag>
                    </div>
                    <div v-else-if="scope.row.status === -1">
                      <el-tag type="danger">已取消！</el-tag>
                    </div>
                  </div>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </div>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      commType: '',
      fileList: [],
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      token: '',
      userBean: {
        userName: '',
        isBan: '',
        userRoot: '',
        userInfo: '',
        userSex: '',
        profileUrl: '',
        userEmail: ''
      },
      menuTab: [
        {
          id: 1,
          txt: '我的资料',
          isActive: true
        },
        {
          id: 2,
          txt: '购买历史',
          isActive: false
        },
        {
          id: 3,
          txt: '我的商品',
          isActive: false
        },
        {
          id: 4,
          txt: '发布商品',
          isActive: false
        },
        {
          id: 5,
          txt: '订单管理',
          isActive: false
        }
      ],
      historyOrder: [],
      myCommodity: [],
      pendingOrder: [],
      commodity: {
        name: '',
        description: '',
        quantity: 1,
        price: '',
        commTag: ''
      },
      imageUrl: '',
      imageFile: '',
      profilePhotoAction: '/apis/user/updateUserInfo',
      socket: null
    }
  },
  mounted() {
    this.userBean = this.$store.state.userBean
    this.token = this.$store.state.token
    console.log(this.token)
    if (this.token === null || this.token === '') {
      this.$notify({
        title: '未登入',
        message: '即将前往登入页',
        type: 'error'
      })
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$router.push({path: '/login'});
      }, 1500);
    }
    this.initData()
    // this.websocketLink()
  },
  methods: {
    //初始化方法
    initData() {
      // 获取购买历史(用户提交的订单列表接口)
      this.$axios.get('/apis/order/queryUserSubmitOrderList', {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.historyOrder = data.obj
        }
      }).catch(function (error) {
        console.log(error)
      })
      // 获取用户在售卖的商品
      this.$axios.get('/apis/commodity/queryUserComm', {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.myCommodity = data.obj
        }
      }).catch(function (error) {
        console.log(error)
      })
      // 获取用户已卖出的商品
      this.$axios.get('/apis/order/queryUserReceiveOrderList', {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.pendingOrder = data.obj
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // websocketLink () {
    //   this.socket = new WebSocket('ws://localhost:8082/websocket/' + this.$store.state.userBean.id)
    //   this.socket.onopen = () => {
    //     console.log('socket 已经打开！')
    //     this.socket.send('hello!')
    //   }
    //   this.socket.onmessage = function (msg) {
    //     console.log(msg.data)
    //   }
    //   this.socket.onclose = function () {
    //     console.log('Socket已关闭')
    //   }
    // },
    //更改订单状态
    changeStatus(item, isOk) {
      if (isOk) {
        this.$axios.put('/apis/pending-orders/' + item.id + '?status=' + (item.status + 1)).then(resp => {
          var data = resp.data
          if (data.code === 200) {
            item.status += 1
            this.$notify({
              title: '成功',
              message: '发货成功！请及时发货！',
              type: 'success'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        this.$axios.put('/apis/pending-orders/' + item.id + '?status=' + -1).then(resp => {
          var data = resp.data
          if (data.code === 200) {
            item.status = -1
            this.$notify({
              title: '取消',
              message: '已取消此订单！',
              type: 'waring'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    //下架商品commNo
    deleteComm() {
      this.$axios.get('/apis/commodity/deleteComm', {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.pendingOrder = data.obj
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 切换左侧菜单
    toggleMenuItem(data) {
      this.menuTab.forEach(item => {
        item.isActive = false
      })
      data.isActive = true
    },
    // element-ui 上传图片的方法 头像的！！！！
    handleProfilePhotoSuccess(res) {
      this.userBean.profileUrl = res.data
    },
    // 上传前 头像的！！！！
    beforeProfilePhotoUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传的头像图片只能是 JPG/PNG/JPEG 格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传的头像图片大小不能超过 10MB!')
        return false
      }
      // console.log(file)
      // 创建临时的路径来展示图片
      var windowURL = window.URL || window.webkitURL
      this.userBean.profileUrl = windowURL.createObjectURL(file)
      return true
    },

    // element-ui 上传图片的方法 商品的！！！！！
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.imageFile = file
    },
    // 上传前 商品的！！！！！
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传商品图片只能是 JPG/PNG/JPEG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传商品图片大小不能超过 10MB!')
        return false
      }
      // console.log(file)
      // 创建临时的路径来展示图片
      var windowURL = window.URL || window.webkitURL
      this.imageUrl = windowURL.createObjectURL(file)
      // 重新写一个表单上传的方法
      this.imageFile = new FormData()
      this.imageFile.append('file', file, file.name)
      return false
    },
    //商品标签转换
    select(commType) {
      console.log(commType)
      if (commType === '衣物') {
        this.commodity.commTag = 0
      } else if (commType === '数码') {
        this.commodity.commTag = 1
      } else if (commType === '食品') {
        this.commodity.commTag = 2
      } else if (commType === '图书') {
        this.commodity.commTag = 3
      } else if (commType === '化妆品') {
        this.commodity.commTag = 4
      } else if (commType === '文具') {
        this.commodity.commTag = 5
      } else {
        this.commodity.commTag = 6
      }
      console.log(this.commodity)
    },
    publish() {
      const config = {
        headers: this.headers,
      }
      this.$axios.post('/apis/commodity/releaseComm', this.$qs.stringify({
        commDesc: this.commodity.description,
        commName: this.commodity.name,
        commPrice: this.commodity.price,
        commStock: this.commodity.quantity,
        commTag: this.commodity.commTag
        //更改为一同上传
      }), config).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          var commodity = data.data
          this.$axios.post('/apis/commodities/' + commodity.id + '/images', this.$qs.stringify({}), config).then(resp => {
            var data = resp.data
            if (data.code === 1) {
              this.$notify({
                title: '成功',
                message: '创建商品成功，请等待审核',
                type: 'success'
              })
              commodity.url = data.data
              this.myCommodity.push(commodity)
              this.commodity = []
              this.menuTab[3].isActive = false
              this.menuTab[2].isActive = true
            } else {
              this.$notify({
                title: '警告',
                message: '创建商品成功，但是图片上传失败，请等待审核',
                type: 'waring'
              })
            }
          }).catch(function (error) {
            this.$notify.error({
              title: '错误',
              message: '发布失败'
            })
            console.log(error)
          })
        }
      }).catch(function (error) {
        this.$notify.error({
          title: '错误',
          message: '发布失败'
        })
        console.log(error)
      })
    },
    confirm(item) {
      this.$axios.put('/apis/pending-orders/' + item.id + '?status=3').then(resp => {
        if (resp.status === 200) {
          var res = resp.data
          if (res.code === 200) {
            console.log(res)
            item.status = res.data
            this.$notify({
              title: '成功',
              message: '确认收货成功！',
              type: 'success'
            })
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    cancelOrder(item) {
      this.$axios.put('/apis/pending-orders/' + item.id + '?status=-2').then(resp => {
        if (resp.status === 200) {
          var res = resp.data
          if (res.code === 200) {
            item.status = res.data
            this.$notify({
              title: '成功',
              message: '已申请取消！请等待',
              type: 'success'
            })
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    reset() {
      this.$axios.post('/apis/user/updateUserInfo', this.$qs.stringify({
        userInfo: this.userBean.userInfo,
        userName: this.userBean.userName,
        userSex: this.userBean.userSex
      }), {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }
      })
    }
  },
  computed: {
    totalPrice: function () {
      return function (f, digit) {
        var m = Math.pow(10, digit) // 设置需要乘以的倍数
        return parseInt(f * m, 10) / m // 先乘再除，解决精度问题
      }
    }
  }
}
</script>
<style lang="scss">
#user {
  .header {
    background: #e3e4e5;
    line-height: 30px;

    .header-wrap {
      margin: 0 auto;
      display: flex;
      align-items: center;
      font-size: 12px;

      a {
        color: black;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      a:hover {
        color: #ff0036;
      }

    }
  }

  .nav {
    background: #e2231a;
    height: 80px;

    .nav-wrap {
      width: 1210px;
      margin: 0 auto;
      display: flex;
      align-items: center;

      a {
        color: #fff;
        cursor: pointer;

        .icon-B {
          font-size: 50px;
        }
      }
    }
  }

  .content {
    background: #f5f5f5;

    .history-order {
      .history-item {
        margin-bottom: 20px;
        margin-right: 90px;
        border-bottom: #e4e3e3 solid 1px;

        .item-top {
          display: flex;

          p {
            margin: 0;
            font-size: 14px;
            color: #3c3c3c;
          }
        }

        .item-content {
          display: flex;
          margin-top: 10px;

          .img-wrap {
            img {
              height: 100px;
              width: 100px;
            }
          }

          .content-item {
            height: 100px;
            font-size: 14px;
            line-height: 100px;
            margin-left: 20px;
            color: #3c3c3c;

            span {
              display: inline-block;
              vertical-align: middle;
              line-height: 22px;
            }
          }

          .item-name {
            width: 400px;
          }

          .item-num {
            width: 50px;
            text-align: center;
          }

          .item-price {
            width: 50px;
            text-align: center;
            color: #3c3c3c;
            font-weight: bolder;
          }
        }

        .item-bottom {
          position: relative;
          height: 45px;

          .button-wrap {
            position: absolute;
            line-height: 40px;
            right: 20px;
          }
        }
      }
    }

    .container {
      display: flex;
      width: 1210px;
      margin: 80px auto;
      min-height: 1000px;
      background: #fff;
      border-radius: 4px;

      .ct-left {
        height: 92%;
        margin: 40px 70px;
        border-right: 1px solid #dddddd;

        .img-wrap {
          width: 120px;
          height: 120px;
          padding: 5px;
          border: 1px solid #EAEAEA;

          img {
            width: 100%;
            height: 100%;
          }

          .avatar-uploader {
            height: 100%;
          }

          .el-upload {
            width: 100%;
            height: 100%;
            line-height: 120px;
            position: relative;

            .img-bottom {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              text-align: center;
              line-height: 130px;
              background-color: rgba($color: #000000, $alpha: .2);
              font-size: 14px;
              color: #fff;
              display: none;
            }
          }

          .el-upload:hover .img-bottom {
            display: block;
          }
        }

        .menu-tab-item {
          height: 70px;
          width: 125px;
          text-align: right;
          line-height: 70px;
          font-size: 15px;
          cursor: pointer;
        }

        .isActive {
          color: #409efe;
        }

        .menu-tab-item:hover {
          color: #409efe;
        }

        .menu-tab-item:focus {
          color: #409efe;
          outline: none;
        }
      }

      .ct-right {
        height: 92%;
        margin-top: 40px;

        .right-item {
          display: flex;
          font-size: 15px;
          height: 50px;

          .item-label {
            width: 50px;
          }
        }

        .publish {
          .right-item {
            line-height: 50px;
            margin-bottom: 20px;
          }
        }

        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }

        .avatar {
          width: 178px;
          height: 178px;
          display: block;
        }
      }
    }
  }
}
</style>
