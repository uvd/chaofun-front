<template>
  <div>
    <div
      style="
        text-align: right;
        float: right;
        color: #bbb;
        height: 0px;
        cursor: pointer;
        position: relative;
        top: 15px;
        right: 5px;
      "
      @click="humanizeTimeFormatSwitch"
      title="点击切换时间格式"
    >
      <span v-if="humanizeTimeFormat">{{
        moment.duration(moment(items.gmtCreate) - moment()).humanize(true)
      }}</span>
      <span v-else>{{
        moment(items.gmtCreate).format('YYYY年MM月DD日 HH:mm:ss')
      }}</span>
    </div>

    <div v-if="items.type == 'upvote_post'" class="zan">
      <div class="item">
        <!-- <span class="tab">&lt;点赞&gt;</span> -->
        <span
          v-if="items.sender"
          @click.stop="toUser(items.sender)"
          class="username user_name"
          >【{{ items.sender.userName }}】</span
        >
        <span v-if="!items.sender">未登录访客</span>
        <span>点赞了你的</span>
        <span @click="toDetail(items)" class="tiezi_title"
          >【{{
            items.post.title.length > 15
              ? items.post.title.slice(0, 15) + '...'
              : items.post.title
          }}】</span
        >
      </div>
    </div>
    <div v-if="items.type == 'upvote_comment'" class="zan">
      <div class="item">
        <span
          v-if="items.sender"
          @click.stop="toUser(items.sender)"
          class="username user_name"
          >【{{ items.sender.userName }}】</span
        >
        <span v-if="!items.sender">未登录访客</span>
        <span>点赞了你在</span>
        <span @click="toDetail(items)" class="tiezi_title"
          >【{{
            items.post.title.length > 15
              ? items.post.title.slice(0, 15) + '...'
              : items.post.title
          }}】</span
        >
        <span>下的评论</span>
      </div>
    </div>
    <!-- {{items.type}} -->
    <div v-if="items.type == 'comment_post'" class="pinlun">
      <div class="item">
        <span
          v-if="items.sender"
          @click.stop="toUser(items.sender)"
          class="username user_name"
          >【{{ items.sender.userName }}】</span
        >
        <span v-if="!items.sender">未登录访客</span>
        <span>评论了你的</span>
        <span @click="toDetail(items)" class="tiezi_title"
          >【{{
            items.post.title.length > 15
              ? items.post.title.slice(0, 15) + '...'
              : items.post.title
          }}】</span
        >
      </div>
      <div class="comment">
        <!-- <img :src="imgOrigin+items.sender.icon+'?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt=""> -->
        <span></span>评论说： {{ items.comment.text }}<span></span>
      </div>
    </div>
    <div v-if="items.type == 'sub_comment'" class="pinlun">
      <div class="item">
        <span
          v-if="items.sender"
          @click.stop="toUser(items.sender)"
          class="username user_name"
          >【{{ items.sender.userName }}】</span
        >
        <span v-if="!items.sender">未登录访客</span>
        <span>在</span>
        <span @click="toDetail(items)" class="tiezi_title"
          >【{{
            items.post.title.length > 15
              ? items.post.title.slice(0, 15) + '...'
              : items.post.title
          }}】</span
        >
      </div>
      <div class="comment">
        <!-- <span></span>评论说： {{items.comment.text}}<span></span> -->
        <span>
          回复了评论：{{ items.comment.text }}
          <!-- {{items.comment.userInfo.userName}} @ {{items.parentComment.userInfo.userName}} ：{{items.comment.text}} -->
        </span>
      </div>
    </div>
    <div v-if="items.type == 'at'" class="pinlun">
      <div class="item">
        <span
          v-if="items.sender"
          @click.stop="toUser(items.sender)"
          class="username user_name"
          >【{{ items.sender.userName }}】</span
        >
        <span v-if="!items.sender">未登录访客</span>
        在
        <span @click="toDetail(items)" class="tiezi_title"
          >【{{
            items.post.title.length > 15
              ? items.post.title.slice(0, 15) + '...'
              : items.post.title
          }}】</span
        >
        <span>在评论区：</span>
      </div>
      <div class="comment">
        <!-- <img :src="imgOrigin+items.sender.icon+'?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt=""> -->
        <span></span>@你说： {{ items.comment.text }}<span></span>
      </div>
    </div>
    <div v-if="items.type == 'delete_post'" class="zan">
      <div class="item">
        <span>你的帖子 </span>
        <span @click="toDetail(items)" class="tiezi_title"
          >【{{
            items.post.title.length > 15
              ? items.post.title.slice(0, 15) + '...'
              : items.post.title
          }}】</span
        >
        <span>已被删除,</span>
        <span v-if="items.reason">删除原因为：</span>
        <span v-if="!items.reason">请阅读炒饭和分区发帖规范。</span>
      </div>
    </div>
    <div v-if="items.type == 'text_notice'" class="zan">
      <div>
        {{ items.title }}
      </div>
      <div @click="toLinks(items)" class="item links" style="margin-top: 5px">
        <span style="font-weight: bold">{{ items.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
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
    items: {
      type: Object,
      default() {
        return {}
      },
    },
    humanizeTimeFormat: {
      type: Boolean,
      default() {
        return true
      },
    },
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    humanizeTimeFormatSwitch() {
      this.$emit('call-father-humanizeTimeFormatSwitch')
    },

    toLinks(item) {
      if (item.link) {
        window.open(item.link, '_blank')
      }
      // 复制FBi红包口令
      // 接口未返回链接，这里先做特殊判断，祈祷站长别打我...
      else if ('text_notice' == item.type && 'FBi红包创建成功' == item.title) {
        let text = item.text
        let regex = /密钥为 (\w*?) 的 \d*? FBi 红包/
        let found = text.match(regex)
        if (!found || !found[0] || !found[1]) {
          return
        }
        let password = found[1]
        this.pastePasswordAndUrl(password)
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
    pastePasswordAndUrl(password) {
      let str =
        '红包口令：' +
        password +
        '    ' +
        '红包链接：https://chao.fun/webview/fbi/redPacket?password=' +
        password
      this.copy(str)
    },

    copy(content) {
      var input = document.createElement('input')
      input.setAttribute('value', content)
      document.body.appendChild(input)
      input.select()
      var result = document.execCommand('copy')
      document.body.removeChild(input)
      this.$toast('复制成功')
      return result
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.item {
  background: #fff;

  // border-bottom: 1px solid #f1f1f1;
  width: 100%;

  span {
    padding: 0 2px;
  }
}
.pinlun,
.zan {
  padding: 18px 10px;
  background: #fff;
  margin-bottom: 6px;
  border-radius: 4px;
  overflow: hidden;
}
.pinlun {
  // border-bottom: 1px solid #f1f1f1;
  padding-bottom: 10px;
  .item {
    border-bottom: none;
  }
}
.comment {
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 6px;
  border: 1px solid #f1f1f1;
  background: #f1f1f1;
}
.user_name,
.tiezi_title {
  font-weight: normal;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #1890ff;
  }
}
.tiezi_title {
  color: #000;
  font-weight: 600;
  line-height: 20px;
}
.tab {
  color: rgb(255, 147, 0);
}
.links {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
}
</style>
