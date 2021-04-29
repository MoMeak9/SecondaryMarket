<template>
  <div id="search">
    <el-menu default-active="/search" class="el-menu-demo" mode="horizontal" router="true" >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/search">搜索</el-menu-item>

      <el-menu-item index="/user">个人中心</el-menu-item>
    </el-menu>
    <div class="content">
      <div class="header">
        <el-input v-model="searchText" placeholder="搜索 校内二手市场 商品/用户" class="search-input"
                  :fetch-suggestions="querySearchAsync" @select="handSelect(searchText)"
                  style="width: 24rem;"></el-input>
        <el-button icon="el-icon-search" @click="searchComm">搜索</el-button>
      </div>
      <div class="commInfo">

        <el-table :data="commList" stripe style="width: 100%">
          <!--                商品图片-->
          <el-table-column label="图片">
            <template slot-scope="scope">
              <el-image :src="scope.row.commPicList[0]" fit='cover' :preview-src-list="scope.row.commPicList"
                        style="width: 50px;height: 50px"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="commodity.commName" label="商品名称"></el-table-column>
          <el-table-column prop="commodity.commDesc" label="商品描述"></el-table-column>
          <el-table-column prop="commodity.commSale" label="销量" width="50"></el-table-column>
          <el-table-column label="商品操作">
            <div slot-scope="scope">
              <el-button type="danger" size="small" @click="getCommodityInfo(scope.row.commodity.commNo)">查看商品
              </el-button>
            </div>
          </el-table-column>
        </el-table>

        <el-row>
          <el-col :span="8" v-for="item in commList" :key="item" :offset="index > 0 ? 2 : 0">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.commPicList[0]" class="image">
              <div style="padding: 14px;">
                <span>{{item.commodity.commName}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="text" class="button">操作按钮</el-button>
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
      userRoot:''
    }
  },
  mounted() {
    this.userRoot = this.$store.state.userBean.userRoot;
    this.initData()
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
              value: element,
            })
          })
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 3000 * Math.random())
        }
      })
    },
    handSelect() {

    }
  },
  beforeDestroy() {
    this.$store.commit("DEL_SEARCH")
    this.$store.commit("DEL_COMMTAG")
  }
}
</script>

<style lang="scss">
#search {
  .content {
    width: 70%;
    margin: 0 auto;
  }

  .commInfo {
    margin-top: 5rem;
  }
}

</style>
