<template>
  <div class="container">
    <div class="logo_con">
      <img
        src="https://i.chao.fun/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80/format,webp/quality,q_75"
        alt=""
      />
      <div>Andorid版下载</div>
    </div>
    <div class="a">
      <input
        v-model="value"
        maxlength="6"
        placeholder="请输入下载口令"
        type="text"
      />

      <div @click="sure" class="btn">确定</div>
    </div>
    <div v-if="showCover" class="covers" @click="showCover = false">
      <img src="../../assets/images/icon/arrow.png" class="covers_img" alt="" />
      <div class="cover_con">
        <div>
          <img src="../../assets/images/icon/1.png" alt="" />
          点击右上角更多按键
        </div>
        <div>
          <img src="../../assets/images/icon/2.png" alt="" />
          选择本地浏览器打开
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import
export default {
  name: '',
  data() {
    return {
      show: false,
      value: '',
      showCover: false,
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    sure() {
      if (!this.isWeiXin()) {
        var u = navigator.userAgent,
          app = navigator.appVersion
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
        if (isAndroid) {
          location.href = 'https://chao.fun/chaofan.apk'
        } else {
          location.href = 'https://testflight.apple.com/join/YWXpW03v'
        }
      } else {
        this.showCover = true
      }
    },
    onInput(value) {
      Toast(value)
    },
    onDelete() {
      Toast('删除')
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.content {
  padding: 16px 16px 160px;
}
.container {
  background: #fff;
  // height: 100vh;
}
.logo_con {
  padding: 50px 0 30px;
  text-align: center;
  img {
    width: 150px;
  }
}
.a {
  width: 120px;
  margin: 0 auto;
  text-align: center;
  input {
    text-align: center;
    width: 120px;
  }
}
.btn {
  width: 120px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: orangered;
  margin-top: 20px;
  color: #fff;
  border-radius: 4px;
}
.covers {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  //  align-items: center;
  justify-content: space-around;
  .cover_con {
    background: #fff;
    //  padding: 60px;
    border-radius: 10px;
    font-size: 18px;
    margin-top: 180px;
    height: 140px;
    text-align: center;
    padding: 30px 60px;
    line-height: 36px;
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
  }
  .covers_img {
    position: absolute;
    top: 30px;
    right: 40px;
    width: 100px;
  }
}
</style>
