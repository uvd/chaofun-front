<template>
  <div>
    <div
      v-for="(item, index) in lists"
      :key="index"
      @click.stop="toDetail(item)"
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
      <div v-if="ISPHONE" style="width: 20px"></div>
      <div class="rights" :style="{ width: ISPHONE ? imgMaxWidth + 'px' : '' }">
        <!-- 头部 -->
        <itemTopTitle
          :item="item"
          :isindex="isindex"
          @deletePost="deletePost"
          @doFocued="doFocued"
          :index="index"
          :order="order"
        ></itemTopTitle>
        <div
          v-if="item.type != 'link'"
          :class="[{ title: !item.isPin }, { pin_title: item.isPin }]"
        >
          <!-- <span class="zhiding">置顶</span>  -->
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
          {{ item.title }}
        </div>

        <div v-if="!item.isPin">
          <!-- 链接 -->
          <itemLink
            :isindex="isindex"
            v-if="
              item.type == 'link' ||
              (ISPHONE &&
                item.type == 'video' &&
                item.videoType == 'ifram' &&
                item.link.includes('www.acfun.cn'))
            "
            @click.stop="toUrls(item, { url: item.link, routeType: 1 })"
            :item="item"
          ></itemLink>

          <!-- 图片 -->
          <itemImage
            @toDetail="toDetail"
            v-if="item.type == 'image'"
            :item="item"
          ></itemImage>

          <div @click.stop="">
            <!-- 视频 -->
            <div v-if="!ISPHONE && item.type == 'gif'">
              <itemGif
                @toDetail="toDetail"
                :isDetail="false"
                :item="item"
              ></itemGif>
            </div>

            <div v-if="ISPHONE && item.type == 'gif'" class="inner_videoc">
              <div v-if="!item.play" class="item_video">
                <!-- <div @click.stop="toDetail(item)" class="title">
                    {{ item.title }}
                  </div> -->
                <div
                  @click="playVideo(index, item, 0)"
                  :class="['inner_prev', { inner_prev_phone: ISPHONE }]"
                >
                  <img class="coverss" :src="imgOrigin + item.cover" alt="" />
                  <img
                    class="inner_play"
                    src="../../assets/images/bg/play.png"
                    alt=""
                  />
                </div>
              </div>
              <!-- v-if="item.type == 'gif'" -->
              <itemGif
                @toDetail="toDetail"
                @toPause="playVideo"
                v-if="item.play"
                :isDetail="false"
                :item="item"
              ></itemGif>
            </div>
            <!-- 内部视频 -->
            <div v-if="item.type == 'inner_video'" class="inner_videoc">
              <div v-if="!item.play" class="item_video">
                <!-- <div @click.stop="toDetail(item)" class="title">
                    {{ item.title }}
                  </div> -->
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
            <!-- <div class="title">
                {{ item.title }}
              </div> -->
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
          <itemArticle v-if="item.type == 'article'" :item="item"></itemArticle>

          <!-- 投票 -->
          <itemVote
            v-if="item.type == 'vote'"
            @callBack="callBack"
            :index="index"
            :item="item"
          ></itemVote>

          <!-- 投票 -->
          <itemPrediction
            v-if="item.type == 'prediction'"
            @callBack="callBack"
            :index="index"
            :item="item"
            :isPredictionPage="isPredictionPage"
          ></itemPrediction>

          <!-- 转发 -->
          <div
            v-if="item.type == 'forward'"
            @click="toDetail(item)"
            class="item_forward"
          >
            <!-- <div   -->
            <div @click.stop="toDetail(item.sourcePost)" class="forward_border">
              <!-- 链接 -->
              <itemForwardTitle :item="item"></itemForwardTitle>
              <!-- 链接 -->
              <itemLink
                :isindex="isindex"
                v-if="
                  item.sourcePost.type == 'link' ||
                  (ISPHONE &&
                    item.sourcePost.type == 'video' &&
                    item.sourcePost.videoType == 'ifram' &&
                    item.sourcePost.link.includes('www.acfun.cn'))
                "
                @click.stop="
                  toUrls(item.sourcePost, {
                    url: item.sourcePost.link,
                    routeType: 1,
                  })
                "
                :item="item.sourcePost"
              ></itemLink>
              <div v-if="item.sourcePost.type != 'link'" class="title">
                {{ item.sourcePost.title }}
              </div>
              <!-- 图片 -->
              <itemImage
                @toDetail="toDetail"
                v-if="item.sourcePost.type == 'image'"
                :item="item.sourcePost"
              ></itemImage>
              <!-- 视频 -->
              <itemGif
                v-if="item.sourcePost.type == 'gif'"
                :isDetail="false"
                :item="item.sourcePost"
              ></itemGif>
              <!-- 内部视频 -->
              <itemVideo
                v-if="item.sourcePost.type == 'inner_video'"
                :isDetail="false"
                :item="item.sourcePost"
              ></itemVideo>
              <!-- iframe视频 -->
              <div
                v-if="
                  item.sourcePost.type == 'video' &&
                  item.sourcePost.videoType == 'ifram' &&
                  (!ISPHONE || !item.sourcePost.link.includes('www.acfun.cn'))
                "
                class="item_video"
              >
                <div class="title">
                  {{ item.sourcePost.title }}
                </div>
                <div @click.stop="" class="video">
                  <img
                    v-if="!item.sourcePost.play && item.sourcePost.cover"
                    class="coverss"
                    @click="playVideo(index, item.sourcePost, 0)"
                    :src="
                      imgOrigin +
                      item.sourcePost.cover +
                      '?x-oss-process=image/resize,h_256/format,webp/quality,q_75'
                    "
                    alt=""
                  />
                  <img
                    v-if="!item.sourcePost.play && !item.sourcePost.cover"
                    class="coverss"
                    @click="playVideo(index, item.sourcePost, 0)"
                    src="../../assets/images/bg/videocover.jpg"
                    alt=""
                  />
                  <img
                    v-if="!item.sourcePost.play"
                    class="btn_play"
                    @click="playVideo(index, item.sourcePost, 0)"
                    src="../../assets/images/bg/play.png"
                    alt=""
                  />
                  <iframe
                    v-if="!ISPHONE && item.sourcePost.play"
                    style="width: 100%; min-height: 370px"
                    :src="
                      item.sourcePost.video +
                      (item.sourcePost.link.includes('www.acfun.cn')
                        ? '?'
                        : '') +
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
                    v-if="ISPHONE && item.sourcePost.play"
                    style="width: 100%; height: 230px"
                    :src="
                      item.sourcePost.video +
                      (item.sourcePost.link.includes('www.acfun.cn')
                        ? '?'
                        : '') +
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
                v-if="item.sourcePost.type == 'article'"
                :item="item.sourcePost"
              ></itemArticle>

              <!-- 投票 -->
              <!-- <itemVote v-if="item.sourcePost.type == 'vote'" @callBack="callBack" :index="index" :item="item.sourcePost"></itemVote> -->
              <div class="tools">
                <div>
                  {{ item.sourcePost.ups - item.sourcePost.downs }} 赞 ·
                  {{ item.sourcePost.comments }} 评论
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              item.type != 'video' &&
              item.type != 'link' &&
              item.type != 'image' &&
              item.type != 'gif' &&
              item.type != 'article' &&
              item.type != 'forward' &&
              item.type != 'vote' &&
              item.type != 'inner_video' &&
              item.type != 'prediction'
            "
            @click="toDetail(item)"
            class="item_article"
          >
            <div class="title">
              {{ item.title }}
            </div>
          </div>
        </div>

        <div class="tools">
          <div v-if="ISPHONE">
            <span v-if="item.vote != 1" @click.stop="doZan(1, item, index)">
              <img
                style="width: 18px; vertical-align: middle; margin-top: -2px"
                src="../../assets/images/icon/up.png"
                alt=""
              />
            </span>
            <span
              v-if="item.vote == 1 || !ISPHONE"
              @click.stop="doZan(1, item, index)"
            >
              <img
                style="width: 18px; vertical-align: middle; margin-top: -2px"
                src="../../assets/images/icon/up_active.png"
                alt=""
              />
            </span>
            <span style="padding: 0 10px">{{ item.ups - item.downs }}</span>
            <span v-if="item.vote != -1" @click.stop="doZan(1, item, index)">
              <img
                style="width: 18px; vertical-align: middle; margin-top: -2px"
                v-if="item.vote != -1"
                @click.stop="doZan(2, item, index)"
                src="../../assets/images/icon/down.png"
                alt=""
              />
            </span>
            <span
              v-if="item.vote == -1 || !ISPHONE"
              @click.stop="doZan(1, item, index)"
            >
              <img
                style="width: 18px; vertical-align: middle; margin-top: -2px"
                v-if="item.vote == -1 || !ISPHONE"
                @click.stop="doZan(2, item, index)"
                src="../../assets/images/icon/down_active.png"
                alt=""
              />
            </span>
          </div>
          <div>
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
        </div>
      </div>
    </div>
    <div
      v-if="isShowToTopButton"
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
    <!-- <videoDialog v-if="shows" :videoData="videoData"></videoDialog> -->
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
// import { Dialog } from "vant";
import videoDialog from './videoDialog'
// import "vant/lib/dialog/style";
Vue.use(VueClipboard)

