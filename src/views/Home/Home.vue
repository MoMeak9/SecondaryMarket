<template>
  <div>
    <Nav></Nav>
    <div id="header">
      <div class="search">
        <div class="input-wrap">
          <el-autocomplete v-model="this.searchText" placeholder="搜索 校内二手市场 商品/用户" class="search-input"
                           :fetch-suggestions="querySearchAsync" @select="handSelect(this.searchText)"
                           style="width: 16rem;"></el-autocomplete>
          <el-button icon="el-icon-search" @click="searchComm(this.searchText)">搜索</el-button>
        </div>
      </div>
    </div>
    <div id="content" style="overflow:auto">
      <!--      轮播图-->
      <div class="banner-slider">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <el-image :src=item.commPicList[0] fit="fit" @click="getCommodityInfo(item.commodity.commNo)"
                      class="banner-img"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--      热表-->
      <div class="hot-list">
        <div class="hot-wrap" v-for="item in hotList" :key="item.id" @click="getCommodityInfo(item.commodity.commNo)">
          <div class="hot-item-tag"></div>
          <el-image el-image :src="item.commPicList[0]" fit="fit" class="hot-item-img"></el-image>
          <div class="hot-item-title">{{ item.commodity.commName }}</div>
          <div class="hot-item-price">￥{{ item.commodity.commPrice }}</div>
        </div>
      </div>
      <!--      商品列表-->
      <!--      <div class="common-list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">-->
      <!--        <div class="common-wrap" v-for="item in commonList" :key="item.id">-->
      <!--          <div class="common-item">-->
      <!--            <el-image :src="item.commPicList[0]" fit="fit" class="common-item-img"></el-image>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <p v-if="loading">加载中...</p>-->
      <!--        <p v-if="noMore">没有更多了</p>-->
      <!--      </div>-->
    </div>
  </div>
</template>
<script>
import Nav from '../../components/Nav'

export default {
  components: {
    Nav
  },
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
    this.initData()
  },
  methods: {
    initData() {
      this.userBean = this.$store.state.userBean
      //轮播图
      this.$axios.get('/apis/commodity/bannerCommList', {
        params: {
          num: 4,
        }
      }).then((resp) => {
        var data = resp.data
        this.bannerList = data.obj
      }).catch(function (error) {
        console.log(error)
      })
      //初始商品列表
      this.$axios.get('/apis/commodity/initialCommList', {
        params: {
          num: 10,
        }
      }).then(resp => {
        var data = resp.data
        this.hotList = data.obj
        // this.commonList = data.obj
      }).catch(function (error) {
        console.log(error)
      })
    },
    getCommodityInfo(commNo) {
      this.$store.commit('GET_COMM', commNo)
      // 跳转至商品页面
      this.$router.push({path: '/CommodityInfo'})
    },
    querySearchAsync(queryString, cb) {
      this.$axios.get('/apis/commodity/preSearchComm', {params: {keyName: queryString, num: 6}}).then(resp => {
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
      this.searchComm()
    },
    // 普通商品的加载
    load() {
      if (this.commonList.length !== 0) {
        this.loading = true
        setTimeout(() => {
          this.$axios.get('/apis/commodity/initialCommList', {
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
    searchComm(text){
      this.$store.commit('GET_SEARCH',text)
      this.$router.push({path: '/search'})
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  }
}
</script>
<style lang="scss">

#header {
  height: 10em;
  display: flex;
  justify-content: center;
  align-items: center;

  .input-wrap {
    display: flex;
    border: 2px solid #ff0036;

    .el-input__inner {
      width: 100%;
      border: none;
      border-radius: 0;
    }

    .el-input__inner::placeholder {
      color: rgb(250, 68, 108);
    }

    .el-button {
      width: 8vw;
      color: #fff;
      font-size: 1rem;
      border: none;
      border-radius: 0;
      background-color: #FF0036;
    }
  }
}

#content {
  margin-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
  overflow: hidden;

  .banner-slider {
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
        color: #FF0036;
        font-size: 18px;
        margin: 5px auto;
      }
    }

    .hot-wrap:hover {
      border: 1px solid #FF0036;
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
