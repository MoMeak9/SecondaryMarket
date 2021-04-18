<template>
  <div id="check">
    <el-page-header @back="goBack()" content="商品详情">
    </el-page-header>
    <div class="information">
      <el-carousel indicator-position="outside" height="30rem">
        <el-carousel-item v-for="item in obj.commPicList" :key="item">
          <el-image :src=item fit="scale-down" class="banner-img"></el-image>
        </el-carousel-item>
      </el-carousel>
      <div class="data-content">
        <div class="text-data">
          商品编号：{{ obj.commodity.commNo }}
        </div>
        <div class="text-data">
          商品名称：{{ obj.commodity.commNo }}
        </div>
        <div class="text-data">
          商品描述：{{ obj.commodity.commNo }}
        </div>
        <div class="text-data">
          创建时间：{{ obj.commodity.createTime }}
        </div>
        <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
        <div class="text-data">
          商品类型：{{ obj.commodity.commTag }}
        </div>
        <div class="text-data">
          商品价格：{{ obj.commodity.commPrice }}
        </div>
        <div class="text-data">
          商品销售：{{ obj.commodity.commSale }}
        </div>
        <div class="text-data">
          商品存量：{{ obj.commodity.commStock - obj.commodity.commSale }}
        </div>
        <div class="text-data">
          商品总量：{{ obj.commodity.commStock }}
        </div>
        <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
        <div class="text-data">
          审核状态：{{ obj.commodity.auditStatus }}
        </div>
        <div class="text-data">
          审核人：{{ obj.commodity.auditor }}
        </div>
        <div class="text-data">
          审核时间：{{ obj.commodity.auditTime }}
        </div>
        <div class="text-data">
          退回反馈：{{ obj.commodity.auditMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckComm",
  data() {
    return {
      commNo: '',
      token: '',
      obj: {},
    }
  },
  methods: {
    initDate() {
      this.$axios.get('/apis/commodity/queryCommByNo', {
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
          this.obj.commodity.auditStatus = this.rAuditStatus(this.obj.commodity.auditStatus)
        }
      })
    },
    rTime: function (date) {
      var date1 = new Date(date).toJSON();
      return new Date(+new Date(date1) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    rAuditStatus: function (data) {
      if (data === 0) {
        return "待审核"
      } else if (data === 1) {
        return "审核通过"
      } else {
        return "审核拒绝"
      }

    },
    goBack() {
      this.$router.push({path: '/adminHome'})
      console.log('go back');
    },
  },
  mounted() {
    this.token = this.$store.state.token
    this.commNo = this.$store.state.commNo
    console.log(this.token + "\n" + this.commNo)
    this.initDate()
  }
}
</script>

<style lang="scss">
#check {
  .information {
    width: 45rem;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 10px;
    background: white;
    box-shadow: 16px 16px 32px #408bb6,
    -16px -16px 32px #6ae7ff;

    .data-content {
      display: flex;
      flex-direction: column;
      flex: 1 1 60%;

      .text-data {
        text-align: left;
        margin: 10px;
      }
    }
  }
}
</style>
