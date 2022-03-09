<template>
  <div class="container">
    <div :style="{ height: ISPHONE ? '400px;' : '' }">
      <div class="topImg">
        <img src="../../assets/images/top_bg_mobile.png" alt="" />
      </div>
      <div class="logo_con">
        <div style="height: 140px">
          <img
            src="https://i.chao.fun/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80/format,webp/quality,q_75"
            alt=""
          />
        </div>

        <div class="app_name">
          <img
            class="plat_icon"
            src="../../assets/images/icon/android.png"
            alt=""
          />
          <img
            class="plat_icon"
            src="../../assets/images/icon/ios.png"
            alt=""
          />
          <span>炒饭超Fun</span>
        </div>
        <div class="build_info">
          <div class="info_item">
            iOS: {{ iosVersion.version }} | Android:
            {{ androidVersion.version }}
          </div>
        </div>
      </div>
      <div v-if="ISPHONE" class="down_btn">
        <div @click="sure(1)" class="btn_green">安装</div>
      </div>
      <div v-else class="down_btn" style="text-align: center">
        <img
          style="height: 100%; height: 210px"
          src="../../assets/images/app.png"
          alt=""
        />
        <p style="margin: 10px 0">扫一扫下载app</p>
      </div>
      <div class="home_btn">
        <div @click="back" class="btn_green">访问炒饭</div>
      </div>
      <div
        v-if="ISPHONE && !isiOS"
        @click="sure(2)"
        style="text-align: center; color: #999; margin-top: 10px"
        class=""
      >
        直接下载 >
      </div>
    </div>

    <div class="detail">
      <div class="nav">
        <div class="nav_item">详情介绍</div>
        <!-- <div class="nav_item">
                  版本介绍
              </div> -->
      </div>
      <div class="intos">
        <div class="detail_into">
          <div class="img_item">
            <img src="../../assets/images/app/1.png" alt="" />
          </div>
          <div class="img_item">
            <img src="../../assets/images/app/2.jpg" alt="" />
          </div>
          <div class="img_item">
            <img src="../../assets/images/app/3.jpg" alt="" />
          </div>
          <div class="img_item">
            <img src="../../assets/images/app/4.jpg" alt="" />
          </div>
        </div>
        <div class="desc">
          炒饭超Fun
          App是一款兴趣聚合的优质内容社区，聚合全网热门资讯、热门话题、优质好图等多个版块，在这里，你可以分享你喜欢的内容，世界那么大，来炒饭看看！
        </div>
      </div>
    </div>
    <div class="a">
      <!-- <input v-model="value" maxlength="6" placeholder="请输入下载口令" type="text"> -->

      <!-- <div @click="sure" class="btn">下载</div> -->
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
import * as api from '../../api/api'
// import
export default {
  name: '',
  data() {
    return {
      show: false,
      value: '',
      showCover: false,
      isiOS: false,
      iosVersion: {
        version: '',
        content: '',
        force: false,
        action: 'check',
        platform: 'ios',
      },

      androidVersion: {
        version: '',
        content: '',
        force: false,
        action: 'check',
        platform: 'android',
      },
    }
  },
  components: {},
  created() {
    var u = navigator.userAgent,
      app = navigator.appVersion
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或者uc浏览器
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  },
  mounted() {
    if (this.$route.query.inviter != null) {
      localStorage.setItem('inviter', this.$route.query.inviter)
    }
    api.getLatestAppVersion({ platform: 'ios' }).then((res) => {
      if (res.success && res.data != null) {
        this.iosVersion = res.data.ios
        this.androidVersion = res.data.android
      }
    })
  },
  methods: {
    copyLink() {
      var input = document.createElement('input')
      input.setAttribute('value', window.location.href)
      document.body.appendChild(input)
      input.select()
      var result = document.execCommand('copy')
      document.body.removeChild(input)
    },
    back() {
      this.copyLink()
      this.$router.push({ path: '/' })
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    sure(type) {
      this.copyLink()
      var u = navigator.userAgent,
        app = navigator.appVersion
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或者uc浏览器
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
      if (!this.isWeiXin()) {
        // if(this.value=='666666'){
        //     location.href = 'https://chao.fun/chaofan_test.apk'
        // }else{
        //     this.$toast('口令错误');
        // }

        // if(isAndroid){
        //     location.href = 'https://chao.fun/chaofan.apk'
        //     // location.href = `opentest://host`;
        // }else{
        //     location.href = 'https://apps.apple.com/cn/app/%E7%82%92%E9%A5%AD%E8%B6%85fun/id1526950194'
        // }
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          location.href =
            'https://apps.apple.com/cn/app/%E7%82%92%E9%A5%AD%E8%B6%85fun/id1526950194'
        } else if (/(Android)/i.test(navigator.userAgent)) {
          // location.href = 'vivoMarket://details?id=com.chao.app'
          if (type == 2) {
            window.open('https://chao.fun/chaofan.apk', '_blank')
            return
          }
          //跳转到安卓商城地址
          let ua = u.toLowerCase()
          let isVivo = ua.indexOf('vivo') != -1
          let isHuawei = ua.indexOf('huawei') != -1
          let isMi = ua.indexOf('redmi') != -1 || ua.indexOf('xiaomi') != -1
          let isMeizu = ua.indexOf('meizu') != -1
          let isOppo = ua.indexOf('oppo') != -1

          let hreff = ''
          if (isVivo) {
            hreff = 'vivoMarket://details?id=com.chao.app'
          } else if (isHuawei) {
            hreff = 'appmarket://details?id=com.chao.app'
            // hreff = 'http://www.baidu.com'
          } else if (isMi) {
            hreff = 'mimarket://details?id=com.chao.app'
          } else if (isMeizu) {
            hreff = 'mstore://details?id=com.chao.app'
          } else if (isOppo) {
            hreff = 'market://details?id=com.chao.app'
          } else {
            hreff = 'market://details?id=com.chao.app' // 官网下载地址  也可以跳到应用宝
          }
          try {
            if (isHuawei) {
              window.open('https://chao.fun/chaofan.apk', '_blank')
            } else {
              window.location.href = hreff
            }
            // window.open(hreff,"_blank");
          } catch (e) {
            window.open('https://chao.fun/chaofan.apk', '_blank')
          }

          //   window.open('https://chao.fun/chaofan.apk',"_blank");
        }
      } else {
        if (isiOS) {
          location.href =
            'https://apps.apple.com/cn/app/%E7%82%92%E9%A5%AD%E8%B6%85fun/id1526950194'
        } else {
          this.showCover = true
        }
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
.topImg {
  height: 70px;

  img {
    width: 100%;
  }
}
.container {
  background: #f4f4f4;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  // background: url('https://i.chao.fun/biz/94aaa9cd9cdd920c969dd073ebb41869.jpg');

  // height: 100vh;
}
.logo_con {
  padding: 0px 0 0px;
  text-align: center;

  img {
    width: 150px;
    border-radius: 8px;
  }
}
.app_name {
  color: #0a0d26;
  font-size: 14px;
  padding: 20px 0 0px;
  font-size: 18px;
  line-height: 40px;
  height: 80px;
  .plat_icon {
    width: 20px;
    vertical-align: middle;
    margin-top: -4px;
    margin-left: 8px;
  }
  span {
    padding-left: 10px;
  }
}
.build_info {
  display: flex;
  padding: 0 10px;
  margin-bottom: 10px;
  justify-content: space-around;
  .info_item {
    //  flex: 1;
    font-size: 14px;
    color: #788090;
    &:nth-child(1) {
      //  border-right: 1px solid #DEE2EC;
    }
  }
}
.home_btn {
  padding: 0px 40px;
  .btn_green {
    background: #eed180;
    color: #fff;
    font-weight: 500;
    line-height: 44px;
    border-radius: 30px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
  }
}
.down_btn {
  padding: 20px 40px;
  .btn_green {
    background: #28caad;
    color: #fff;
    font-weight: 500;
    line-height: 44px;
    border-radius: 30px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
  }
}
.detail {
  background: #fff;
  .nav {
    display: flex;
    padding: 0 50px;
    margin-bottom: 20px;
    margin-top: 20px;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
    .nav_item {
      //  flex: 1;
      line-height: 55px;
      text-align: center;
    }
  }
  .detail_into {
    //  width: 100%;
    overflow-x: scroll;
    display: flex;
    padding: 0 5px;
    padding-bottom: 20px;
    justify-content: space-between;
    &::-webkit-scrollbar {
      display: none;
    }
    .img_item {
      margin: 0 5px;
      border: 1px solid #eee;
      border-radius: 4px;
      img {
        width: 170px;
      }
    }
  }
  .desc {
    padding: 0 15px 30px;
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
.backto {
  text-align: center;
  color: #999;
  text-align: center;
  padding: 10px 0;
  width: 120px;
  margin: 0 auto;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
    color: #28caad;
  }
}
</style>
