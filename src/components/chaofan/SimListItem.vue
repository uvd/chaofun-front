<template>
  <div>
    <div
      v-for="(item, index) in lists"
      :key="index"
      @click.stop="toDetail(item, false)"
      :class="['item', 'infinite-list-item', { 'phone-item': ISPHONE }]"
    >
      <div v-if="!ISPHONE" @click.stop="" class="zan">
        <p :class="[{ up: item.vote != 1 && !ISPHONE }]">
          <img
            v-if="item.vote != 1"
            @click.stop="doZan(1, item, index)"
            src="../../assets/images/icon/up.png"
            alt=""
          />
          <img
            v-if="item.vote == 1 || !ISPHONE"
            @click.stop="doZan(1, item, index)"
            src="../../assets/images/icon/up_active.png"
            alt=""
          />
        </p>
        <p style="padding-left: 0px">{{ item.ups - item.downs }}</p>
        <p :class="[{ down: item.vote != -1 && !ISPHONE }]">
          <img
            v-if="item.vote != -1"
            @click.stop="doZan(2, item, index)"
            src="../../assets/images/icon/down.png"
            alt=""
          />
          <img
            v-if="item.vote == -1 || !ISPHONE"
            @click.stop="doZan(2, item, index)"
            src="../../assets/images/icon/down_active.png"
            alt=""
          />
        </p>
      </div>
      <div v-if="ISPHONE" style="width: 10px"></div>
      <div class="rights" :style="{ width: ISPHONE ? imgMaxWidth + 'px' : '' }">
        <!-- 头部 -->

        <div class="sim_item">
          <div class="sim_img">
            <div
              class="sim_img_r"
              :style="{ 'background-image': `url(${doImageUrl(item)})` }"
            ></div>
          </div>
          <div class="sim_content">
            <div class="title">
              <div v-if="item.isPin" style="display: inline-block">
                <img
                  class="icon icon2"
                  :src="
                    imgOrigin +
                    'biz/daa54c993451a77d3e723405afbcd15c.png?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
                  "
                  alt=""
                />
                <span class="zhiding">版主置顶</span>
              </div>
              <div v-if="item.tags.length" class="tags">
                <div v-for="(it, ins) in item.tags" :key="ins">
                  <span
                    :style="{
                      backgroundColor: it.backgroundColor || '#ff9300',
                      color: it.fontColor || '#fff',
                    }"
                    ># {{ it.name }}</span
                  >
                </div>
              </div>
              <span class="sim_tab"> [{{ doType(item) }}] </span>
              {{ item.title }}
            </div>
            <div class="sim_info">
              <span class="sim_forum">
                {{ item.forum.name }}
              </span>
              <span class="from" style="padding-">
                来自·{{ item.userInfo ? item.userInfo.userName : '测试账号' }}
              </span>
              <span
                v-if="item.userInfo.userTag"
                title="该版块用户的标签"
                style="
                  font-size: 12px;
                  background-color: rgb(237, 239, 241);
                  color: rgb(26, 26, 27);
                  padding-left: 1px;
                "
                >{{ item.userInfo.userTag.data }}</span
              >
              <span class="from">
                大约
                {{
                  moment
                    .duration(moment(item.gmtCreate) - moment())
                    .humanize(true)
                }}
              </span>
              <span class="from" v-if="order == 'comment' && item.gmtComment">
                新评于
                {{
                  moment
                    .duration(moment(item.gmtComment) - moment())
                    .humanize(true)
                }}</span
              >
            </div>
            <div v-if="item.showPreview && item.type != 'link'" class="preview">
              <!-- 图片 -->
              <itemImage v-if="item.type == 'image'" :item="item"></itemImage>

              <div @click.stop="">
                <!-- 视频 -->
                <itemGif
                  @toDetail="toDetail"
                  v-if="item.type == 'gif'"
                  :isDetail="false"
                  :item="item"
                ></itemGif>
                <!-- 内部视频 -->
                <div v-if="item.type == 'inner_video'" class="inner_videoc">
                  <div v-if="!item.play" class="item_video">
                    <div
                      @click="playVideo(index, item, 0)"
                      :class="['inner_prev', { inner_prev_phone: ISPHONE }]"
                    >
                      <img
                        class="coverss"
                        :src="
                          imgOrigin +
                          item.video +
                          '?x-oss-process=video/snapshot,t_0,m_fast,ar_auto'
                        "
                        alt=""
                      />
                      <img
                        class="inner_play"
                        src="../../assets/images/bg/play.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <itemVideo
                    v-if="item.play"
                    @toPause="playVideo"
                    :isDetail="false"
                    :item="item"
                  ></itemVideo>
                </div>
              </div>

              <!-- iframe视频 -->
              <div
                v-if="
                  item.type == 'video' &&
                  item.videoType == 'ifram' &&
                  (!ISPHONE || !item.link.includes('www.acfun.cn'))
                "
                class="item_video"
              >
                <div @click.stop="" class="video">
                  <img
                    v-if="!item.play && item.cover"
                    class="coverss"
                    @click="playVideo(index, item, 0)"
                    :src="
                      imgOrigin +
                      item.cover +
                      '?x-oss-process=image/resize,h_256/format,webp/quality,q_75'
                    "
                    alt=""
                  />
                  <img
                    v-if="!item.play && !item.cover"
                    class="coverss"
                    @click="playVideo(index, item, 0)"
                    src="../../assets/images/bg/videocover.jpg"
                    alt=""
                  />
                  <img
                    v-if="!item.play"
                    class="btn_play"
                    @click="playVideo(index, item, 0)"
                    src="../../assets/images/bg/play.png"
                    alt=""
                  />
                  <iframe
                    v-if="!ISPHONE && item.play"
                    style="width: 100%; min-height: 370px"
                    :src="
                      item.video +
                      (item.link.includes('www.acfun.cn') ? '?' : '') +
                      '&autoplay=true'
                    "
                    allow="autoplay"
                    id="ACPlayer-re"
                    scrolling="no"
                    border="0"
                    frameborder="no"
                    framespacing="0"
                    allowfullscreen="true"
                  ></iframe>
                  <iframe
                    v-if="ISPHONE && item.play"
                    style="width: 100%; height: 230px"
                    :src="
                      item.video +
                      (item.link.includes('www.acfun.cn') ? '?' : '') +
                      '&autoplay=true'
                    "
                    allow="autoplay"
                    id="ACPlayer-re"
                    scrolling="no"
                    border="0"
                    frameborder="no"
                    framespacing="0"
                    allowfullscreen="true"
                  ></iframe>
                </div>
              </div>
              <!-- 富文本 -->
              <itemArticle
                v-if="item.type == 'article'"
                :item="item"
              ></itemArticle>

              <!-- 投票 -->
              <itemVote
                v-if="item.type == 'vote'"
                @callBack="callBack"
                :index="index"
                :item="item"
              ></itemVote>
            </div>
            <div :class="['tools', { tools_p: ISPHONE }]">
              <!-- <div><i class="el-icon-star-on"></i> <span>{{item.ups-item.downs}}</span> 点赞</div> -->
              <div v-if="ISPHONE">
                <span v-if="item.vote != 1" @click.stop="doZan(1, item, index)">
                  <img
                    style="
                      width: 18px;
                      vertical-align: middle;
                      margin-top: -2px;
                    "
                    src="../../assets/images/icon/up.png"
                    alt=""
                  />
                </span>
                <span
                  v-if="item.vote == 1 || !ISPHONE"
                  @click.stop="doZan(1, item, index)"
                >
                  <img
                    style="
                      width: 18px;
                      vertical-align: middle;
                      margin-top: -2px;
                    "
                    src="../../assets/images/icon/up_active.png"
                    alt=""
                  />
                </span>
                <span style="padding: 0 4px">{{ item.ups - item.downs }}</span>
                <span
                  v-if="item.vote != -1"
                  @click.stop="doZan(1, item, index)"
                >
                  <img
                    style="
                      width: 18px;
                      vertical-align: middle;
                      margin-top: -2px;
                    "
                    v-if="item.vote != -1"
                    @click.stop="doZan(2, item, index)"
                    src="../../assets/images/icon/down.png"
                    alt=""
                  />
                  <!-- <span>{{item.downs}}</span> -->
                </span>
                <span
                  v-if="item.vote == -1 || !ISPHONE"
                  @click.stop="doZan(1, item, index)"
                >
                  <img
                    style="
                      width: 18px;
                      vertical-align: middle;
                      margin-top: -2px;
                    "
                    v-if="item.vote == -1 || !ISPHONE"
                    @click.stop="doZan(2, item, index)"
                    src="../../assets/images/icon/down_active.png"
                    alt=""
                  />
                  <!-- <span>{{item.downs}}</span> -->
                </span>
              </div>
              <div @click.stop="toDetail(item, true)">
                <el-icon><el-icon-s-comment /></el-icon>
                <span style="padding: 0 2px">{{ item.comments }} </span> 评论
              </div>
              <el-dropdown @command="handleCommand" trigger="click">
                <span @click.stop="" class="el-dropdown-link">
                  <el-icon><el-icon-share /></el-icon> 分享
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{ type: 'copy', item: item }"
                    v-clipboard:copy="message"
                    v-clipboard:success="onCopy"
                    :icon="ElIconDocumentCopy"
                    >复制链接</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ type: 'share', item: item }"
                    :icon="ElIconSPromotion"
                    >转发到</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ type: 'shareWeibo', item: item }"
                    :icon="ElIconSPromotion"
                    >分享到微博</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <div
                :class="['b_icon', { save_active: item.save }]"
                @click.stop="savePost(item)"
              >
                <el-icon><el-icon-s-help /></el-icon>
                <span style="padding: 0 2px">{{
                  item.save ? '已收藏' : '收藏'
                }}</span>
              </div>
              <div
                v-if="!ISPHONE"
                @click.stop="topreview(item, index)"
                class="looks"
              >
                {{ item.showPreview ? '收起' : doLookType(item) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      @click="toTop"
      :class="[ISPHONE ? 'scroll_to_top_phone' : 'scroll_to_top']"
    >
      <img src="../../assets/images/icon/to_top.png" alt="" />
    </div>
    <forward
      v-if="!ISPHONE && dialogs.dialogVisible"
      :datas="dialogs"
    ></forward>
    <forward-h5
      v-if="ISPHONE && dialogs.dialogVisible"
      :datas="dialogs"
    ></forward-h5>
    <videoDialog v-if="shows" :videoData="videoData"></videoDialog>
  </div>
</template>

<script>
import {
  SComment as ElIconSComment,
  Share as ElIconShare,
  SHelp as ElIconSHelp,
  DocumentCopy as ElIconDocumentCopy,
  SPromotion as ElIconSPromotion,
} from '@element-plus/icons'
import * as api from '@/api/api'

import VueClipboard from 'vue-clipboard2'
import forward from './Forward'
import Vue from 'vue'
import { Dialog } from 'vant'
import videoDialog from './videoDialog'
import 'vant/lib/dialog/style'
Vue.use(VueClipboard)

// import itemTopTitle from "./component/itemTopTitle";
import itemLink from './component/itemLink'
import itemImage from './component/itemImage'
import itemGif from './component/itemGif'
import itemVideo from './component/itemVideo'
import itemIframeVideo from './component/itemIframeVideo'
import itemArticle from './component/itemArticle'
import itemVote from './component/itemVote'
// import itemForwardTitle from "./component/itemForwardTitle";

// import "moment/locale/zh-cn";
import moment from 'moment'

import forwardH5 from '../h5/forward'
export default {
  data() {
    return {
      imgs: ['', '', '', '', ''],
      shows: false,
      videoData: '',
      top: 0,
      canTo: true,
      message: '',
      dialogs: {
        dialogVisible: false,
        data: {},
      },
      moment: moment,
      ElIconDocumentCopy,
      ElIconSPromotion,
    }
  },
  components: {
    forward,
    forwardH5,
    videoDialog,
    // itemTopTitle,
    // itemLink,
    itemImage,
    itemGif,
    itemIframeVideo,
    itemArticle,
    itemVote,
    // itemForwardTitle,
    itemVideo,
    ElIconSComment,
    ElIconShare,
    ElIconSHelp,
  },
  name: 'list-item',
  props: {
    lists: {
      type: Array,
      default() {
        return []
      },
    },
    isindex: {
      type: Boolean,
      default: false,
    },
    pagenum: {
      type: Number,
      default: 1,
    },
    marker: {
      type: String,
      default: '',
    },
    keys: {
      type: String,
      default: '',
    },
    isMy: {
      type: Boolean,
      default: false,
    },
    whichOne: {
      type: String,
      default: '',
    },
    datas: {
      type: Object,
      default() {
        return {}
      },
    },
    order: {
      type: String,
      default: '',
    },
  },
  created() {
    this.top = localStorage.getItem('storedata')
      ? JSON.parse(localStorage.getItem('storedata')).top
      : 0
    this.lists.forEach((item) => {
      if (item.type == 'video') {
        item.play = false
      }
    })
  },
  mounted() {
    if (this.$route.query.time) {
      console.log('this.top', this.top)
      this.$('.infinite-list').animate({ scrollTop: this.top }, 10)
      setTimeout(() => {
        localStorage.removeItem('storedata')
        localStorage.removeItem('spage')
      }, 1000)
    } else {
      localStorage.removeItem('storedata')
      localStorage.removeItem('spage')
    }
  },
  destroyed() {},
  methods: {
    doLookType(item) {
      if (item.type == 'image') {
        return '查看图片'
      } else if (item.type == 'gif') {
        return '查看GIF'
      } else if (item.type == 'inner_video') {
        return '查看视频'
      } else if (item.type == 'link') {
        return '跳转链接'
      } else {
        return '查看'
      }
    },
    topreview(item, index) {
      if (item.type != 'link') {
        item.showPreview = !item.showPreview
        this.lists.splice(index, 1, item)
      } else {
        window.open(item.link, '_blank')
      }
    },
    doType(item) {
      var t = item.type
      switch (t) {
        case 'link':
          return '链接'
          break
        case 'gif':
          return 'GIF'
          break
        case 'image':
          return '图片'
          break
        case 'inner_video':
          return '视频'
          break
        case 'article':
          return '文章'
          break
        case 'vote':
          return '投票'
          break
        case 'prediction':
          return '竞猜'
          break
        case 'forward':
          return '转发'
          break
        default:
          return '其他'
      }
    },
    doImageUrl(item) {
      var t = item.type
      switch (t) {
        case 'link':
        case 'gif':
          return this.doLink(item)
          break
        case 'inner_video':
          return (
            this.imgOrigin +
            item['video'] +
            '?x-oss-process=video/snapshot,t_0,m_fast,ar_auto,h_500'
          )
          break
        case 'article':
          return (
            this.imgOrigin +
            (item.imageName
              ? item.imageName
              : 'biz/b64193b7beca6ae243341273adddf494.png') +
            '?x-oss-process=image/resize,h_120/format,webp/quality,q_75'
          )
          break
        case 'image':
          return (
            this.imgOrigin +
            item.imageName +
            '?x-oss-process=image/resize,h_120/format,webp/quality,q_75'
          )
          break
        case 'vote':
        case 'prediction':
          return (
            this.imgOrigin +
            'biz/fea4efce4437040479d1a0452160f2fd.png?x-oss-process=image/resize,h_120/format,webp/quality,q_75'
          )
          break
        case 'forward':
          return this.doImageUrl(item.sourcePost)
          break
      }
    },
    doLink(item) {
      if (item.cover) {
        if (item.cover.includes('.ico')) {
          return this.imgOrigin + item.cover
        } else {
          return (
            this.imgOrigin +
            item.cover +
            '?x-oss-process=image/resize,h_120/format,webp/quality,q_75'
          )
        }
      } else {
        return (
          this.imgOrigin +
          'biz/b06148ccba2c8b527d979942131a9fd9.png?x-oss-process=image/resize,h_120/format,webp/quality,q_75'
        )
      }
    },
    callBack(index, data) {
      console.log(index, data)
      this.lists.splice(index, 1, data)
    },
    getPostInfo(postId) {
      api.getPostInfo({ postId }).then((res) => {})
    },

    checkoutVote(list) {
      var a = false
      list.forEach((item) => {
        if (item.optionVote) {
          a = true
        }
      })
      return a
    },

    doMoreImgStyle(item, item2) {
      return {
        // 'width':
        height: (231 * item.height) / item.width + 'px',
        'background-image': `url(${this.imgOrigin + item2})`,
      }
    },
    doImgClass(imgs) {
      if (imgs.length == 2 || imgs.length == 4) {
        return 'two_img'
      } else {
        return 'three_img'
      }
    },
    doPlay(e) {
      //  console.log(e)
    },
    playVideo(index, item, t) {
      if (index || index === 0) {
        this.lists.forEach((i) => {
          i.play = false
        })
        item.play = true
        var i = this.lists[index]
        if (t) {
          i.sourcePost = item
        } else {
          i = item
        }
        this.lists.splice(index, 1, i)
      } else {
        console.log('开始暂停------------------------')
        this.lists.forEach((i) => {
          i.play = false
        })
        var a = this.lists[this.lists.length - 1]
        this.lists.splice(this.lists.length - 1, 1, a)
      }
    },
    handleCommand(data) {
      if (data.type == 'copy') {
        this.share(data.item)
      } else if (data.type == 'share') {
        this.doLoginStatus().then((res) => {
          if (res) {
            this.dialogs.data = {
              sourcePostId: data.item.sourcePostId || data.item.postId,
              sourceTitle: data.item.sourcePostId
                ? data.item.sourcePost.title
                : data.item.title,
            }
            this.dialogs.dialogVisible = true
          }
        })
      } else {
        let picurl =
          'https://oss.meibbc.com/gw/img/3380CC9482F74FA89C118FB99F4CE5E7.jpg'
        let url =
          'https://chao.fun/p/' + (data.item.sourcePostId || data.item.postId)
        var sharesinastring =
          'http://v.t.sina.com.cn/share/share.php?title=' +
          data.item.title +
          '&url=' +
          url +
          '（分享来自@炒饭社区）' +
          '&content=utf-8&sourceUrl=' +
          url +
          '&ralateUid=炒饭社区'
        // window.open(sharesinastring, 'newwindow', 'height=400,width=400,top=100,left=100');
        window.open(sharesinastring, '_blank')
      }
    },
    deletePost(index) {
      this.lists.splice(index, 1)
    },
    savePost(item) {
      api.savePost({ postId: item.postId }).then((res) => {
        if (res.success) {
          if (item.save) {
            this.$toast('已取消收藏')
          } else {
            this.$toast('收藏成功')
          }
          item.save = !item.save
          //  this.$message.success("收藏成功")
        } else if (res.errorCode == 'need_login') {
          this.$login({
            callBack: () => {
              this.$store.dispatch('user/getInfo')
            },
          })
        }
      })
    },
    onCopy(e) {
      this.$message.success('内容已复制到剪切板！')
    },
    share(item) {
      this.message = location.origin + '/p/' + item.postId
    },
    toDetail(item, bool) {
      if (this.canTo) {
        if (bool || item.type != 'link') {
          if (this.whichOne) {
            localStorage.setItem('whichOne', this.whichOne)
          }
          this.canTo = false
          let obj = {
            // list: this.lists,
          }
          let top = this.$('.infinite-list').scrollTop()
          console.log('top', top)
          this.$('.infinite-list').animate({ scrollTop: top || '+=0' }, 1000)
          obj.top = top
          obj.forumId = item.forumId
          obj.from = {
            params: this.$route.params,
            query: this.$route.query,
            path: this.$route.path,
          }
          obj.pagenum = this.pagenum
          obj.marker = this.marker
          obj.key = this.keys
          this.postBehavior(item.postId, 'detail')
          try {
            localStorage.setItem('storedata', JSON.stringify(obj))
            localStorage.setItem('spage', this.$route.path)
          } catch (e) {
            console.log(e)
          }

          this.$EventBus.$emit('refreshItemTag', {
            way: 'saveTagId',
          })
          this.$router.push({
            name: 'articleDetail',
            params: { postId: item.postId },
          })
          setTimeout(() => {
            this.canTo = true
          }, 1000)
        } else {
          window.open(item.link, '_blank')
        }
      }
    },
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
    postBehavior(postId, action) {
      api.postBehavior({ postId, action }).then((res) => {})
    },
    toTop() {
      this.$('.infinite-list').animate({ scrollTop: 0 }, 200)
    },
    doZan(v, item, index) {
      if (v == 1) {
        //赞
        if (item.vote != 1) {
          if (item.vote == -1) {
            item.ups += 2
          } else {
            item.ups += 1
          }
          item.vote = 1
          this.lists.splice(index, 1, item)
          api.upvote_post({ postId: item.postId }).then((res) => {})
        } else if (item.vote === 1) {
          item.vote = 0
          item.ups -= 1
          this.lists.splice(index, 1, item)
          api.upvote_post({ postId: item.postId }).then((res) => {})
        }
      } else {
        //踩
        if (item.vote != -1) {
          if (item.vote == 1) {
            item.ups -= 2
          } else {
            item.ups -= 1
          }
          item.vote = -1
          this.lists.splice(index, 1, item)
          api.downvote_post({ postId: item.postId }).then((res) => {})
        } else if (item.vote === -1) {
          item.vote = 0
          item.ups += 1
          this.lists.splice(index, 1, item)
          api.downvote_post({ postId: item.postId }).then((res) => {})
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
@import './css/list.scss';
.scroll_to_top_phone {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 10px;
  bottom: 65px;
  cursor: pointer;
  img {
    width: 100%;
  }
}
.item {
  margin-bottom: 2px;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-right: 10px;
  position: relative;
  overflow: hidden;
  word-break: break-all;
  &:hover .tools .looks {
    display: block;
    color: #1890ff;
  }
  &:hover {
    .icon2 {
      display: none;
    }
    .zhiding {
      display: block;
    }
  }
}
.item .tools_p {
  justify-content: space-between;
}
.item .tools_p div {
  margin-right: 0;
}
.title {
  padding: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  position: relative;
}
.scroll_to_top {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 80px;
  bottom: 120px;
  cursor: pointer;
  img {
    width: 100%;
  }
}
.module_name b {
  // padding-bottom: 2px;
}
.module_name b:hover {
  border-bottom: 1px solid #666;
}
.sim_item {
  display: flex;
  justify-content: space-between;
  .sim_img {
    flex: 0 0 60px;
    height: 60px;
    margin-right: 10px;
    overflow: hidden;
    border-radius: 4px;
  }
  .sim_img_r {
    width: 60px;
    height: 60px;
    text-align: center;
    background-size: cover;
    // background-size: contain;
    // background-size: 100px 90px;
    background-position: center;
    background-repeat: no-repeat;

    transition: all 0.5s;
    img {
      width: auto;
      height: auto;
    }
  }
  &:hover .sim_img_r {
    transform: scale(1.1);
    transition: all 0.5s;
  }
  .sim_content {
    flex: 1;
    // height: 90px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    .title {
      padding-bottom: 4px;
    }
    .sim_tab {
      font-size: 16px;
      color: #888;
      font-weight: normal;
    }
    .sim_info {
      font-size: 12px;
      span {
        padding-left: 10px;
      }
      .sim_forum {
        font-size: 13px;
        padding-left: 0px;
        img {
          width: 30px;
          height: 30px;
        }
      }
      .from {
        color: #999;
      }
    }
  }
}
.item .tools .looks {
  position: absolute;
  right: -10px;
  bottom: 0px;
  margin-right: 0;
  font-size: 12px;
  padding: 0 10px;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
  display: none;
}
.preview {
  // height: 310px;
  margin: 10px 0;
  background: #f1f1f1;
}
.inner_prev {
  height: 320px;
  line-height: 310px;
  position: relative;
  text-align: center;
  background: #000;
  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    vertical-align: middle;
  }
  .inner_play {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 8;
    width: 60px;
    height: 60px;
  }
}
.inner_prev_phone {
  height: 230px;
  line-height: 230px;
}
.inner_videoc {
  min-height: 320px;
}
@media screen and (max-width: 700px) {
  .inner_videoc {
    min-height: 290px;
  }
}
.icon2 {
  width: 20px;
  height: 20px;
  vertical-align: top;
}
.zhiding {
  background: #ff9300;
  color: #fff;
  font-size: 12px;
  padding: 0px 4px;
  border-radius: 4px;
  display: none;
}
.tags {
  margin-bottom: 10px;
  display: inline-block;
  span {
    display: inline-block;
    padding: 2px 6px;
    background: #ff9300;
    border-radius: 4px;
    font-size: 13px;
    color: #fff;
  }
}
</style>
