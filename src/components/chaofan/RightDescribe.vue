<template>
  <div id="rright" class="rright">
    <apply-forum
      :dialogTableVisible="dialogTableVisible"
      @hideFunc="hideApplyForum"
    ></apply-forum>
    <div class="right_content">
      <div v-if="forumInfo" class="asa">
        <div class="forum_con">
          <div class="fir">
            <img
              :src="
                imgOrigin +
                forumInfo.imageName +
                '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
              "
            />
            <div>{{ forumInfo.name }}</div>
          </div>
          <div class="forum_desc">{{ forumInfo.desc }}</div>
          <div class="forum_add">
            <el-button @click="gotoSubmit2" type="primary" block>
              发帖
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="activity.title" @click="toActivity" class="activity">
      <img src="../../assets/images/icon/act.png" alt="" />
      <span></span>
      {{ activity.title }}
      <span class="detail">「点击查看详情」</span>
    </div>
    <!-- /api/v0/activity -->
    <div v-if="!ISPHONE && forumInfo.name !== '关注'" class="tologin">
      <div @click="reload" class="body-right">刷新</div>
      <div v-if="!islogin" @click="gotologin" class="body-right">马上登录</div>
      <!-- <div @click="toUrl({name: 'lists'})" class="body-right">
            全部版块
            <i style="float:right;color:#999;" class="el-icon-arrow-right"></i>
        </div> -->
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
      <!-- <div @click="goto24HForumRank" class="body-right">
          24小时版块排名
        </div>
        <div @click="goto24HUserRank" class="body-right">
          24小时用户排名
        </div> -->
      <!--        <div class="game">-->
      <!--          <div @click="toUrl({url: '/webview/buttonGame', routeType: 1})" class="title">The Button<span class="tab">第二届春节有奖活动</span></div>-->
      <!--          <div @click="toUrl({url: '/webview/buttonGame', routeType: 1})" class="advertise">-->
      <!--            <img src="https://i.chao.fun/biz/84c0bae9c0f3a4b828a9847b736eb4b8.png?x-oss-process=image/resize,h_512/format,webp/quality,q_75" alt="">-->
      <!--          </div>-->
      <!--        </div>-->
    </div>
    <div class="help_con">
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
</template>

<script>
import snake from '@/components/game/snake/snake3.vue'
import * as api from '@/api/api'
import App from '../../App'
import ApplyForum from './ApplyForum'
export default {
  name: '',
  data() {
    return {
      gamemodule: localStorage.getItem('gamemodule'),
      forumId: '',
      gameRank: null,
      dialogTableVisible: false,
      submitForum: '',
      submitForumReason: '',
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
      activity: {},
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
    ApplyForum,
    App,
    snake,
  },
  created() {
    console.log(this.$route.params)
    this.forumId = this.$route.params.forumId
  },
  mounted() {
    // this.getGameTop();
    this.getActivity()
    if (new Date().getDate() == 1) {
      this.gamemodule = true
    }
  },
  methods: {
    toActivity() {
      window.open(this.activity.url)
    },
    getActivity() {
      api.getActivity({}).then((res) => {
        if (res.success && res.data != null) {
          this.activity = res.data
        }
      })
    },

    gotoAddForum() {
      this.dialogTableVisible = true
    },
    getGameTop() {
      api.getGameTop({ top: 10 }).then((res) => {
        this.gameRank = res.data
      })
    },
    inout(v) {
      if (this.$store.state.user.islogin) {
        if (v == 1) {
          // 加入
          api.joinForum({ forumId: this.forumId }).then((res) => {
            if (res.success) {
              this.$message({
                message: '加入成功',
                type: 'success',
                offset: 20,
              })
              this.$emit('getForumInfo')
              // this.getForumInfo()
            }
          })
        } else if (v == 2) {
          api.leaveForum({ forumId: this.forumId }).then((res) => {
            if (res.success) {
              this.$message({
                message: '退出成功',
                type: 'success',
                offset: 20,
              })
              // this.getForumInfo()
              this.$emit('getForumInfo')
            }
          })
        }
      } else {
        this.showLogin('login')
      }
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
    gotoSubmit2() {
      // 发帖
      this.toPost(
        this.forumInfo.id,
        this.forumInfo.name,
        this.forumInfo.imageName
      )

      // console.log(this.forumInfo)
      // if(this.$store.state.user.islogin){
      //   this.$router.push({path: '/submit',query:{id: this.forumInfo.id,name: this.forumInfo.name}})
      // }else{
      //   this.showLogin('login')
      // }
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
      this.dialogTableVisible = false
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
.forum_desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  margin-top: 20px;
}
.rright {
  width: 290px;
  box-sizing: border-box;
  max-height: calc(100vh - 114px);
  padding: 10px;
  // background: rgb(241,241,241);
  overflow: hidden;
  overflow-y: auto;
  .right_content {
  }
  .asa {
    border: 1px solid #f1f1f1;
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
  margin-top: 10px;
  padding: 14px 0;
  background: #fff;
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
.advertise {
  margin: 0px 0;
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

.activity {
  padding: 10px;
  background: #fff;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    text-decoration: underline;
    color: #1890ff;
    .detail {
      color: #f32207;
    }
  }
  img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
  .detail {
    float: right;
    // font-size: 12px;
    color: #1890ff;
  }
}
</style>
