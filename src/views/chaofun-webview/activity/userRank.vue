<template>
  <div class="container">
    <div v-if="!ISPHONE" class="padding"></div>
    <div class="content">
      <div class="nav">
        <img src="../assets/images/rank.png" alt="" />
        <span>24 小时用户排名</span>
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
              item.icon +
              '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
            "
            alt=""
          />
          <div class="info">
            <div class="title">{{ item.userName }}</div>
            <p v-if="item.desc" class="desc">{{ item.desc }}</p>
          </div>
        </div>
        <div class="right">
          <p>第 {{ index + 1 }} 名</p>
        </div>
      </div>
    </div>
    <div v-if="!ISPHONE" class="padding"></div>
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
    }
  },
  created() {},
  mounted() {
    this.getTopUps()
    document.title = '24 小时用户排名'
  },
  methods: {
    getTopUps() {
      console.log('cijianzy')
      api.getUserTopUps({ pageSize: 100 }).then((res) => {
        this.pagedata = res.data
      })
    },
    toUser(item) {
      try {
        window.flutter_inappwebview.callHandler('toAppUser', {
          userId: item.userId + '',
        })
      } catch (e) {
        window.open(location.origin + '/user/' + item.userId, '_blank')
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
.padding {
  height: 60px;
}
.content {
  max-width: 750px;
  margin: 0 auto;
  background: #fff;
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
