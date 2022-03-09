<template>
  <div id="rright" class="rright">
    <apply-forum
      :dialogTableVisible="showApplyForum"
      @hideFunc="hideApplyForum"
    ></apply-forum>
    <div v-if="!ISPHONE" ref="right_content" class="right_content">
      <div v-if="forumInfo" class="asa">
        <div class="forum_con">
          <div
            v-if="forumInfo.admin"
            @click="manage"
            style="position: absolute; right: 20px"
            class="forummanage"
          >
            管理
          </div>
          <div class="admin_header admin_titles" style="font-size: 18px">
            版块信息
          </div>
          <div class="fensi">
            <div class="_3XFx6CfPlg-4Usgxm0gK8R">
              粉丝：{{ forumInfo.followers }}
            </div>
            <div class="_3XFx6CfPlg-4Usgxm0gK8R">
              帖子：{{ forumInfo.posts }}
            </div>
          </div>
          <div class="forum_add">
            <el-button @click="gotoSubmit2" type="primary" block>
              发帖
            </el-button>
          </div>
          <div v-if="forumInfo.openChat" class="forum_add">
            <el-button
              @click="gotoChat"
              style="width: 100%"
              type="success"
              block
            >
              加入版聊
            </el-button>
          </div>
        </div>
      </div>
      <div :class="['admin']">
        <div class="admin_header admin_titles">
          版主
          <span class="iconsss" v-if="sticky">
            <i
              @click="toggle"
              :class="showAllAdmin ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
          </span>
        </div>

        <div
          v-for="(item, index) in forumAdmin"
          :key="index"
          class="admin_item"
        >
          <span @click="toUser(item)" class="admin_name">{{
            item.userName
          }}</span>
        </div>
        <el-button v-if="!forumAdmin.length" @click="showApplyMod = true"
          >暂无版主 申请版主</el-button
        >
        <apply-mod
          :dialogTableVisible="showApplyMod"
          :forum-id="forumId"
          @hideFunc="hideApplyMod"
        ></apply-mod>
      </div>
      <div class="tologin">
        <div @click="reload" class="body-right">刷新</div>
        <div v-if="!islogin" @click="gotologin" class="body-right">
          马上登录
        </div>
        <div @click="gotoSecret" class="body-right">
          秘密花园
          <span
            data-v-265cb265=""
            style="
              background: red;
              color: rgb(255, 255, 255);
              font-size: 10px;
              vertical-align: middle;
              height: 18px;
              line-height: 18px;
              padding: 0px 4px;
              border-radius: 4px;
            "
            >Hot</span
          >
        </div>
        <div @click="gotoAddForum" class="body-right">版块创建</div>
        <div v-if="false" class="game">
          <div style="height: 20px; background: #f1f1f1"></div>
          <div class="title">贪吃蛇 <span class="tab">春节有奖活动</span></div>
          <snake :datas="datas"></snake>
          <div class="rank">
            <div class="rank_title">
              <img src="../../assets/images/game/snake/rank.png" alt="" />
              排行榜
              <span class="rule">规则 </span>
              <div class="rules">
                <p>1、活动时间：2020/4/1 00:00-23:25;</p>
                <p>
                  2、活动规则：活动当天，<span style="color: red">登录用户</span
                  >玩游戏，取最高得分参与排名，前<span style="color: red"
                    >10</span
                  >名可获得奖励哦~
                </p>
              </div>
            </div>
            <div class="rank_items">
              <div
                v-for="(item, index) in gameRank"
                :key="index"
                class="rank_item"
              >
                <img
                  v-if="index == 0"
                  src="../../assets/images/game/snake/1.png"
                  alt=""
                />
                <img
                  v-if="index == 1"
                  src="../../assets/images/game/snake/2.png"
                  alt=""
                />
                <img
                  v-if="index == 2"
                  src="../../assets/images/game/snake/3.png"
                  alt=""
                />
                <span class="mci" v-if="index > 2">{{ index + 1 }}</span>
                <div
                  @click="
                    toUrl({ name: 'userhome', params: { id: item.userId } })
                  "
                  class="username"
                >
                  {{ item.userName }}
                </div>
                <div class="score">{{ item.score }}分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chatbtn">
        <div class=""></div>
      </div>

      <!-- v-if="$store.state.user.userInfo&&($store.state.user.userInfo.userId==1||$store.state.user.userInfo.userId==2||$store.state.user.userInfo.userId==146)" -->
      <div :class="['help_con', sticky ? 'help_con_fixed' : '']">
        <div class="help_item">
          <div @click="toUrl({ path: '/help/forumIntro' })">帮助文档</div>
          <div @click="toUrl({ path: '/webview/year2021' })">2021年度总结</div>
        </div>
        <div class="help_item">
          <div @click="goto24HForumRank">24小时版块排名</div>
          <div @click="goto24HUserRank">24小时用户排名</div>
        </div>
      </div>
    </div>

    <!--   暂时先隐藏二维码   -->
    <!--    <div v-if="$route.path=='/'||$route.path=='/all'||$route.path=='/recommend'" class="notice">-->
    <!--      <div class="img">-->
    <!--        <img style="width:100%;" src="../../assets/images/erweima2.jpg" alt="">-->
    <!--        <p>扫码加微信邀请入炒饭用户群，欢迎大家加入~</p>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import snake from '@/components/game/snake/snake3.vue'
