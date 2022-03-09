<template>
  <div class="container">
    <div class="content">
      <div class="nav">
        <img src="../assets/images/rank.png" alt="" />
        <span>Top 100（隔5秒自动刷新）</span>
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
            <div class="title">{{ item.userAO.userName }}</div>
            <p v-if="item.userAO.desc" class="desc">{{ item.userAO.desc }}</p>
          </div>
        </div>
        <div class="right">
          点击奖励
          <p>{{ item.userGetPriceTimes * 10 }} FBi</p>
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
      timer: 0,
    }
  },
  created() {},
  mounted() {
    this.getButtonRank()
    document.title = '春节游戏排行榜'

    let _this = this
    let timer = setInterval(() => {
      _this.getButtonRank()
    }, 5000)
  },
  methods: {
    getButtonRank() {
      api.getButtonRank().then((res) => {
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
    padding: 5px;
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
