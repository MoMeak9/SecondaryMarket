<template>
  <div class="sale-slide">
    <ul class="slide-container"
        :style="transformStyle">
      <li class="slide-item"
          v-for="(item, index) in slideItems"
          :key="index"
          style="border-top-color: #b3d4fc">
        <a @click="getCommodityInfo(item.commodity.commNo)" style="cursor:pointer;">
          <el-image :src="item.commPicList[0]" :alt="item.commodity.commName" fit="cover"></el-image>
          <h3 class="name ellipsis">{{ item.commodity.commName }}</h3>
          <div class="price">
            <span>￥{{ item.commodity.commPrice.toFixed(2) }}</span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slideIndex: 0,
      slideTimer: '',
      Xvalue: 0
    }
  },
  props: ['slideItems'],
  methods: {
    getCommodityInfo(commNo) {
      this.$router.push({
        path: '/CommodityInfo', query: {
          commNo: commNo
        }
      })
    },
    next() {
      const lastIndex = parseInt(this.slideItems.length / 4);
      if (this.slideIndex < lastIndex) {
        if (this.slideIndex === lastIndex - 1 && this.slideItems.length % 4 !== 0) {
          this.slideIndex += 1;
          this.Xvalue = -((this.slideIndex - 1) * 992 + (this.slideItems.length % 4) * 248);
        } else {
          this.slideIndex += 1;
          this.Xvalue = -(this.slideIndex * 992);
        }
      } else {
        this.slideIndex = 0;
        this.Xvalue = 0;
      }
    },
    prev() {
      const lastIndex = parseInt(this.slideItems.length / 4);
      if (this.slideIndex > 0) {
        this.slideIndex -= 1;
        this.Xvalue = -(this.slideIndex * 992);
      } else {
        this.slideIndex = lastIndex;
        this.Xvalue = -(lastIndex * 992);
      }
    },
    play() {
      clearInterval(this.slideTimer);
      this.slideTimer = setInterval(() => {
        this.next();
      }, 5000);
    }
  },
  computed: {
    transformStyle() {
      return {
        'transform': `translate3d(${this.Xvalue}px, 0, 0)`
      }
    }
  },
  mounted() {
    this.play();
  }
}
</script>

<style lang="scss">
.sale-slide {
  width: 978px;
  height: 340px;
  margin-left: 14px;
  overflow: hidden;
  position: relative;
  display: flex;

  .slide-container {
    height: 340px;
    display: flex;
    transition: all 1s ease-in-out;

    .slide-item {
      display: block;
      width: 234px;
      margin-right: 14px;
      border-top-width: 1px;
      border-top-style: solid;
      text-align: center;
      background: #fff;

      a {
        display: block;
        height: 300px;
        padding-top: 39px;
      }

      img {
        display: block;
        width: 200px;
        height: 200px;
        margin: 0 auto;
      }

      .name {
        display: block;
        margin: 5px 20px 3px;
        font-size: 14px;
        font-weight: 400;
        color: #212121;
      }

      .desc {
        display: block;
        height: 18px;
        margin: 0 20px 12px;
        font-size: 12px;
        color: #b0b0b0;
      }

      .price {
        color: #409EFF;
        font-size: 18px;
        margin: 5px auto;

        del {
          color: #b0b0b0;
          margin-left: 4px;
        }
      }
    }
  }
}

.ellipsis {
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
}
</style>
