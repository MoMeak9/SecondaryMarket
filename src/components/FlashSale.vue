<template>
  <div class="flash-sale">
    <div class="box-header">
      <h2 class="box-title"></h2>
      <div class="slide-control">
        <span class="slide-left slide-button" @click="prev">
          <i class="el-icon-caret-left"></i>
        </span>
        <span class="divider"></span>
        <span class="slide-right slide-button" @click="next">
          <i class="el-icon-caret-right"></i>
        </span>
      </div>
    </div>
    <div class="box-sale">
      <slide :slideItems="slideItems" ref="slide"></slide>
    </div>
  </div>
</template>

<script>
import Slide from '../components/Slide'
import {Server} from "@/service/api";

export default {
  data() {
    return {
      round: '24:00',
      hour: '',
      minute: '',
      second: '',
      countDownTimer: '',
      slideItems: [
        {
          value: '高品质多功能头戴耳机',
          desc: '我的私人KTV',
          newPrice: '199',
          oldPrice: '249',
          src: 'https://i8.mifile.cn/a1/pms_1551343984.14546114.jpg',
          url: 'https://www.mi.com/seckill/'
        },
        {
          value: '米家驱蚊器基础版 3个装 白色',
          desc: '3个装 长效驱蚊',
          newPrice: '99',
          oldPrice: '129',
          src: 'https://i8.mifile.cn/a1/pms_1557804685.13891176.jpg',
          url: 'https://www.mi.com/seckill/'
        },
      ]
    }
  },
  methods: {
    countDown() {
      clearInterval(this.countDownTimer);
      this.countDownTimer = setInterval(() => {
        this.timeComput();
      }, 1000);
    },
    timeComput() {
      let hour = 24 - new Date().getHours() - 1;
      let minute = 60 - new Date().getMinutes() - 1;
      let second = 60 - new Date().getSeconds() - 1;

      this.hour = this.addZero(hour);
      this.minute = this.addZero(minute);
      this.second = this.addZero(second);
    },
    addZero(m) {
      return m < 10 ? '0' + m : m
    },
    prev() {
      this.$refs.slide.prev();
    },
    next() {
      this.$refs.slide.next();
    },
    initData() {
      Server.recommendCommList({
        params: {
          num: 16,
        }
      }).then(resp => {
        this.slideItems = resp.obj
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  components: {
    'Slide': Slide
  },
  mounted() {
    this.countDown();
    this.$nextTick(function () {
      this.initData();
    })
  }
}
</script>

<style lang="scss">
.flash-sale {
  position: relative;
  width: 60vw;
  height: auto;
  padding-top: 4px;
  margin: 0 auto;
}

.box-header {
  text-align: start;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .box-title {
    display: inline-block;
    font-size: 22px;
    font-weight: 200;
    line-height: 58px;
    color: #333;
  }
}

.box-sale {
  display: flex;
  justify-content: center;

  .sale-count-down {
    display: inline-block;
    width: 234px;
    height: 340px;
    padding-top: 39px;
    border-top: 1px solid #e53935;
    background: #f1eded;
    text-align: center;

    .sale-round {
      font-size: 21px;
      color: #ef3a3b;
      padding-top: 15px;
    }

    .time-left {
      color: rgba(0, 0, 0, .54);
      font-size: 15px
    }

    img {
      margin: 25px auto;
    }

    .count-down {
      width: 168px;
      margin: 28px auto 0;
      display: flex;

      span {
        display: block;
        width: 46px;
        height: 46px;
        background: #605751;
        color: #fff;
        font-size: 24px;
        font-weight: 600;
        line-height: 46px;
        text-align: center;
      }

      i {
        display: block;
        width: 15px;
        height: 46px;
        line-height: 46px;
        color: #605751;
        font-size: 28px;
        font-style: normal;
        text-align: center;
      }
    }
  }
}

.slide-control {
  display: flex;
  border: 1px solid #e0e0e0;

  .slide-button {
    padding: 0 4px;
    font-size: 20px;
    font-weight: 800;
    line-height: 20px;
    color: #b0b0b0;
    text-align: center;
    transition: color .5s;
    cursor: pointer;

    &:hover {
      color: #ff6700;
    }

    i {
      width: 26px;
      height: 18px;
    }
  }

  .divider {
    width: 1px;
    height: 21px;
    background: #e0e0e0;
  }
}
</style>
