<template>
  <div class="item">
    <div class="img">
      <img
        :src="
          imgOrigin +
          item.icon +
          '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
        "
        alt=""
      />
    </div>
    <div class="center">
      <div class="name">
        <span @click.stop="toUser(item)">{{ item.userName }} </span>
        <div
          v-if="item.userId != $store.state.user.userInfo.userId"
          @click="toAttention(item.focused, item.userId)"
          :class="['btn', { btn2: item.focused }]"
        >
          {{ item.focused ? '取消关注' : '+关注' }}
        </div>
        <!-- <div @click="toAttention(item.focused,item.userId)" class="btn">+关注</div> -->
      </div>
      <p class="zan">获赞：{{ item.ups }}</p>
      <p class="desc">{{ item.desc || 'Ta有点懒，居然没有签名~' }}</p>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  name: '',
  data() {
    return {
      moment: moment,
    }
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    toAttention(bool, id) {
      if (bool) {
        api.toUnfocus({ focusId: id }).then((res) => {
          if (res.success) {
            this.$set(this.item, 'focused', !bool)
            // this.item.focused = !bool;
          }
        })
      } else {
        api.toFocus({ focusId: id }).then((res) => {
          if (res.success) {
            this.$set(this.item, 'focused', !bool)
            // this.item.focused = !bool;
          }
        })
      }
    },
    toDetail(item) {
      // this.$router.push({name: 'articleDetail',params:{postId: item.post.postId}})
      let routeData = this.$router.resolve({
        name: 'articleDetail',
        params: { postId: item.post.postId },
      })
      window.open(routeData.href, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.item {
  display: flex;
  background: #fff;
  padding: 6px 10px;
  border-bottom: 1px solid #ddd;
  .img {
    flex: 0 0 40px;
    display: flex;
    // align-items: center;
    // justify-content: space-around;
    padding-top: 10px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    padding: 0 10px;
    .name {
      font-size: 15px;
      cursor: pointer;
      span {
        font-weight: bold;
      }
      span:hover {
        text-decoration: underline;
        color: orangered;
      }
    }
    .zan,
    .desc {
      color: #999;
      font-size: 13px;
    }
    .btn {
      float: right;
      padding: 4px 10px;
      background: orangered;
      color: #fff;
      font-size: 12px;
      border-radius: 34px;
    }
    .btn2 {
      background: #ccc;
    }
  }
}
</style>
