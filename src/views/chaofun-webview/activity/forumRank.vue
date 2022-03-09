<template>
  <div class="container">
    <div v-if="!ISPHONE" class="padding"></div>
    <div class="content">
      <div class="nav">
        <img src="../assets/images/rank.png" alt="" />
        <span>24 小时版块排名</span>
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
              item.imageName +
              '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
            "
            alt=""
          />
          <div class="info">
            <div class="title">{{ item.name }}</div>
            <p v-if="item.desc" class="desc">{{ item.desc }}</p>
          </div>
        </div>
        <div class="right">
          <p>第 {{ index + 1 }} 名</p>
          <p
            class="p2"
            v-if="
              item.mods !== undefined &&
              item.mods != null &&
              item.mods.length > 0
            "
          >
            版主：{{ item.mods[0].userName }}
          </p>
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
    this.getForumTopUps()
    document.title = '24 小时用户排名'
  },
  methods: {
    getForumTopUps() {
      console.log('cijianzy')
      api.getForumTopUps({ pageSize: 100 }).then((res) => {
        this.pagedata = res.data
      })
    },
    toUser(item) {
      try {
        window.flutter_inappwebview.callHandler('toAppForum', {
          forumId: item.id + '',
        })
      } catch (e) {
        window.open(location.origin + '/f/' + item.id, '_blank')
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
      // flex: 0 0 180px;
      // line-height: 40px;
      // text-align: center;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      p {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
      }
      .p2 {
        font-size: 13px;
        margin-top: 4px;
        text-align: right;
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
