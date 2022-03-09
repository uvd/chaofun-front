<template>
  <div class="container">
    <div class="content">
      <div class="nav">
        <img src="../assets/images/rank.png" alt="" />
        <span>Top 100</span>
      </div>
      <div
        @click="toUser(item)"
        v-for="(item, index) in pagedata"
        :key="index"
        class="item"
      >
        <div class="left">
          <img
            :src="
              imgOrigin +
              item.userAO.icon +
              '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
            "
            alt=""
          />
          <div class="info">
            <div>
              <span style="padding-right: 2px">{{ item.userAO.userName }}</span>
              <span
                v-if="item.userAO.userTag"
                title="用户在版块的标签"
                style="
                  font-size: 14px;
                  background-color: rgb(237, 239, 241);
                  color: rgb(26, 26, 27);
                  padiding: 0, 0;
                "
                >{{ item.userAO.userTag.data }}</span
              >
            </div>
            <p v-if="item.userAO.desc" class="desc">{{ item.userAO.desc }}</p>
          </div>
        </div>
        <div class="right">
          积分
          <p>{{ item.tokens }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      pagedata: [],
      params: {
        predictionsTournamentId: '1',
      },
    }
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  created() {},
  mounted() {
    this.params.predictionsTournamentId = this.$route.query.id
    this.getButtonRank()
    document.title =
      (this.$route.query.name ? this.$route.query.name : '') + '竞猜排名'
  },
  methods: {
    getButtonRank() {
      api.getPredictionRank(this.params).then((res) => {
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
  .item {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #f1f1f1;
    // height: 60px;
    // box-sizing: border-box;
    overflow: hidden;
    .left {
      flex: 1;
      display: flex;
      img {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
        vertical-align: middle;
      }
      .title {
        font-size: 16px;
      }
      .desc {
        width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #888;
        font-size: 13px;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
    .right {
      flex: 0 0 60px;
      // line-height: 40px;
      text-align: center;
      font-size: 12px;
      p {
        font-size: 14px;
      }
    }
  }
}
.nav {
  padding: 20px;
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-right: 10px;
  }
  font-size: 18px;
}
</style>
