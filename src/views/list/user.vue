<template>
  <div
    id="container"
    class="dashboard-container container infinite-list"
    ref="container"
    :style="{ height: scrollHeight + 'px' }"
  >
    <div>
      <div style="height: 50px"></div>
      <div class="main_content">
        <div v-if="!ISPHONE" class="main_left"></div>
        <div class="main_center">
          <div
            class="grid-content"
            style="
              overflow: auto;
              width: 640px;
              max-width: 100%;
              margin: 0 auto;
            "
          >
            <div class="user_info">
              <div class="avatar">
                <viewer
                  :images="[
                    imgOrigin +
                      (userInfo.icon || '37f1ae45279fac24462a42fd7b849edc.jpg'),
                  ]"
                >
                  <img
                    :src="
                      imgOrigin +
                      (userInfo.icon ||
                        '37f1ae45279fac24462a42fd7b849edc.jpg') +
                      '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
                    "
                    :data-source="
                      imgOrigin +
                      (userInfo.icon || '37f1ae45279fac24462a42fd7b849edc.jpg')
                    "
                    alt=""
                  />
                </viewer>
              </div>
              <div class="info">
                <div v-if="userInfo.userName" class="zhuye nick">
                  {{ userInfo.userName }}
                  <div
                    v-if="userInfo.userId != $store.state.user.userInfo.userId"
                    @click="toAttention(userInfo.focused, userInfo.userId)"
                    :class="['attention', { attentioned: userInfo.focused }]"
                  >
                    {{ userInfo.focused ? '取消关注' : '+关注' }}
                  </div>
                </div>
                <div class="followersFocusUps">
                  <div class="followers" @click="checkout('listFans')">
                    粉丝：{{ userInfo.followers || '0' }}
                  </div>
                  <div class="followers" @click="checkout('listFocus')">
                    关注：{{ userInfo.focus || '0' }}
                  </div>
                  <div class="ups">获赞：{{ userInfo.ups || '0' }}</div>
                </div>
                <div class="desc">
                  {{ userInfo.desc || 'Ta很懒，还没有签名哦~' }}
                </div>
              </div>
            </div>
            <div v-if="badgeList.length" class="badgeList">
              <div
                v-for="badgeInfo in badgeList"
                style="
                  position: relative;
                  margin-left: 20px;
                  margin-right: 20px;
                "
              >
                <el-popover placement="bottom" width="300" trigger="hover">
                  <badgeDetail :badgeInfo0="badgeInfo.badge" />
                  <div slot="reference">
                    <img
                      :src="
                        imgOrigin +
                        'biz/f30227f819eda710024f0f6c99fa60eb.png?x-oss-process=image/resize,h_42/format,webp/quality,q_75'
                      "
                      style="position: absolute; left: -21px"
                    />
                    <img
                      :src="
                        imgOrigin +
                        badgeInfo.badge.icon +
                        '?x-oss-process=image/resize,h_24/format,webp/quality,q_75'
                      "
                      style="
                        position: absolute;
                        top: 14px;
                        left: -12px;
                        border-radius: 50%;
                      "
                      alt=""
                    />
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="mynavs">
              <div
                @click="checkout('pub')"
                :class="['navItem', { active_nav: whichOne == 'pub' }]"
              >
                Ta发布的
              </div>
              <div
                @click="checkout('comment')"
                :class="['navItem', { active_nav: whichOne == 'comment' }]"
              >
                Ta评论的
              </div>
              <div
                @click="checkout('love')"
                :class="['navItem', { active_nav: whichOne == 'love' }]"
              >
                Ta赞过的
              </div>
              <div
                @click="checkout('listFans')"
                :class="['navItem', { active_nav: whichOne == 'listFans' }]"
              >
                关注Ta的
              </div>
              <div
                @click="checkout('listFocus')"
                :class="['navItem', { active_nav: whichOne == 'listFocus' }]"
              >
                Ta关注的
              </div>
            </div>
            <ListItem
              v-if="whichOne == 'pub' || whichOne == 'love'"
              :pagenum="params.pageNum"
              :marker="params.marker"
              :isMy="true"
              :datas="{ type: whichOne }"
              :isindex="true"
              :lists="lists"
            ></ListItem>
            <listComment v-else-if="whichOne == 'comment'" :lists="lists">
            </listComment>
            <attentionItem
              v-for="(item, index) in usersData"
              :item="item"
              :key="index"
            ></attentionItem>
            <load-text
              :hasContent="lists.length || usersData.length ? true : false"
              :ifcanget="ifcanget"
              :loadAll="loadAll"
            ></load-text>
          </div>
        </div>
        <!-- <div v-if="!ISPHONE" class="main_right"></div> -->
      </div>
    </div>
    <!-- <div
        class="container infinite-list"
        ref="container"
        :style="{ height: scrollHeight + 'px' }"
      >
      
        <el-row :gutter="24">
          <el-col :span="isPhone ? 24 : doWidth()" :offset="0">
            <div style="height:50px;"></div>
          
          </el-col>
        </el-row>
      </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '../../api/api'