import itemTopTitle from './component/itemTopTitle'
import itemLink from './component/itemLink'
import itemImage from './component/itemImage'
import itemGif from './component/itemGif'
import itemVideo from './component/itemVideo'
import itemIframeVideo from './component/itemIframeVideo'
import itemArticle from './component/itemArticle'
import itemVote from './component/itemVote'
import itemPrediction from './component/itemPrediction'
import itemForwardTitle from './component/itemForwardTitle'

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
      ElIconDocumentCopy,
      ElIconSPromotion,
    }
  },
  components: {
    forward,
    forwardH5,
    videoDialog,
    itemTopTitle,
    itemLink,
    itemImage,
    itemGif,
    itemIframeVideo,
    itemArticle,
    itemVote,
    itemPrediction,
    itemForwardTitle,
    itemVideo,
    ElIconSComment,
    ElIconShare,
    ElIconSHelp,
  },
  name: 'list-item',
  props: {
    isShowToTopButton: {
      type: Boolean,
      default: true,
    },

    isPredictionPage: {
      type: Boolean,
      default: false,
    },
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
      if (item.type == 'video' || (this.ISPHONE && item.type == 'gif')) {
        item.play = false
      }
    })
  },
  mounted() {
    if (this.$route.query.time) {
      // console.log("this.top", this.top);
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
    doFocued(bool, id) {
      this.lists.forEach((it) => {
        if (it.userInfo.userId == id) {
          console.log()
          if (bool) {
            it.userInfo.focused = false
          } else {
            it.userInfo.focused = true
          }
        }
      })
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
    toDetail(item) {
      this.lists.forEach((i) => {
        i.play = false
      })

      if (this.canTo) {
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
        localStorage.setItem('spage', this.$route.path)
        localStorage.setItem('storedata', JSON.stringify(obj))

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
  z-index: 1;
  img {
    width: 100%;
  }
}
.title {
  padding: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  position: relative;
}
.pin_title {
  padding: 0 0 0px 0;
  font-size: 16px;
  font-weight: 600;
  position: relative;
}
.coverss {
  width: 100%;
  height: 300px;
}
.video {
  position: relative;
}
.btn_play {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 20px;
  bottom: 20px;
}
.scroll_to_top {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 80px;
  bottom: 120px;
  cursor: pointer;
  z-index: 1;
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
  min-height: 330px;
}
@media screen and (max-width: 700px) {
  .inner_videoc {
    min-height: auto;
  }
}
/deep/ .item {
  &:hover {
    .icon2 {
      display: none;
    }
    .zhiding {
      display: block;
    }
  }
}
.tags {
  margin-bottom: 10px;
  display: inline-block;
  span {
    display: inline-block;
    vertical-align: middle;
    padding: 2px 6px;
    background: #ff9300;
    border-radius: 4px;
    font-size: 13px;
    color: #fff;
  }
}
</style>
