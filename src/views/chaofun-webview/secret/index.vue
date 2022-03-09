<template>
  <div>
    <div v-if="this.$store.state.user.islogin" class="container">
      <div v-if="secret.cnTitle" class="fixed_title">
        <div class="ts">{{ secret.cnTitle }}</div>
        <div class="tname">--{{ secret.author }}</div>
      </div>
      <div
        v-touch:start="startHandler"
        v-touch:end="endHandler"
        class="content"
      >
        <div v-if="secret.imageUrl" class="img">
          <div v-viewer="" v-if="!secret.imageUrl.includes('.mp4')">
            <img
              class="ims"
              v-if="!secret.imageUrl.includes('.mp4')"
              :src="
                secret.imageUrl +
                '?x-oss-process=image/resize,h_768/format,webp/quality,q_75'
              "
              :data-source="secret.imageUrl"
            />
          </div>
          <video
            class="ims video"
            v-if="secret.imageUrl.includes('.mp4')"
            controls
            autoplay
            loop
            :src="secret.imageUrl"
            alt=""
          ></video>
        </div>
      </div>
      <div class="fixed_bottom">
        <div @click="getData" class="rs">
          <img class="down" src="../assets/images/refresh.png" alt="" />
        </div>
        <div @click="toPost" class="left_b">发布到炒饭</div>
        <div @click="getData" class="rs">
          <img class="down" src="../assets/images/refresh.png" alt="" />
        </div>
      </div>
      <van-popup
        v-model="show"
        duration="0.1"
        closeable
        close-icon="close"
        position="bottom"
        :style="{ height: '80%', zIndex: 55555 }"
      >
        <div class="cont">
          <textarea type="text" v-model="title" placeholder="标题 (非必填)" />
          <div>
            <div @click="clearsss" class="btnt">重新填写</div>
          </div>

          <div class="forums">
            <h1>我要分享到</h1>
            <div class="forum_items">
              <div
                @click="choose(item)"
                v-for="(item, index) in tags"
                :key="index"
                :class="[
                  'forum_item',
                  { forum_item_active: chooseId == item.id },
                ]"
              >
                <img
                  class="f_img"
                  :src="
                    imgOrigin +
                    item.imageName +
                    '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
                  "
                  alt=""
                />
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div @click="submit" class="btn">发布</div>
        </div>
      </van-popup>
    </div>
    <div v-else class="container container2">
      <div class="nologin2">
        <p>登录后访问秘密花园~</p>
        <div @click="toLogin" class="btn2">去登录</div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents)
