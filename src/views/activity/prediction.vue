<template>
  <div
    id="container"
    class="dashboard-container container infinite-list"
    ref="container"
  >
    <div>
      <div v-if="!isForumPage" style="height: 50px"></div>
      <div class="main_content">
        <div v-if="!ISPHONE" class="main_left"></div>
        <div v-if="GameInfo" class="main_center">
          <div
            class="grid-content"
            style="
              overflow: auto;
              width: 640px;
              max-width: 100%;
              margin: 0 auto;
            "
          >
            <div class="top_info">
              <div class="t_left">
                <div class="b_title">{{ GameInfo.name }}</div>
                <div v-if="GameInfo.desc" class="b_desc">
                  {{ GameInfo.desc }}
                </div>
              </div>
              <div class="t_right">
                <div
                  @click="joinConfirm"
                  v-if="userData && !userData.userId"
                  class="btnss"
                >
                  立即参与
                </div>
                <div v-if="userData && userData.userId">
                  我的积分： {{ userData.restTokens }}
                </div>
                <div
                  v-if="userData && userData.userId"
                  style="margin-top: 10px"
                >
                  积分排名：{{ selfRank }}
                </div>
              </div>
            </div>

            <el-button
              v-if="ISPHONE"
              @click="toRank"
              style="width: 100%; margin-bottom: 10px"
              type="primary"
              >查看排行</el-button
            >
            <ListItem
              :marker="params.marker"
              :keys="params.key"
              :isindex="false"
              :lists="lists"
              :isPredictionPage="true"
            ></ListItem>
          </div>
        </div>
        <div v-if="!ISPHONE" class="main_right">
          <div class="ranks">
            <div class="r_title">积分排行榜</div>
            <div
              v-for="(its, ind) in ranks"
              :key="ind"
              @click="toUser(its.userAO)"
              class="r_item"
            >
              <span class="ins">{{ ind + 1 }}</span>
              <img class="ava" :src="imgOrigin + its.userAO.icon" alt="" />
              <div style="flex: 1">
                <span class="uname">{{ its.userAO.userName }}</span>
                <span
                  v-if="its.userAO.userTag"
                  title="用户在版块的标签"
                  style="
                    font-size: 14px;
                    background-color: rgb(237, 239, 241);
                    color: rgb(26, 26, 27);
                    padiding: 0, 0;
                  "
                  >{{ its.userAO.userTag.data }}</span
                >
              </div>
              <span class="score">{{ its.tokens }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '../../api/api'

import ListItem from '../../components/chaofan/ListItem.vue'
import attentionItem from '../../components/chaofan/attentionItem.vue'
import RightCom from '@/components/chaofan/RightCom'
import loadText from '@/components/chaofan/loadText'

export default {
  name: 'user',
  data() {
    return {
      ISPHONE:
        document.body.clientWidth > 800 && !navigator.userAgent.includes('iPad')
          ? false
          : true,
      currentRole: 'adminDashboard',
      count: 5,
      lists: [],
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
      userData: null,
      GameInfo: null,
      ranks: [],
      predictionsTournamentId: '',
      selfRank: 0,
    }
  },
  components: {
    ListItem,
    loadText,
    attentionItem,
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
  activated() {},
  props: {
    isForumPage: {
      type: Boolean,
      default: false,
    },
    forumId: {
      type: String,
      default: '',
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.path.includes('/p/')) {
    } else {
      localStorage.setItem('whichOne', 'pub')
    }
    next()
  },
  mounted() {
    this.$EventBus.$on('eventRefresh', () => {
      //需要执行的代码
      this.getScore()
    })
    this.getSelfRank()
  },
  created() {
    this.params.forumId = this.$route.params.forumId || this.forumId
    this.getList()
  },
  methods: {
    getSelfRank() {
      api
        .getSelfRank({ predictionsTournamentId: this.predictionsTournamentId })
        .then((res) => {
          if (res.data) {
            this.selfRank = res.data
          }
        })
    },
    joinConfirm(item, index) {
      this.doLoginStatus().then((res) => {
        if (res) {
          this.$alert(
            '默认会给你本次竞猜活动「1000」积分，只作用于本次有奖竞猜活动(一个活动有多个竞猜)，本次竞猜活动积分不能兑换任何实物,只用于排名。你确定要参加本次竞猜活动?',
            '参加本次竞猜活动？',
            {
              confirmButtonText: '确定',
              callback: (action) => {
                if (action == 'confirm') {
                  api
                    .joinPredictionsTournament({
                      predictionsTournamentId: this.predictionsTournamentId,
                    })
                    .then((res) => {
                      this.getScore(item, index)
                    })
                }
              },
            }
          )
        }
      })
    },
    getScore() {
      if (this.$route.params.id) {
        this.predictionsTournamentId = this.$route.params.id
      }

      let params = {
        predictionsTournamentId: this.predictionsTournamentId,
      }
      api.checkJoin(params).then((res) => {
        if (!res.data) {
          this.userData = {}
        } else {
          this.userData = res.data
        }
      })
    },
    getTotalRank() {
      let params = {
        predictionsTournamentId: this.predictionsTournamentId,
      }
      api.getTotalRank(params).then((res) => {
        this.ranks = res.data
      })
    },
    toRank() {
      window.open(
        location.origin +
          '/webview/prediction/rank?id=' +
          this.GameInfo.id +
          '&name=' +
          this.GameInfo.name
      )
    },
    getGameInfo() {
      api.predictionsGet({ forumId: this.params.forumId }).then((res) => {})
    },
    getList() {
      api.predictionsGet({ forumId: this.params.forumId }).then((res) => {
        if (res.data) {
          this.GameInfo = res.data
          this.predictionsTournamentId = res.data.id
          let params = {
            predictionsTournamentId: res.data.id,
          }

          api.predictionsTournament(params).then((res) => {
            if (res.data.marker && res.data.length != 0) {
              this.ifcanget = true
            }
            if (res.data.marker) {
              params.marker = res.data.marker
            } else {
              if (res.data.length === 0) {
                this.loadAll = true
              }
            }
            if (res.data.length === 0) {
              this.loadAll = true
            }
            if (params.order == 'hot') {
              params.key = res.data.key
            } else {
              delete params.key
            }
            this.lists.push(...res.data)
          })
          this.getScore()
          this.getTotalRank()
          this.getSelfRank()
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.top_info {
  height: 180px;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: space-between;
  background: url('https://i.chao.fun/biz/0dd39345f731e512a2308a9cf20b8926.png');
  .t_left {
    flex: 0 0 1;
    margin-right: 30px;
    .s_title {
      font-size: 16px;
    }
    .b_title {
      font-size: 30px;
      line-height: 36px;
      margin-top: 10px;
      overflow: hidden;

      text-overflow: ellipsis;

      display: -webkit-box;

      -webkit-line-clamp: 2;

      -webkit-box-orient: vertical;
      height: 74px;
    }
    .b_desc {
      font-size: 18px;
      margin-top: 10px;
    }
  }
  .btnss {
    line-height: 36px;
    width: 100px;
    text-align: center;
    border-radius: 30px;
    background: chocolate;
    font-size: 16px;
    cursor: pointer;
  }
}
.ranks {
  width: 270px;
  // height: 700px;
  padding-bottom: 30px;
  background: #fff;
  margin-top: 10px;
  border-radius: 8px;
  .r_title {
    padding: 14px;
    font-size: 18px;
    border-bottom: 1px solid #f1f1f1;
    margin-bottom: 10px;
  }
  .r_item {
    display: flex;
    padding: 8px 14px;
    font-size: 16px;
    line-height: 34px;
    /*cursor: crosshair;*/
    .ava {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      margin: 0 10px;
      vertical-align: middle;
    }
    .uname {
      flex: 1;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 2px;
    }
    .score {
      flex: 0 0 50px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>

<style lang="scss">
.el-message-box {
  width: 90vw;
  max-width: 400px;
}
</style>
