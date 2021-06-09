<template>
  <div>
    <el-menu default-active="/" class="el-menu-demo" mode="horizontal" router style="border: none">
      <el-menu-item index="/" style="border:none !important">首页</el-menu-item>
      <el-menu-item index="/search">搜索</el-menu-item>
      <el-menu-item index="/user" v-if="this.userBean">个人中心</el-menu-item>
      <el-menu-item index="/login" v-if="!this.userBean">用户登入</el-menu-item>
    </el-menu>
    <div id="header">
      <div class="input-wrap">
        <el-autocomplete v-model="searchText" placeholder="搜索 转小二 商品" class="search-input"
                         :fetch-suggestions="querySearchAsync" @select="handSelect"
                         style="width: 20rem;" :trigger-on-focus="false"></el-autocomplete>
        <el-button icon="el-icon-search" @click="searchComm(searchText)">搜索</el-button>
      </div>
    </div>
    <div id="content" style="overflow:auto">
      <!--      轮播图-->
      <div class="banner-slider">
        <el-carousel indicator-position="outside" height="27vw" style="width: 48vw;margin: 0 auto">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <el-image :src=item.picUrl fit="cover" @click="getCommodityInfo(item.commodity.commNo)"
                      class="banner-img"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--      分类栏-->
      <div class="commTag">
        <el-tooltip content="衣物" placement="bottom" effect="light">
          <el-button><i class="iconfont" @click="getCommTag(0)">&#xe621;</i></el-button>
        </el-tooltip>
        <el-tooltip content="数码" placement="bottom" effect="light">
          <el-button><i class="iconfont" @click="getCommTag(1)">&#xe61f;</i></el-button>
        </el-tooltip>
        <el-tooltip content="食品" placement="bottom" effect="light">
          <el-button><i class="iconfont" @click="getCommTag(2)">&#xe622;</i></el-button>
        </el-tooltip>
        <el-tooltip content="图书" placement="bottom" effect="light">
          <el-button><i class="iconfont" @click="getCommTag(3)">&#xe648;</i></el-button>
        </el-tooltip>
        <el-tooltip content="化妆品" placement="bottom" effect="light">
          <el-button><i class="iconfont" @click="getCommTag(4)">&#xe625;</i></el-button>
        </el-tooltip>
        <el-tooltip content="文具" placement="bottom" effect="light">
          <el-button><i class="iconfont" @click="getCommTag(5)">&#xe624;</i></el-button>
        </el-tooltip>
        <el-tooltip content="居家" placement="bottom" effect="light">
          <el-button><i class="iconfont" @click="getCommTag(6)">&#xe620;</i></el-button>
        </el-tooltip>
      </div>
      <!--      热表-->
      <div class="hot-list">
        <div class="hot-wrap" v-for="item in hotList" :key="item.id" @click="getCommodityInfo(item.commodity.commNo)">
          <div class="hot-item-tag"></div>
          <el-image el-image :src="item.commPicList[0]" fit="cover" class="hot-item-img"></el-image>
          <div class="hot-item-title">{{ item.commodity.commName }}</div>
          <div class="hot-item-price">￥{{ item.commodity.commPrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {Server} from "@/service/api";

export default {
  components: {},
  data() {
    return {
      bannerList: [],
      hotList: [],
      commonList: [],
      searchText: '',
      timeout: null,
      loading: false,
      noMore: false,
      userBean: {
        userName: '',
        userRoot: 0,
      },
      //  商品类型选择
      options: [{
        value: 0,
        label: '衣物'
      }, {
        value: 1,
        label: '数码'
      }, {
        value: 2,
        label: '食品'
      }, {
        value: 3,
        label: '图书'
      }, {
        value: 4,
        label: '化妆品'
      }, {
        value: 5,
        label: '文具'
      }, {
        value: 6,
        label: '居家'
      }],
    }
  },
  mounted() {
    this.userBean = this.$store.state.userBean
    this.$nextTick(function () {
      //轮播图
      Server.bannerList({
        params: {
          num: 4,
        }
      }).then(resp => {
        this.bannerList = resp.obj
      }).catch(function (error) {
        console.log(error)
      })
      //初始商品列表
      Server.initialCommList({
        params: {
          num: 12,
        }
      }).then(resp => {
        this.hotList = resp.obj
      }).catch(function (error) {
        console.log(error)
      })
    })
  },
  methods: {
    getCommodityInfo(commNo) {
      this.$router.push({
        path: '/CommodityInfo', query: {
          commNo: commNo
        }
      })
    },
    querySearchAsync(queryString, cb) {
      Server.preSearchComm({
        params: {keyName: queryString, num: 6}
      }).then(resp => {
        var respData = resp
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
    },
    // 普通商品的加载
    load() {
      if (this.commonList.length !== 0) {
        this.loading = true
        setTimeout(() => {
          Server.initialCommList({
            params: {
              num: 5
            }
          }).then(resp => {
            if (resp.status === 200) {
              var data = resp.data
              if (data.code === 200) {
                data.data.forEach(item => {
                  this.commonList.push(item)
                })
              } else {
                this.noMore = true
              }
            } else {
              this.noMore = true
            }
            this.loading = false
          }).catch(function (error) {
            console.log(error)
          })
        }, 2000)
      }
    },
    //  搜索商品
    searchComm(text) {
      this.$router.push({path: '/search',query:{
          keyName:text
        }})
    },
    // 前往分区
    getCommTag(commTag) {
      this.$router.push({path: '/search',query:{
          commTag:commTag
        }})
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
#header {
  display: flex;
  justify-content: center;
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

#content {
  margin-top: 30px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
  overflow: hidden;

  .banner-slider {
    margin-top: 30px;
    margin-left: 22vw;
    margin-right: 22vw;
  }

  .el-carousel__container {
    height: 460px;
    cursor: pointer;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .hot-list {
    display: flex;
    flex-wrap: wrap;
    float: left;
    margin: 50px 22vw 80px;

    .hot-wrap {
      background-color: #fff;
      width: 234px;
      height: 300px;
      margin-left: 22px;
      margin-top: 13px;
      text-align: center;
      border: 1px solid #fff;
      cursor: pointer;

      .hot-item-tag {
        height: 20px;
        visibility: hidden;
      }

      .hot-item-img {
        width: 185px;
        height: 185px;
      }

      .hot-item-title {
        margin: 8px auto;
        width: 135px;
        height: 40px;
        color: #333;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
      }

      .hot-item-price {
        color: #409EFF;
        font-size: 18px;
        margin: 5px auto;
      }
    }

    .hot-wrap:hover {
      border: 1px solid #409EFF;
    }
  }

  .common-list {
    clear: both;
    margin-left: 22vw;
    margin-right: 22vw;

    .common-wrap {
      margin-left: 22px;
    }
  }
}
</style>