import { delete_secret_image } from '../../../api/api'
export default {
  name: 'Home',
  components: {},

  data() {
    return {
      secret: {},
      show: false,
      tags: [],
      chooseId: '',
      title: '',
      version: '',
      touchstartX: 0,
      touchstartY: 0,
      touchendX: 0,
      touchendY: 0,
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    clearsss() {
      this.title = ''
    },
    init() {
      if (!this.$store.state.user.islogin) {
        console.log(777)
        let self = this
        window.callChaoFun = function (code, _sysv) {
          if (res == '10001') {
            self.toLogin()
          }
          console.log(code)
          console.log(_sys)
          self.version = _sys
        }
      } else {
        this.getData()
      }
    },
    toLogin() {
      //   window.flutter_inappwebview.callHandler('toLoginPage');
      try {
        window.flutter_inappwebview
          .callHandler('toLoginPage')
          .then((res) => {})
          .catch((err) => {
            this.$toast('当前版本不支持功能，更新后重试')
          })
      } catch {
        // if(this.version<'2.17.5'){
        //     this.$toast('当前版本不支持功能，请更新后重试')
        // }
        this.$toast('当前版本不支持功能，更新后重试')
      }
      //   window.flutter_inappwebview.callHandler('toUpgradePage');
    },
    submit() {
      console.log(this.secret)
      api
        .submit_secret_image({
          imageUrl: this.secret.imageUrl,
          title: this.title,
          forumId: this.chooseId * 1,
        })
        .then((res) => {
          this.show = false
          if (res.success) {
            this.$toast('发布成功')
            this.title = res.data.cnTitle
            this.secret = res.data
            this.chooseId = res.data.submitForum
          } else {
            this.$toast(res.errorMessage)
          }
        })
    },
    choose(item) {
      this.chooseId = item.id
    },
    getTagLists() {
      let params = this.params
      this.ifcanget = false
      api.listForumsByTag({ tagId: '0' }).then((res) => {
        console.log(res)
        var obj =
          res.data[
            res.data.findIndex((value) => value.id == this.secret.submitForum)
          ]
        res.data.unshift(obj)
        this.tags = this.unique(res.data)
      })
    },
    unique(arr) {
      return Array.from(new Set(arr))
    },
    doList(child, parent) {
      child.forEach((item) => {
        var id = item.id
      })
    },
    toPost() {
      this.show = true
    },

    getData() {
      api
        .delete_secret_image(
          this.secret.imageUrl ? { imageUrl: this.secret.imageUrl } : {}
        )
        .then((res) => {
          this.secret = res.data
          this.title = res.data.cnTitle
          this.chooseId = res.data.submitForum
          this.getTagLists()
        })
    },
    getButtonRank() {
      api.getTOpUps().then((res) => {
        this.pagedata = res.data
      })
    },
    toUser(item) {
      try {
        window.flutter_inappwebview.callHandler('toAppUser', {
          userId: item.userAO.userId + '',
        })
      } catch (e) {
        window.open(location.origin + '/user/' + item.userAO.userId, '_blank')
      }
    },
    startHandler(event) {
      console.log(event)
      this.touchstartX = event.changedTouches[0].screenX
      this.touchstartY = event.changedTouches[0].screenY
    },
    endHandler(event) {
      console.log(event)
      this.touchendX = event.changedTouches[0].screenX
      this.touchendY = event.changedTouches[0].screenY // if (touchEvent.changedTouches[0].screenX )

      if (
        this.touchendY < this.touchstartY &&
        this.touchstartY - this.touchendY > 20
      ) {
        this.getData()
      } else if (
        this.touchendX < this.touchstartX &&
        this.touchstartX - this.touchendX > 20
      ) {
        this.getData()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  // height: ;
  padding-top: 0;
  height: 100vh;
  background: #000;
}
.container2 {
  background: #fff;

  .nologin2 {
    width: 100%;
    display: block;
    height: 80px;
    text-align: center;
    padding-top: 200px;
    p {
      font-size: 14px;
      color: #999;
    }
    .btn2 {
      width: 120px;
      line-height: 40px;
      text-align: center;
      margin: 10px auto;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 16px;
      color: #fff;
      background: #ff9300;
    }
  }
}
.content {
  .img {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 40px;
    box-sizing: border-box;
    .ims {
      max-width: 100%;
      max-height: 100vh;
    }
    .video {
      height: 240px;
      width: 100%;
    }
  }
}
.fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  line-height: 50px;
  background: #f1f1f1;
  color: #333;
  padding-left: 10px;
  font-size: 16px;
  z-index: 1;
}

.fixed_bottom {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  z-index: 4;
  justify-content: space-around;
  //   background: #fff;
  padding: 30px 30px;
  .left_b {
    margin: 0 auto;
    position: center;
    border: 1px solid #f1f1f1;
    padding: 0px 10px;
    border-radius: 10px;
    background-color: white;
    margin-bottom: 10px;
    line-height: 32px;
  }
  .rs {
    flex: 0 0 60px;
    text-align: center;
  }
  .down {
    width: 32px;
    height: 32px;
    &:active {
      width: 36px;
      height: 36px;
    }
  }
}
.cont {
  padding: 50px 10px 0 10px;
  height: 100%;
  // background: #000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  textarea {
    letter-spacing: 1.2px;
    width: 100%;
    flex: 0 0 60px;
    box-sizing: border-box;
  }
  .forums {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  h1 {
    flex: 0 0 24px;
  }
  .forum_items {
    flex: 1;
    overflow-y: scroll;
    padding: 10px 0;
    display: flex;
    flex-flow: wrap;
    // justify-content: space-between;
    .forum_item {
      padding: 4px 10px;
      border-radius: 24px;
      border: 1px solid #f1f1f1;
      margin: 4px 10px 4px 0;
      .f_img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    .forum_item_active {
      background: rgba(255, 147, 0, 0.5);
      color: #fff;
    }
  }
  .btn {
    flex: 0 0 44px;
    line-height: 44px;
    background: #ff9300;
    color: #fff;
    text-align: center;
    border-radius: 30px;
    margin-right: 20px;
    margin-bottom: 10px;
    font-size: 18px;
  }
}
.fixed_title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 15px;
  .tname {
    text-align: right;
  }
}
.btnt {
  float: right;
  font-size: 12px;
  background: #2196f3;
  color: #fff;
  padding: 2px 6px;
  border-radius: 14px;
}
/deep/ .clearsss {
  z-index: 3 !important;
}
</style>