import listComment from '@/views/list/ListComment'
import ListItem from '../../components/chaofan/ListItem.vue'
import attentionItem from '../../components/chaofan/attentionItem.vue'
import RightCom from '@/components/chaofan/RightCom'
import loadText from '@/components/chaofan/loadText'
import badgeDetail from '@/views/chaofun-webview/badge/badgeDetail.vue'
import { getUserComments } from '../../api/api'

export default {
  name: 'user',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      count: 5,
      lists: [],
      forumId: '',
      params: {
        marker: '',
        pageSize: 40,
        // order: localStorage.getItem('chao.fun.timeline.order') == null ? 'hot': localStorage.getItem('chao.fun.timeline.order')
      },
      options: [
        {
          label: '最热',
          value: 'hot',
        },
        {
          label: '最新',
          value: 'new',
        },
      ],
      isPhone: false,
      forumInfo: null,
      ifcanget: true,
      whichOne: 'pub',
      loadAll: false,
      userInfo: {},
      usersData: [],
      badgeList: [],
    }
  },
  components: {
    ListItem,
    loadText,
    attentionItem,
    badgeDetail,
    listComment,
  },
  watch: {
    '$route.params'(v) {
      console.log(v)
      console.log(2)
    },
  },
  computed: {
    ...mapGetters(['roles', 'islogin']),
  },
  activated() {
    if (this.$route.query.time) {
      this.toPosition()
    }
    if (localStorage.getItem('simple')) {
      let data = JSON.parse(localStorage.getItem('simple'))
      this.lists.forEach((its, index) => {
        if (data.postId == its.postId) {
          this.lists.splice(index, 1, data)
        }
      })
      localStorage.removeItem('simple')
    }
  },
  beforeRouteEnter(to, from, next) {
    // console.log("from", from);
    if (from.path.includes('/p/')) {
    } else {
      localStorage.setItem('whichOne', 'pub')
    }
    // if(from.path.includes('/f/')||from.path.includes('/user/')){
    //   localStorage.setItem('whichOne','pub')
    // }
    next()
  },
  mounted() {
    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    this.toPosition()
    let self = this
    this.$refs.container.addEventListener('scroll', function () {
      let scrollTop = self.$refs.container.scrollTop
      let conTop = self.$refs.container.scrollTop
      // 变量windowHeight是可视区的高度
      let conHeight = self.$refs.container.clientHeight
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = self.$refs.container.scrollHeight - 4
      //  console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
      if (
        conTop + conHeight > scrollHeight ||
        conTop + conHeight == scrollHeight
      ) {
        console.log('到底了')
        if (self.ifcanget) {
          // self.load()
          self.getLists()
        }
      }
    })
  },
  created() {
    let id = this.$route.path.split('/')[2]
    if (!isNaN(id)) {
      this.params.forumId = id
      // this.getLists()
    }
    this.params.userId = this.$route.params.id
    this.userinfo()
    this.getUserBadgeList()
    if (localStorage.getItem('whichOne')) {
      this.whichOne = localStorage.getItem('whichOne')
    }
    this.load()
  },
  methods: {
    getUserBadgeList() {
      api.getUserBadgeList({ userId: this.params.userId }).then((res) => {
        if (res.success) {
          this.badgeList = res.data
        }
      })
    },
    userinfo() {
      api.userinfo({ userId: this.params.userId }).then((res) => {
        if (res.success) {
          this.userInfo = res.data
          document.title = res.data.userName + '的主页 - 炒饭'

          if (res.data.desc) {
            document
              .querySelector('meta[name="description"]')
              .setAttribute('content', res.data.desc)
          }
        } else {
          this.$router.push('/404')
        }
      })
    },
    toAttention(bool, id) {
      if (bool) {
        api.toUnfocus({ focusId: id }).then((res) => {
          if (res.success) {
            this.userInfo.focused = !bool
          }
        })
      } else {
        api.toFocus({ focusId: id }).then((res) => {
          if (res.success) {
            this.userInfo.focused = !bool
          }
        })
      }
    },
    checkout(v) {
      this.loadAll = false
      if (this.whichOne != v) {
        localStorage.setItem('whichOne', v)
        this.params.marker = ''
        this.whichOne = v
        this.lists = []
        this.usersData = []
        this.getLists()
      }
    },
    inout(v) {
      if (this.$store.state.user.islogin) {
        if (v == 1) {
          // 加入
          api.joinForum({ forumId: this.params.forumId }).then((res) => {
            if (res.success) {
              this.$message({
                message: '加入成功',
                type: 'success',
                offset: 20,
              })
              this.getForumInfo()
            }
          })
        } else if (v == 2) {
          api.leaveForum({ forumId: this.params.forumId }).then((res) => {
            if (res.success) {
              this.$message({
                message: '退出成功',
                type: 'success',
                offset: 20,
              })
              this.getForumInfo()
            }
          })
        }
      } else {
        this.showLogin('login')
      }
    },
    changes() {
      localStorage.setItem('chao.fun.timeline.order', this.params.order)
      this.params.pageNum = 1
      this.lists = []
      this.getLists()
    },
    getForumInfo() {
      api.getForumInfo({ forumId: this.params.forumId }).then((res) => {
        this.forumInfo = res.data
      })
    },
    getLists() {
      let params = this.params
      this.ifcanget = false
      if (this.whichOne == 'love') {
        api.getUserUpvotes(params).then((res) => {
          if (res.data.marker) {
            this.params.marker = res.data.marker
            if (res.data.length < this.params.pageSize) {
              this.ifcanget = false
            } else {
              this.ifcanget = true
            }
          } else {
            this.loadAll = true
          }
          this.lists.push(...res.data.posts)
        })
      } else if (this.whichOne == 'comment') {
        api.getUserComments(params).then((res) => {
          if (res.data.marker) {
            this.params.marker = res.data.marker
            if (res.data.length < this.params.pageSize) {
              this.ifcanget = false
            } else {
              this.ifcanget = true
            }
          } else {
            this.loadAll = true
          }
          this.lists.push(...res.data.comments)
        })
      } else if (this.whichOne == 'pub') {
        api.getUserPosts(params).then((res) => {
          if (res.data.marker) {
            this.params.marker = res.data.marker
            if (res.data.length < this.params.pageSize) {
              this.ifcanget = false
            } else {
              this.ifcanget = true
            }
          } else {
            this.loadAll = true
          }
          // this.userInfo = res.data.posts[0].userInfo;
          this.lists.push(...res.data.posts)
        })
      } else if (this.whichOne == 'listFans') {
        params = {
          marker: this.params.marker,
          pageSize: this.params.pageSize,
          focusId: this.userInfo.userId,
        }
        api.listFans(params).then((res) => {
          // var res = {"success":true,"data":{"marker":"16","users":[{"userId":2,"userName":"yzc","icon":"f65dbe1941a8c0547dbb52710f61f957.jpg","ups":431,"followers":null,"focused":false,"gmtCreate":null,"gmtModified":null,"desc":"尘世的繁华掩盖不住心里那一抹伤，满目的浮云带不走隐痛的过往"}],"size":1}};
          if (res.data.marker) {
            this.params.marker = res.data.marker
            if (res.data.length < this.params.pageSize) {
              this.ifcanget = false
            } else {
              this.ifcanget = true
            }
          } else {
            this.loadAll = true
          }
          this.usersData.push(...res.data.users)
        })
      } else if (this.whichOne == 'listFocus') {
        params = {
          marker: this.params.marker,
          pageSize: this.params.pageSize,
          userId: this.userInfo.userId,
        }
        api.listFocus(params).then((res) => {
          if (res.data.marker) {
            this.params.marker = res.data.marker
            if (res.data.length < this.params.pageSize) {
              this.ifcanget = false
            } else {
              this.ifcanget = true
            }
          } else {
            this.loadAll = true
          }
          this.usersData.push(...res.data.users)
        })
      }
    },
    load() {
      // if (localStorage.getItem("storedata")&&localStorage.getItem('spage')==this.$route.path) {
      //   // this.lists = JSON.parse(localStorage.getItem("storedata")).list;
      //   // this.params.marker = JSON.parse(
      //   //   localStorage.getItem("storedata")
      //   // ).marker;
      //   // this.params.key = JSON.parse(localStorage.getItem("storedata")).key;
      //   // console.log("this.params", this.params);
      // } else {
      //   if (this.ifcanget) {
      //     this.getLists();
      //   }
      // }
      if (this.ifcanget) {
        this.getLists()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  // background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.asa {
  background: #fff;
  margin-bottom: 20px;
  // display: flex;
}

.forum_con {
  padding: 10px;
  background: #fff;
  margin-left: 10px;
  margin-bottom: 20px;
  width: 270px;
  display: block;
  box-sizing: border-box;
  // min-height: 300px;
  .fir {
    display: flex;

    img {
      width: 50px;
      height: 50px;
      // border-radius: 50%;
    }

    div {
      flex: 1;
      padding-left: 20px;
      line-height: 50px;
    }
  }

  .fensi {
    display: flex;
    line-height: 24px;
    padding: 20px 0;

    div {
      font-size: 14px;
      color: #666;
      flex: 1;
      text-align: center;
    }

    div:nth-child(1) {
      border-right: 1px solid #ddd;
    }
  }

  .forum_desc {
    color: #666;
    font-size: 14px;
    margin-bottom: 30px;
  }

  .forum_add {
    margin-bottom: 10px;
  }

  .el-button {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin: 10px 0;
  }
}

.el-col {
  // background: #f7f7f7;
}

.mynavs {
  display: flex;
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
}

.navItem {
  padding: 10px 10px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
}

.active_nav {
  color: #1890ff;
}

.badgeList {
  display: flex;
  height: 50px;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
}

.user_info {
  display: flex;
  padding: 10px;
  padding-bottom: 8px;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;

  .avatar {
    flex: 0 0 50px;
    height: 50px;
    margin-right: 10px;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }

  .info {
    flex: 1;
  }

  .desc {
    font-size: 14px;
    color: #999;
  }

  .followersFocusUps {
    display: flex;

    .followers {
      font-size: 14px;
      margin-right: 20px;
      color: #999;
      cursor: pointer;
    }

    .ups {
      font-size: 14px;
      margin-right: 20px;
      color: #999;
    }
  }
}

.zhuye {
  flex: 1;
  line-height: 40px;
  // float: right;
  // position: absolute;
  right: 20px;
  // background: sandybrown;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  padding: 0px;
  border-radius: 20px;
  font-size: 16px;
  // margin-top: 10px;
  // color: #fff;
}

.attention {
  background: orangered;
  color: #fff;
  padding: 0px 12px;
  float: right;
  border-radius: 14px;
  font-size: 14px;
  cursor: pointer;
}

.attentioned {
  background: #ccc;
}
</style>
