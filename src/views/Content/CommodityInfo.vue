<template>
  <div id="Commodity">
    <el-page-header @back="goBack()" content="商品详情">
    </el-page-header>
    <div class="in">
      <div class="information">
        <el-carousel indicator-position="outside" height="30rem" style="width: 30rem;padding: 15px">
          <el-carousel-item v-for="item in obj.commPicList" :key="item">
            <el-image :src=item class="banner-img" fit="cover"></el-image>
          </el-carousel-item>
        </el-carousel>
        <div class="data-content">
          <h2>{{ obj.commodity.commName }}</h2>
          <el-divider><i class="el-icon-tickets"></i></el-divider>
          <h3>￥{{ obj.commodity.commPrice }} RMB</h3>
          <h4>已售出：{{ obj.commodity.commSale }}</h4>
          <h4>库存：{{ obj.commodity.commStock }}</h4>
          <h4>类别：{{ obj.commodity.commTag }}</h4>
          <h4>卖家：{{ obj.commodity.userName }}</h4>
          <el-divider><i class="el-icon-shopping-cart-full"></i></el-divider>
          <h4>描述：{{ obj.commodity.commDesc }}</h4>
          <el-button type="primary" @click="changShow" style="margin-top: 12rem">购买商品</el-button>
        </div>
      </div>
      <el-dialog
          title="购买商品"
          :visible.sync="show"
          width="35%"
          center>
        <span>
          <el-form label-width="80px" :model="buyForm" :rules="rules">
            <el-form-item label="收件人" prop="consignee">
              <el-input v-model="buyForm.consignee" style="width: 100%;"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="buyForm.phone" style="width: 100%;"></el-input>
            </el-form-item>
            <el-form-item label="购买数量" style="text-align: left" prop="number">
              <el-input-number v-model="buyForm.num" size="small" :min="1"
                               :max="obj.commodity.commStock - obj.commodity.commSale"></el-input-number>
            </el-form-item>
            <el-form-item label="送货时间" style="text-align: left" prop="time">
                  <el-date-picker
                      v-model="buyForm.Time"
                      type="datetimerange"
                      :picker-options="buyForm.pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="收件地址" prop="address">
              <el-input v-model="buyForm.address" type="textarea" style="width: 100%;"
                        :autosize="{ minRows: 3, maxRows: 6}"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="show=false">取 消</el-button>
          <el-button type="primary" @click="submit">确认下单</el-button>
        </span>
      </el-dialog>
      <el-dialog
          title="购买商品"
          :visible.sync="show2"
          width="35%"
          center>
        <span>
          <el-form label-width="80px" :model="buyForm" :rules="rules">
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="show=false">取 消</el-button>
          <el-button type="primary" @click="submit">确认下单</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="user-comment">
      <div style="text-align: left;margin: 10px 0">
        <h2>留言板</h2>
      </div>
      <div class="comments-section">
        <div class="comment-post" v-for="item in commentList" :key="item.id">
          <div class="comment-img">
            <el-avatar shape="square" :src="item.profileUrl" alt="user"></el-avatar>
          </div>
          <div class="comment-details">
            <p>
              <span class="comment-author">{{item.userName}}</span>
              <span class="comment-time">{{item.createTime}}</span></p>
            <p class="comment-content">{{ item. content}}</p>
            <div class="comment-like-unlike">
              <span><i class="el-icon-caret-top" aria-hidden="true"></i></span>
              <span><i class="el-icon-caret-bottom" aria-hidden="true"></i></span>
              <span><i class="el-icon-warning" aria-hidden="true" @click="report(item.commentNo)"></i></span>
            </div>
          </div>
        </div>
        <div class="comment-add">
          <div class="field-comment">
            <textarea rows="4" cols="50" v-model="content"></textarea>
            <el-button type="primary" @click="comment" style="margin-top: 20px">发布你的留言</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Server} from "@/service/api";

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      const reg = '^[0-9]{11}$'
      if (value === '') {
        callback(new Error('请输入电话号码'))
      } else if (value.search(reg)) {
        callback(new Error('请输入正确手机格式'))
      } else {
        callback()
      }
    }
    return {
      commNo: '',
      token: '',
      obj: {},
      commentList: '',
      show: false,
      show2:false,
      //评论内容
      content: '',
      buyForm: {
        commNo: this.$route.query.commNo,
        num: 1,
        address: '',
        consignee: '',
        phone: '',
        // 送货时间
        Time: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      },
      rules: {
        consignee: [
          {required: true, message: '请输入收件人', trigger: 'blur'},
          {min: 1, max: 5, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请填写详细地址', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '选择送货时间段', trigger: 'this.buyForm.Time'}
        ],
        number: [
          {required: true, message: '请选择购买数量', trigger: 'this.buyForm.num'}
        ]
      }
    }
  },
  methods: {
    initDate() {
      Server.queryCommByNo({
        params: {
          commNo: this.$route.query.commNo,
        }
      }).then(resp => {
        console.log(resp)
        if (resp.code === 1) {
          this.obj = resp.obj
          this.obj.commodity.createTime = this.rTime(this.obj.commodity.createTime)
          this.obj.commodity.auditTime = this.rTime(this.obj.commodity.auditTime)
          this.obj.commodity.auditStatus = this.rAuditStatus(this.obj.commodity.auditStatus)
          this.obj.commodity.commTag = this.rCommTag(this.obj.commodity.commTag)
        }
      })
      this.queryCommCommentList()
    },
    changShow() {
      if (this.token === null || this.token === '') {
        this.$notify({
          title: '错误',
          message: '请登入后继续',
          type: 'error'
        })
        this.$router.push({path: '/login'})
      } else {
        this.show = !this.show;
      }
    },
    submit() {
      if (this.obj.commodity.commStock === 0) {
        this.$notify({
          title: '错误',
          message: '尚无库存',
          type: 'error'
        })
      } else {
        Server.submitOrder({
          address: this.buyForm.address,
          commNo: this.commNo,
          consignee: this.buyForm.consignee,
          deTimeFrom: this.rTime(this.buyForm.Time[0]),
          deTimeTo: this.rTime(this.buyForm.Time[1]),
          num: this.buyForm.num,
          phone: this.buyForm.phone
        }, this.token).then(resp => {
          if (resp.code === 1) {
            this.$notify({
              title: '成功',
              message: '下单成功，请在个人中心查看',
              type: 'success'
            })
            this.show = !this.show
          }
        }).catch(function (error) {
          this.$notify.error({
            title: '错误',
            message: '下单失败'
          })
          console.log(error)
        })
      }
    },
    rTime(date) {
      var date1 = new Date(date).toJSON();
      return new Date(+new Date(date1) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    rAuditStatus(data) {
      if (data === 0) {
        return "待审核"
      } else if (data === 1) {
        return "审核通过"
      } else {
        return "审核拒绝"
      }
    },
    rCommTag(data) {
      if (data === 0) {
        return "衣物"
      } else if (data === 1) {
        return "数码"
      } else if (data === 2) {
        return "食品"
      } else if (data === 3) {
        return "图书"
      } else if (data === 4) {
        return "化妆品"
      } else if (data === 5) {
        return "文具"
      } else {
        return "居家"
      }
    },
    goBack() {
      this.$router.go(-1)
      this.$store.state.DEL_COMM()
      console.log('go back');
    },
    comment() {
      Server.insertCommComment({
        commNo: this.$route.query.commNo,
        content: this.content
      }, this.token).then(resp => {
        if (resp.code === 1) {
          this.$notify({
            title: '成功',
            message: '留言评论成功',
            type: 'success'
          })
        }
        this.queryCommCommentList()
      }).catch(function (error) {
        this.$notify.error({
          title: '错误',
          message: '留言评论失败'
        })
        console.log(error)
      })
    },
    queryCommCommentList() {
      Server.queryCommCommentList({
        commNo: this.commNo,
        num: 10
      }).then(resp => {
        this.commentList = resp.obj
        for (let i = 0; i < this.commentList.length; i++) {
          this.commentList[i].createTime = this.rTime(this.commentList[i].createTime)
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    //举报评论
    report(commentNo){
      Server.reportCommComment({
        commentNo:commentNo
      }).then(resp => {
        if(resp.code===1){
          this.$notify({
            title: '成功',
            message: '举报成功',
            type: 'success'
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted() {
    this.token = this.$store.state.token
    this.commNo = this.$route.query.commNo
    this.$nextTick(function () {
      this.initDate()
    })
  }
}
</script>

<style lang="scss">
#Commodity {
  background-color: #f5f5f5;
  padding: 1rem;
  z-index: -1;

  .in {
    background-color: white;
    margin: 1rem auto;
    width: 60vw;
    border-radius: 5px;
    padding: 2rem;
    position: relative;
    box-shadow: 10px 5px 30px #99a9bf;

    .information {
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;

      .data-content {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        text-align: left;
        padding: 1em;
      }
    }
  }
}
</style>
<style>
.user-comment {
  width: 60vw;
  margin: 0 auto 100px;
}

.comments-section p {
  line-height: 15px;
  margin: 0 auto 5px;
}

.comments-section .comment-author {
  font-weight: 600;
  font-size: 17px;
  letter-spacing: 0.5px;
  color: #547ef8;
}

.comments-section .comment-time {
  font-size: 11px;
  margin-left: 10px;
  color: #a7a5a5;
  border-bottom: 1px solid #ddd;
}

.comments-section .comment-content {
  font-size: 16px;
  font-weight: 100;
  padding-bottom: 0;
  line-height: 25px;
  letter-spacing: 1px;
  color: #888888;
}

.comments-section .comment-post-reply .comment-content,
.comments-section .comment-post-reply .comment-author {
  color: #888888;
}

.comments-section textarea {
  width: 100%;
  height: 80px;
  border: 1px solid #ccccccad;
  border-radius: 4px;
  padding: 10px;
}

.comment-like-unlike span i {
  font-size: 18px;
  color: #547ef89e;
  cursor: pointer;
  margin-right: 10px;
  width: 30px;
  height: 25px;
  text-align: center;
  line-height: 25px;
}

.comment-like-unlike span i:hover {
  color: #547ef8;
  transition: 0.3s ease-in-out;
}

.comment-post, .comment-post-reply {
  display: flex;
  margin-bottom: 25px;
}

.comment-details {
  margin-left: 25px;
  text-align: left;
}

.comment-post-reply {
  margin-left: 85px;
  margin-bottom: 40px;
}

.comments-section {
  padding-top: 40px;
  border-top: 1px solid #cccccc8a;
}
</style>
