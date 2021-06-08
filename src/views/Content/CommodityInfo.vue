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
    </div>
    <div class="user-comment">
      <div class="comments-section">
        <div class="comment-post">
          <div class="comment-img"><img
              src="https://tse4-mm.cn.bing.net/th/id/OIP.d8f1sQ0J1EBYnaP8o7iTVwAAAA?w=167&h=180&c=7&o=5&pid=1.7"/></div>
          <div class="comment-details">
            <p><span class="comment-author">梅十三</span><span class="comment-time">2021.02.22 18:22</span></p>
            <p class="comment-content">这个商家的商品都不错，我买了他们家的商品好几次了。</p>
            <div class="comment-like-unlike">
              <span><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
              <span><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></span>
              <span><i class="fa fa-reply" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div class="comment-post">
          <div class="comment-img"><img
              src="data:image/jpeg;base64,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"/>
          </div>
          <div class="comment-details">
            <p><span class="comment-author">七七</span><span class="comment-time">2021.04.22 15:22</span></p>
            <p class="comment-content">收到货了，特地回来给个好评。</p>
            <div class="comment-like-unlike">
              <span><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
              <span><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></span>
              <span><i class="fa fa-reply" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div class="comment-add">
          <div class="field-comment">
            <textarea rows="4" cols="50"></textarea>
            <el-button type="primary" @click="comment">发布你的留言</el-button>
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
      show: false,
      //评论内容
      content:'',
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
          var data = resp.data
          if (data.code === 1) {
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
  text-align: left;
}

.comments-section img {
  margin-top: 0;
  width: 60px;
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
  padding-bottom: 0px;
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

.comment-details {
  margin-left: 25px;
}

.comments-section {
  padding-top: 40px;
  border-top: 1px solid #cccccc8a;
}

</style>
