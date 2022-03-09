<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="desc">提示：大多数情况下检查更新升级App可以解决问题</div>
        <div class="desc">
          请最新版App私聊 cijianzy，或者添加下面微信进群反馈，有红包哦~
        </div>
        <div class="erweima">
          <img
            @click="showImg"
            src="https://i.chao.fun/biz/10c40905c46e8c9c65d8d95b9fb25bdf.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      showCover: false,
      version: 'new',
    }
  },
  created() {},
  mounted() {},
  methods: {
    showImg() {
      window.flutter_inappwebview.callHandler('viewImage', {
        data: ['https://i.chao.fun/biz/10c40905c46e8c9c65d8d95b9fb25bdf.jpg'],
        index: 0,
      })
    },
    toAdvice() {
      try {
        window.flutter_inappwebview.callHandler('toAdvice', {})
      } catch (e) {
        this.$toast('请更新版本后尝试')
      }
    },
    tot(v) {
      if (v == 1) {
        this.$router.push({ name: 'ios' })
      } else {
        this.$router.push({ name: 'android' })
      }
    },
    cancel() {
      this.showCover = false
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  // height: ;
  padding-top: 0;
  height: 100vh;
}
.content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  min-height: 100vh;
  height: 100vh;
  overflow: scroll;
  background: #deeeeb;
  .top {
    padding: 110px 40px;
    text-align: center;
    img {
      width: 200px;
      // height: 148px;
    }
    .name {
      color: #0e3f37;
      font-size: 38px;
      font-weight: bold;
      margin: 10px 0 34px;
    }
    .desc {
      color: #0e3f37;
      font-size: 16px;
    }
    .erweima {
      margin-top: 10px;
    }
    .tokui {
      background: rgba(255, 147, 0, 1);
      width: 100px;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      margin: 30px auto;
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>
