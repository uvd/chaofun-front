<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="nav_con">
      <el-input
        v-if="!ISPHONE"
        placeholder="全站搜索"
        v-model="keyword"
        @change="toSearch"
        class="search"
      >
        <el-icon class="el-input__icon"><el-icon-search /></el-icon>
      </el-input>
    </div>
    <div class="right-menu">
      <div v-if="!ISPHONE" class="erweima">
        <div style="position: relative">
          <img
            class="erweimasmall img1"
            src="../../assets/images/icon/phone1.png"
            alt=""
          />
          <img
            class="erweimasmall img2"
            src="../../assets/images/icon/phonehover.png"
            alt=""
          />
          <span
            style="
              background: red;
              color: #fff;
              font-size: 10px;
              vertical-align: middle;
              position: absolute;
              top: 4px;
              left: -12px;
              height: 18px;
              line-height: 18px;
              padding: 0 4px;
              border-radius: 4px;
            "
            >new</span
          >
        </div>

        <div class="erweimabig">
          <div class="er_item er_item2">
            <img src="../../assets/images/app.png" alt="" />
            <p>App下载</p>
          </div>
          <div class="er_item">
            <img src="../../assets/images/icon/app_mini.png" alt="" />
            <p>小程序版</p>
          </div>
          <div class="er_item">
            <img src="../../assets/images/erweima2.jpg" alt="" />
            <p>扫码加微信 wwwchaofun 邀请入炒饭用户群</p>
          </div>

          <div class="er_item">
            <img src="../../assets/images/erweima3.png" alt="" />
            <p>扫码加入QQ用户群(784495660)</p>
          </div>
        </div>
      </div>
      <div class="">
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div v-if="islogin" class="avatar-wrapper">
            <div>
              <span
                v-if="!ISPHONE"
                @click.stop="toUrls({ name: 'message' })"
                style="float: right; margin-right: 20px"
              >
                <el-icon style="font-size: 24px; color: #999"
                  ><el-icon-message
                /></el-icon>
                <span
                  v-if="message.hasNewMessage"
                  class="tip_notice_circle"
                ></span>
              </span>
            </div>
            <img
              class="userAvatar"
              :src="
                imgOrigin +
                userinfo.icon +
                '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
              "
            />
            <div>
              <p>
                <span class="asd">{{ userinfo.userName }}</span>
                <span
                  v-if="ISPHONE && message.hasNewMessage"
                  class="tip_notice_circle2"
                >
                  <el-icon style="font-size: 16px; color: #999"
                    ><el-icon-message
                  /></el-icon>
                  <span
                    v-if="message.hasNewMessage"
                    class="tip_notice_circle"
                  ></span>
                </span>
              </p>
              <p>获赞：{{ userinfo.ups }}</p>
            </div>
            <el-icon><el-icon-caret-bottom /></el-icon>
          </div>
          <div v-else class="avatar-wrapper" @click="showLogin">
            <img
              class="userAvatar"
              :src="
                imgOrigin +
                defaultUserIcon +
                '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
              "
            />
            <div style="min-width: 50px">
              <p>未登录</p>
            </div>
          </div>
          <el-dropdown-menu v-if="islogin" slot="dropdown">
            <router-link v-if="islogin" to="/my">
              <el-dropdown-item>我的</el-dropdown-item>
            </router-link>
            <el-dropdown-item @click.native="toUrls({ name: 'message' })"
              >消息
              <span
                v-if="message.hasNewMessage"
                class="tip_notice"
                style="float: right"
              >
                {{ message.unreadMessage }}
              </span>
            </el-dropdown-item>
            <router-link v-if="islogin" to="/setting">
              <el-dropdown-item>设置</el-dropdown-item>
            </router-link>
            <router-link
              v-if="islogin && (ISPHONE || clientWidth < 865)"
              :to="'/submitH5'"
            >
              <el-dropdown-item>发帖</el-dropdown-item>
            </router-link>
            <el-dropdown-item v-if="islogin" divided>
              <span style="display: block" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Search as ElIconSearch,
  Message as ElIconMessage,
  CaretBottom as ElIconCaretBottom,
} from '@element-plus/icons'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import * as api from '../../api/api'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ElIconSearch,
    ElIconMessage,
    ElIconCaretBottom,
  },
  data() {
    return {
      keyword: '',
      isPhone: false,
      message: {},
    }
  },
  props: {
    userinfo: {
      type: Object,
      default() {
        return {}
      },
    },
    islogin: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
  },
  watch: {
    '$route.query.q'(v) {
      this.keyword = v
    },
  },
  created() {
    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    if (this.$route.query.q) {
      this.keyword = this.$route.query.q
    }
    this.messageCheck()
  },
  methods: {
    // ttt(){
    //   this.$login.showLogin();
    // },
    // doSty(){
    //   if(this.opened){
    //     return {
    //       paddingRight: '240px'
    //     }
    //   }else{
    //     return {
    //       paddingRight: '54px'
    //     }
    //   }
    // },
    toUrls(params) {
      this.message.hasNewMessage = false
      this.message.unreadMessage = 0
      this.$router.push(params)
    },
    messageCheck() {
      api.messageCheck().then((res) => {
        this.message = res.data
      })
    },
    showLogin() {
      this.$login({
        callBack: () => {
          this.$store.dispatch('user/getInfo')
        },
      })
    },
    toSearch() {
      if (this.$route.path == 'search') {
      } else {
        this.$router.push({ name: 'search', query: { q: this.keyword } })
      }
    },
    searchs(v) {},
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 50px;
  // overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: inline-flex;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    // float: left;
    display: inline-flex;
    align-items: center;
    z-index: 10;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    padding-right: 0 !important;
    padding-left: 5px !important;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    // float: left;
    display: inline-flex;
    z-index: 10;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    height: 100%;
    line-height: 50px;
    display: inline-flex;
    z-index: 10;
    // display: flex;
    flex-grow: 0;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      // padding: 0 8px;
      padding: 0;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 18px;
      position: relative;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 12px;
          font-size: 12px;
        }
      }
    }
  }
}
.avatar-wrapper {
  display: flex;
  .userAvatar {
    width: 40px;
    height: 40px;
    margin-right: 4px;
    border-radius: 50%;
  }
  div {
    // padding-top: 4px;
    p {
      line-height: 20px;
      margin: 0;
      padding: 0;
      font-size: 14px;
    }
    p:nth-child(2) {
      color: #999;
      font-size: 12px;
    }
  }
}
.search {
  // position: absolute;
  // right: 200px;
  width: 350px;
  background: transparent;
}
/deep/ .el-input--medium .el-input__inner {
  background: transparent;
}
/deep/ .el-input__prefix {
  left: 314px;
}
.nav_con {
  // position: absolute;
  display: inline-flex;
  flex: auto;
  height: 50px;
  // width: 100%;
  z-index: 1;
  // display: flex;
  align-items: center;
  justify-content: space-around;
}
.tip_notice {
  // width: 10px;
  // height: 10px;
  background: #ff4949;
  font-size: 10px;
  padding: 4px;
  border-radius: 10px;
  line-height: 8px;
  color: #fff;
}
.tip_notice_circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #ff4949;
  border-radius: 50%;
  vertical-align: top;
}
.tip_notice_circle2 {
  position: absolute;
  right: -18px;
  top: 2px;
  z-index: 10;
}
.asd {
  max-width: 100px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.erweima {
  position: relative;
  .erweimasmall {
    width: 34px;
    vertical-align: middle;
    margin-right: 10px;
  }
  .img2 {
    display: none;
  }
  .erweimabig {
    display: none;
    position: absolute;
    background: #fff;
    text-align: center;
    line-height: 20px;
    right: 0;
    z-index: 10;
    padding: 8px;
    width: 450px;
    border: 1px solid #ddd;
    border-radius: 4px;
    flex-flow: wrap;
    height: 400px;
    align-items: center;
    .er_item {
      flex: 0 0 50%;
    }
    img {
      width: 120px;
    }
    .er_item {
      // margin: 30px 0 30px;
    }
    .er_item2 {
      // margin-bottom: 20px;
    }
  }
  &:hover {
    .img1 {
      display: none;
    }
    .img2 {
      display: inline-block;
    }
    .erweimabig {
      display: flex;
    }
  }
}
</style>
