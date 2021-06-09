<template>
  <div id="search">
    <el-menu default-active="/search" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/search">搜索</el-menu-item>
      <el-menu-item index="/user">个人中心</el-menu-item>
    </el-menu>
    <div class="content">
      <div id="header">
        <div class="input-wrap">
          <el-autocomplete v-model="searchText" placeholder="搜索 转小二 商品" class="search-input"
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
                  <div class="sale">销量 {{ item.commodity.commSale }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination
            @current-change="changeSearchComm"
            background
            :current-page="currentPage"
            :pager-count="11"
            layout="prev, pager, next"
            :page-count="pages" v-if="this.searchText">
        </el-pagination>
        <el-pagination
            @current-change="changeQueryCommByTag"
            background
            :current-page="currentPage"
            :pager-count="11"
            layout="prev, pager, next"
            :page-count="pages" v-else>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {Server} from "@/service/api";

export default {
  name: "Search",
  data() {
    return {
      searchText: '',
      commList: [],
      commTag: '',
      //  分页
      currentPage: 1,
      pages: 1,
      size: 36,
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.initData()
    })
  },
  methods: {
    initData() {
      this.searchText = this.$route.query.keyName
      this.commTag = this.$route.query.commTag
      console.log(this.searchText)
      // 获取搜索列表
      if(this.searchText === undefined && this.commTag === undefined){
        //初始商品列表
        Server.initialCommList({
          params: {
            num: 6,
          }
        }).then(resp => {
          this.commList = resp.obj
        }).catch(function (error) {
          console.log(error)
        })
      }else if (this.searchText === undefined || this.searchText===null) {
        this.queryCommByTag()
      } else {
        this.searchComm()
      }
    },
    getCommodityInfo(commNo) {
      // 跳转至商品页面
      this.$router.push({
        path: '/CommodityInfo', query: {
          commNo: commNo
        }
      })
    },
    searchComm() {
      Server.searchComm({
        params: {
          current: 1,
          keyName: this.searchText,
          size: this.size
        }
      }).then(resp => {
        if (resp.code === 1) {
          this.commList = resp.obj.obj
          this.pages = resp.obj.pages
        }
        this.currentPage = 1
      }).catch(function (error) {
        console.log(error)
      })
    },
    changeSearchComm(val) {
      Server.searchComm({
        params: {
          current: val,
          keyName: this.searchText,
          size: this.size
        }
      }).then(resp => {
        if (resp.code === 1) {
          this.commList = resp.obj.obj
          this.pages = resp.obj.pages
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    queryCommByTag() {
      Server.queryCommByTag({
        params: {
          commTag: this.commTag,
          current: 1,
          size: this.size
        }
      }).then(resp => {
        if (resp.code === 1) {
          this.commList = resp.obj.obj
          this.pages = resp.obj.pages
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    changeQueryCommByTag(val) {
      Server.queryCommByTag({
        params: {
          commTag: this.commTag,
          current: val,
          size: this.size
        }
      }).then(resp => {
        if (resp.code === 1) {
          this.commList = resp.obj.obj
          this.pages = resp.obj.pages
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
  },
  destroyed() {
  }
}
</script>

<style lang="scss">
#search {
  .content {
    width: 70%;
    margin: 0 auto;

    .el-pagination {
      margin-top: 10px;
    }

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

    .sale {
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
