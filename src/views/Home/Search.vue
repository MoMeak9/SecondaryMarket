<template>
  <div id="search">
    <el-menu default-active="/search" class="el-menu-demo" mode="horizontal" router="true">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/search">搜索</el-menu-item>
      <el-menu-item index="/user">个人中心</el-menu-item>
    </el-menu>
    <div class="content">
      <div id="header">
        <div class="input-wrap">
          <el-autocomplete v-model="searchText" placeholder="搜索 校内二手市场 商品/用户" class="search-input"
                           :fetch-suggestions="querySearchAsync" @select="handSelect"
                           style="width: 20rem;" :trigger-on-focus="false"></el-autocomplete>
          <el-button icon="el-icon-search" @click="searchComm(searchText)">搜索</el-button>
        </div>
      </div>
      <div class="commInfo">
        <el-row :gutter="25" type="flex">
          <el-col :span="4" v-for="item in commList" :key="item">
            <el-card :body-style="{padding:0}" shadow="hover">
              <el-image :src="item.commPicList[0]" fit="cover" style="height: 200px;width: 200px;cursor: pointer"
                        @click="getCommodityInfo(item.commodity.commNo)">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
              <div style="padding: 14px;">
                <span>{{ item.commodity.commName }}</span>
                <div class="bottom clearfix">
                  <div class="price">￥{{ item.commodity.commPrice }}</div>
                  <div class="button">销量 {{ item.commodity.commSale }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      searchText: '',
      commList: [],
      commTag: '',
      userRoot: ''
    }
  },
  mounted() {
    this.userRoot = this.$store.state.userBean.userRoot;
    this.$nextTick(function () {
      this.initData()
    })
  },
  methods: {
    initData() {
      this.searchText = this.$store.state.searchText
      this.commTag = this.$store.state.commTag
      // 获取搜索列表
      if (this.searchText !== '' && this.searchText !== null) {
        this.$axios.get('/shop/commodity/searchComm', {
          params: {
            keyName: this.searchText,
          }
        }).then(resp => {
          var data = resp.data
          if (data.code === 1) {
            this.commList = data.obj
          }
        }).catch(function (error) {
          console.log(error)
        })
      } else if (this.commTag !== '' && this.commTag !== null) {
        this.$axios.get('/shop/commodity/queryCommByTag', {
          params: {
            commTag: this.commTag,
          }
        }).then(resp => {
          var data = resp.data
          if (data.code === 1) {
            this.commList = data.obj
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    getCommodityInfo(commNo) {
      this.$store.commit('GET_COMM', commNo)
      // 跳转至商品页面
      this.$router.push({path: '/CommodityInfo'})
    },
    searchComm() {
      this.$axios.get('/shop/commodity/searchComm', {
        params: {
          keyName: this.searchText,
        }
      }).then(resp => {
        var data = resp.data
        if (data.code === 1) {
          this.commList = data.obj
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    querySearchAsync(queryString, cb) {
      this.$axios.get('/shop/commodity/preSearchComm', {params: {keyName: queryString, num: 6}}).then(resp => {
        var respData = resp.data
        if (respData.code === 1) {
          var data = respData.obj
          var results = []
          data.forEach(element => {
            results.push({
              value: element.commName,
              content: element.commNo
            })
          })
          cb(results)
        }
      })
    },
    handSelect(item) {
      this.getCommodityInfo(item.content)
    }
  }
}
</script>

<style lang="scss">
#search {
  .content {
    width: 70%;
    margin: 0 auto;

    #header {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
      align-items: center;

      .input-wrap {
        border: 2px solid #409EFF;

        .el-input__inner {
          width: 100%;
          border: none;
          border-radius: 0;
        }

        .el-input__inner::placeholder {
          color: #409EFF;
        }

        .el-button {
          width: 8rem;
          color: #fff;
          font-size: 1rem;
          border: none;
          border-radius: 0;
          background-color: #409EFF;
        }
      }
    }
  }

  .commInfo {
    margin-top: 5rem;
    //  卡片布局
    .price {
      float: left;
      font-size: 16px;
      color: #999;
    }

    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }

    .button {
      font-size: 14px;
      padding: 0;
      float: right;
    }

    .image {
      width: 100%;
      display: block;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }
  }
}

</style>