import * as api from '@/api/api'
import ApplyMod from './ApplyMod'
import ApplyForum from './ApplyForum'
export default {
  name: '',
  data() {
    return {
      showApplyMod: false,
      showApplyForum: false,
      forumAdmin: [],
      gamemodule: localStorage.getItem('gamemodule'),
      forumId: '',
      gameRank: null,
      datas: {
        width: 260,
        height: 200,
        speeds: [200, 150, 100],
        data: {
          // 初始头位置
          x: 2,
          y: 2,
          size: 10, //大小
          timeout: 200, // 每隔多久刷新
        },
      },
      sticky: false,
      showAllAdmin: false,
      rightComHeight: '',
    }
  },
  props: {
    islogin: {
      type: Boolean,
      default: false,
    },
    forumInfo: {
      type: Object,
      default: null,
    },
  },
  components: {
    ApplyMod,
    ApplyForum,
    snake,
  },
  created() {
    console.log(this.$route.params)
    this.forumId = this.$route.params.forumId
  },
  destroyed() {
    this.$('.infinite-list')[0].removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    // this.getGameTop();
    if (new Date().getDate() == 1) {
      this.gamemodule = true
    }
    this.modlist()

    if (this.$route.params.forumId) {
      this.$('.infinite-list')[0].addEventListener('scroll', () => {
        if (!this.rightComHeight) {
          this.rightComHeight = parseInt(
            window.getComputedStyle(document.getElementById('rright')).height
          )
          console.log(this.rightComHeight)
        }
        let top = this.$('.infinite-list').scrollTop()
        if (top > this.rightComHeight + 60) {
          this.sticky = true
        } else {
          this.sticky = false
        }
        console.log('top', top)
      })
    }
  },
  methods: {
    toggle() {
      this.showAllAdmin = !this.showAllAdmin
    },
    gotoChat() {
      this.doLoginStatus().then((res) => {
        if (res) {
          localStorage.setItem('wsForum', JSON.stringify(this.forumInfo))
          if (this.$store.state.user.showChatBox) {
            this.$store.dispatch('user/SET_showChatBox', false)
            setTimeout(() => {
              this.$store.dispatch('user/SET_showChatBox', true)
            }, 500)
          } else {
            this.$store.dispatch('user/SET_showChatBox', true)
          }
        }
      })
    },
    modlist() {
      api.modlist({ forumId: this.forumId }).then((res) => {
        this.forumAdmin = res.data
      })
    },
    gotoAddForum() {
      this.showApplyForum = true
    },
    getGameTop() {
      api.getGameTop({ top: 10 }).then((res) => {
        this.gameRank = res.data
      })
    },
    gotologin() {
      this.showLogin('login')
    },
    showLogin(v) {
      this.$login({
        callBack: () => {
          this.$store.dispatch('user/getInfo')
        },
      })
    },
    manage() {
      this.$router.push({ path: this.forumInfo.id + '/setting' })
    },
    gotoSubmit2() {
      // 发帖
      console.log(this.forumInfo)
      // if(this.$store.state.user.islogin){
      //   this.$router.push({path: '/submit',query:{id: this.forumInfo.id,name: this.forumInfo.name}})
      // }else{
      //   this.showLogin('login')
      // }
      this.toPost(
        this.forumInfo.id,
        this.forumInfo.name,
        this.forumInfo.imageName
      )
    },
    sets(name, v) {
      this[name] = v
      localStorage.removeItem(name)
    },
    reload() {
      location.reload()
    },
    gotologin() {
      this.showLogin('login')
    },
    gotoSecret() {
      this.doLoginStatus().then((res) => {
        if (res) {
          this.$router.push({ name: 'secret' })
        }
      })
    },

    goto24HForumRank() {
      this.$router.push({ path: '/forumRank' })
    },

    goto24HUserRank() {
      this.$router.push({ path: '/userRank' })
    },

    gotoSubmit() {
      this.doLoginStatus().then((res) => {
        if (res) {
          this.$router.push({ name: 'submit' })
        }
      })
    },
    hideApplyForum() {
      this.showApplyForum = false
    },
    hideApplyMod() {
      this.showApplyMod = false
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  padding: 0;
  width: 4px;
  height: 44px;
  // background-color: rgba(0, 0, 0, .2);
  // background-color: #f1f1f1;
  background-color: $linkcolor;
}
::-webkit-scrollbar {
  width: 4px;
  padding: 10px;
  // height: 44px;
  background-color: #999;
}
.rright {
  padding: 10px;
  // background: rgb(241,241,241);
  overflow: hidden;
  overflow-y: auto;

  .right_content {
  }
  .asa {
    border: 1px solid #f1f1f1;
    position: sticky;
  }
}
.tologin {
  background: #f7f7f7;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
  background: #fff;

  div.body-right {
    padding: 14px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 16px;

    cursor: pointer;
    &:hover {
      color: $linkcolor;
    }
  }
}
.help_con {
  top: 50px;
  margin-top: 10px;
  padding: 14px 0;
  background: #fff;
  position: sticky;
  top: 1200px;
  .help_item {
    padding: 8px 14px;
    display: flex;
    justify-content: space-between;
    div {
      cursor: pointer;
      &:hover {
        color: $linkcolor;
        text-decoration: underline;
      }
    }
  }
}
.help_con_fixed {
  position: fixed;
  width: 270px;
  top: 50px;
}
.advertise {
  margin: 30px 0;
  img {
    width: 270px;
  }
}
.game {
  position: relative;
  .title {
    line-height: 34px;
    padding-left: 10px;
    .tab {
      font-size: 12px;
      background: chocolate;
      color: #fff;
      padding: 2px 4px;
      border-radius: 2px;
    }
    .close {
      background: #ddd;
      float: right;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      padding: 0 4px;
      cursor: pointer;
    }
  }
}
.rank {
  .rank_title {
    line-height: 38px;
    position: relative;
    img {
      width: 34px;
      vertical-align: middle;
    }
  }
  .rank_item {
    display: flex;
    padding: 8px 6px;
    border-bottom: 1px solid #f1f1f1;
    img {
      flex: 0 0 24px;
      width: 20px;
      height: 22px;
      vertical-align: middle;
      margin-right: 4px;
    }
    span.mci {
      width: 22px;
      height: 22px;
      display: inline-block;
      vertical-align: middle;
      background: #ccc;
      text-align: center;
      line-height: 22px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .username {
      flex: 1;
      cursor: pointer;
      &:hover {
        color: $linkcolor;
      }
    }
    .score {
      flex: 0 0 60px;
      text-align: right;
    }
  }
}
.rule {
  float: right;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  z-index: 2;
  &:hover {
    + .rules {
      display: block;
    }
  }
}
.rules {
  border: 1px solid #ddd;
  position: absolute;
  display: none;
  z-index: 1;
  bottom: 37px;
  left: 0;
  background: #fff;
  line-height: 20px;
  font-size: 14px;
  padding: 10px;
  p {
    margin-bottom: 6px;
  }
}
.notice {
  margin: 10px 0;
  background: #fff;
  width: 270px;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  padding: 0 10px 10px;
  border-radius: 6px;
  .notice_title {
    line-height: 40px;
    font-size: 16px;
  }
  img {
    vertical-align: middle;
    margin-right: 2px;
    width: 16px;
  }
  .notice_con {
    border: 1px solid #f1f1f1;
    padding: 14px 10px;
    cursor: pointer;
    font-size: 13px;
    line-height: 20px;
    &:hover {
      color: $linkcolor;
    }
    p {
      font-size: 12px;
      color: #999;
      padding: 2px 0 2px;
      border-bottom: 1px solid #f1f1f1;
      text-align: right;
    }
  }
}
.notice_tab {
  background: chocolate;
  color: #fff;
  padding: 2px 4px;
  border-radius: 4px;
}
.admin {
  // padding: 0 12px;
  background: #fff;
  // background: #ddd;
  border-radius: 8px;
  margin: 10px 2px 10px;
  // padding-top: 40px;
  position: relative;
  .admin_header {
    margin: 0 12px;
    line-height: 36px;
    border-bottom: 1px solid #ddd;
  }
  .admin_item {
    margin: 0 12px;
    line-height: 34px;
    cursor: pointer;
    /*border-bottom: 1px solid #f1f1f1;*/
    .admin_name {
      font-size: 12px;
      font-weight: bold;
      /*cursor: pointer;*/
      color: #666666;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .admin_titles {
    margin: 0;
    padding-left: 12px;
    font-size: 16px;
    position: sticky;
    background: #fff;
    top: 0;
    display: flex;
    justify-content: space-between;
    img {
      width: 22px;
      vertical-align: middle;
    }
    .iconsss {
      margin-right: 10px;
    }
    // background: #f1f1f1;
  }
}
// .iconsss{
//   position: sticky;
//   top: 5px;
//   right: 5px;
// }
.sticky_class {
  height: 140px;
  overflow: hidden;
}
.sticky_nor {
  // width: -moz-calc(100% - 40px);
  // width: -webkit-calc(100% - 40px);
  height: calc(100vh - 480px);
  overflow-y: scroll;
  // height: 100vh;
}
.forummanage {
  float: right;
  padding: 2px 12px;
  background: red;
  opacity: 0.6;
  color: #fff;
  line-height: 24px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
.fensi {
  font-size: 30px;
}
._3XFx6CfPlg-4Usgxm0gK8R {
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}
</style>
