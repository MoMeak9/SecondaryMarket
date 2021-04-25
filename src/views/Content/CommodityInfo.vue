<template>
  <div id="Commodity">
    <el-page-header @back="goBack()" content="商品详情">
    </el-page-header>
    <div class="in">
      <div class="information">
        <el-carousel indicator-position="outside" height="30rem" style="width: 30rem;padding: 15px">
          <el-carousel-item v-for="item in obj.commPicList" :key="item">
            <el-image :src=item fit="cover" class="banner-img"></el-image>
          </el-carousel-item>
        </el-carousel>
        <div class="data-content">
          <h2>{{ obj.commodity.commName }}</h2>
          <el-divider><i class="el-icon-tickets"></i></el-divider>
          <h3>￥{{ obj.commodity.commPrice }} RMB</h3>
          <h4>库存：{{ obj.commodity.commStock - obj.commodity.commSale }}</h4>
          <h4>类别：{{ obj.commodity.commTag }}</h4>
          <h4>卖家：{{ obj.commodity.createUser }}</h4>
          <el-divider><i class="el-icon-shopping-cart-full"></i></el-divider>
          <h4>描述：{{ obj.commodity.commDesc }}</h4>
          <el-button type="danger" @click="changShow" style="margin-top: 12rem">购买商品</el-button>
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
            <el-form-item label="购买数量" style="text-align: left">
              <el-input-number v-model="buyForm.num" size="small" :min="1"
                               :max="obj.commodity.commStock - obj.commodity.commSale"></el-input-number>
            </el-form-item>
            <el-form-item label="收件地址" prop="address">
              <el-input v-model="buyForm.address" type="textarea" style="width: 100%;"
                        :autosize="{ minRows: 3, maxRows: 6}"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="show=false">取 消</el-button>
    <el-button type="danger" @click="submit">确认下单</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
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
      buyForm: {
        commNo: this.commNo,
        num: 1,
        address: '',
        consignee: '',
        phone: '',
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
        ]
      }
    }
  },
  methods: {
    initDate() {
      this.$axios.get('/shop/commodity/queryCommByNo', {
        params: {
          commNo: this.commNo,
        }
      }).then(resp => {
        var data = resp.data
        console.log(data)
        if (data.code === 1) {
          this.obj = data.obj
          console.log(this.obj)
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
      this.$axios.post('/shop/order/submitOrder', this.$qs.stringify({
        address: this.buyForm.address,
        commNo: this.commNo,
        consignee: this.buyForm.consignee,
        num: this.buyForm.num,
        phone: this.buyForm.phone
      }), {
        headers: {
          Authorization: this.token
        }
      }).then(resp => {
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
  },
  mounted() {
    this.token = this.$store.state.token
    this.commNo = this.$store.state.commNo
    this.$nextTick(function () {
      this.initDate()
    })
  }
}
</script>

<style lang="scss">
#Commodity {
  background-color: rgba(153, 169, 191, 0.19);
  width: 100vw;
  height: 100vh;
  z-index: -1;
  .in {
    background-color: white;
    margin: 1rem auto;
    width: 60%;
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
