<template>
  <div class="container">
    <div class="content">
      <div v-if="!list.length" class="top">
        <div>
          <img
            @click="toNavigate"
            src="../../../assets/images/webview/nocontent.png"
            alt=""
          />
        </div>
        <p class="desc">敬请期待更多活动~</p>
      </div>
      <div v-if="list.length" class="act_list">
        <div
          v-if="item.imgUrl"
          @click="toDetail(item)"
          class="item"
          v-for="(item, index) in list"
          :key="index"
        >
          <div style="height: 154px">
            <img :src="item.imgUrl" alt="" />
          </div>
          <div v-if="item.showBottom" class="desc">
            <p class="title">{{ item.title }}</p>
            <span class="tab">{{ item.desc }}</span>
          </div>
        </div>
        <div
          style="background-color: white; margin-bottom: 15px"
          v-if="!item.imgUrl"
          @click="toDetail(item)"
          v-for="(item, index) in list"
          :key="index"
        >
          <div>
            <p style="font-size: 24px; font-weight: bold; color: #fe9400">
              {{ item.title }}
            </p>
            <span>{{ item.desc }}</span>
          </div>
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
      list: [
        {
          imgUrl: require('../assets/images/secret.jpg'),
          path: '/webview/secret',
          title: '秘密花园',
          showBottom: false,
        },
        // {
        //     path: '/webview/oauth?redirectUrl=https%3A%2F%2Fspringchen.cn/Dengmi/?mirror=1065',
        //     title: '元宵猜灯谜活动',
        //     desc: '一起来猜灯谜吧，有FBi奖励哦！！！',
        //     showBottom: true
        // },
        {
          path: '/webview/year2021',
          title: '2021年度总结',
          desc: '你的炒饭2021年度总结',
          showBottom: true,
        },
        {
          // imgUrl: require('../assets/images/secret.jpg'),
          path: '/userRank',
          title: '24小时用户排名',
          desc: '根据获赞数统计，来看看你第几名',
          showBottom: true,
        },
        {
          // imgUrl: require('../assets/images/secret.jpg'),
          path: '/forumRank',
          title: '24小时版块排名',
          desc: '根据获赞数统计，来看看你加入的版块排第几吧？',
          showBottom: true,
        },
        {
          // imgUrl: require('../assets/images/secret.jpg'),
          path: '/webview/FBi',
          title: '饭币（FBi）',
          desc: 'FBi介绍（邀请用户获高额FBi奖励呀）',
          showBottom: true,
        },
      ],
    }
  },
  created() {},
  mounted() {},
  methods: {
    toDetail(item) {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + item.path,
          title: item.title,
          showHeader: true,
        })
      } catch (e) {
        window.open(location.origin + item.path)
      }
    },
    toNavigate() {
      //   window.flutter_inappwebview.callHandler('to');
      // window.flutter_inappwebview.callHandler('toAppUser',{userId:"2"}).then(function(result) {
      // });
      // window.flutter_inappwebview.callHandler('toAppForum',{forumId:"3"}).then(function(result) {
      // });
      // window.flutter_inappwebview.callHandler('toAppPost',{postId:"703245"}).then(function(result) {
      // });
      // window.flutter_inappwebview.callHandler('toViewPage',{url: 'http://www.baidu.com',title:'百度一下'}).then(function(result) {
      // });
      // window.flutter_inappwebview.callHandler('toViewPage',{
      //     url: 'https://chao.fun',
      //     title:'炒饭超Fun',
      //     showHeader: true
      // });
    },
    showImg() {
      var params
      if (this.version == 'new') {
        params = {
          method: 'viewImage',
          data: {
            imgSrc: [
              'https://i.chao.fun/' +
                'biz/10c40905c46e8c9c65d8d95b9fb25bdf.jpg',
            ],
            index: 0,
          },
        }
      } else {
        params = {
          type: 'viewImage',
          query: {
            imgSrc:
              'https://i.chao.fun/' +
              'biz/10c40905c46e8c9c65d8d95b9fb25bdf.jpg',
          },
        }
      }

      chaofanJsChannel.postMessage(JSON.stringify(params))
    },
    toAdvice() {
      var params
      if (this.version == 'new') {
        params = {
          method: 'navigator',
          data: {
            url: 'articlepublish',
            query: {},
          },
        }
      } else {
        params = {
          type: 'advice',
          query: { a: 111 },
        }
      }
      chaofanJsChannel.postMessage(JSON.stringify(params))
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
  // background: #000;
  .content {
    padding-top: 10px;
  }
}
.top {
  padding: 180px 50px;
  text-align: center;
  img {
    width: 150px;
    // height: 148px;
  }
  .desc {
    font-size: 14px;
    color: #999;
    margin: 20px 0;
  }
}

.act_list {
  padding: 10px;
  .item {
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      // height: 120px;
      vertical-align: middle;
    }
    .desc {
      position: relative;
      padding: 10px;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .tab {
        // position: absolute;
        background: #ff9300;
        padding: 4px 8px;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
      }
    }
  }
}
</style>
