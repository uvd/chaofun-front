<template>
  <div>
    <div>
      <!-- <component :is="currentRole" /> -->
      <div class="container">
        <el-row :gutter="20">
          <el-col :span="isPhone ? 24 : doWidth()" :offset="isPhone ? 0 : 5">
            <el-select
              v-model="params.order"
              placeholder="请选择"
              @change="changes"
              style="padding: 10px 0"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div
              class="grid-content"
              style="overflow: auto; width: 640px; max-width: 100%"
            >
              <!-- <ListItem :isindex="false" :lists="lists"></ListItem> -->
            </div>
          </el-col>
        </el-row>
      </div>

      <el-dialog
        :visible.sync="centerDialogVisible"
        opacity="1"
        :width="ISPHONE ? '100%' : 'calc(100% - 160px)'"
        :show-close="false"
        :close-on-press-escape="false"
        :class="[{ pc_dialog: !ISPHONE }, { phone_dialog: ISPHONE }]"
        @close="close"
        center
      >
        <div v-if="hasData && pagedata.postId">
          <div class="dialog_top">
            <div class="left">
              <el-icon><el-icon-top /></el-icon>
              <span style="padding: 0 10px">{{
                pagedata.ups - pagedata.downs
              }}</span>
              <el-icon><el-icon-bottom /></el-icon>

              <span class="title">{{ pagedata.title }}</span>
            </div>
            <div @click="back" class="right">关闭</div>
          </div>
          <div
            :class="['dialog_main', { dialog_main2: !ISPHONE }]"
            ref="dialogMainMark"
            style="scroll-behavior: smooth"
          >
            <div
              v-if="!ISPHONE"
              style="
                position: absolute;
                right: 8px;
                bottom: 100px;
                z-index: 9999;
                width: 30px;
                caret-color: transparent;
                background: #f1f1f1;
                border-radius: 15px;
              "
            >
              <el-icon style="font-size: 30px; color: #5cb6ff; cursor: pointer"
                ><el-icon-caret-top
              /></el-icon>
              <el-icon
                style="
                  font-size: 24px;
                  color: #5cb6ff;
                  cursor: pointer;
                  margin-left: 3px;
                  margin-right: 3px;
                  margin-top: 2px;
                "
                ><el-icon-s-comment
              /></el-icon>
              <el-icon
                style="
                  font-size: 24px;
                  color: #5cb6ff;
                  cursor: pointer;
                  margin-left: 3px;
                  margin-right: 3px;
                  margin-top: 2px;
                "
                ><el-icon-refresh-right
              /></el-icon>
              <el-icon
                style="
                  font-size: 30px;
                  color: #5cb6ff;
                  cursor: pointer;
                  margin-top: 2px;
                "
                ><el-icon-caret-bottom
              /></el-icon>
            </div>
            <div class="dialog_main_content">
              <el-row :gutter="20">
                <el-col
                  :span="ISPHONE ? 24 : 17"
                  :offset="isPhone ? 0 : 0"
                  :lg="17"
                  :md="24"
                  :sm="24"
                  :xs="24"
                >
                  <div style="height: 30px"></div>
                  <ListItem :isindex="false" :lists="[pagedata]"></ListItem>
                  <div ref="scrollToCommentEmptyDivMark" />
                  <div :class="['sub_comment', { sub_comment_phone: ISPHONE }]">
                    <div v-show="showAt" class="atuser">
                      <div
                        v-for="(it, ins) in atUsers"
                        :key="ins"
                        @click="chooseAt($event, it)"
                        class="at_item"
                      >
                        {{ it.userName }}
                      </div>
                    </div>
                    <div
                      v-if="replayItem"
                      @click="cancelReplay"
                      style="padding: 6px 0px; cursor: pointer; float: left"
                    >
                      取消回复
                    </div>
                    <el-input
                      :disabled="
                        pagedata.disableComment && !pagedata.forumAdmin
                      "
                      style="font-size: 14px"
                      v-on:focus="inputFocus"
                      @keyup.native="bindInput"
                      v-on:blur="inputBlur"
                      type="textarea"
                      @focus="doLogin"
                      class="textarea"
                      ref="commentInputMark"
                      :placeholder="
                        pagedata.disableComment && !pagedata.forumAdmin
                          ? '该帖已关闭评论功能，只有版主能够评论该帖'
                          : '评论千万条，友善第一条' + ' (Ctrl+V 可粘贴图片)'
                      "
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      v-model="comment"
                    >
                    </el-input>
                    <div class="sub_botton" v-loading="imagesUploading">
                      <div class="subims" v-if="images.length">
                        <a
                          v-for="img in images"
                          :key="img"
                          :href="imgOrigin + img"
                          target="_blank"
                          >[附图]</a
                        >
                      </div>
                      <div></div>
                      <el-button
                        :disabled="
                          pagedata.disableComment && !pagedata.forumAdmin
                        "
                        style="height: 36px"
                        @click="toSub"
                        type="primary"
                        title="快捷键：Ctrl+Enter"
                        >发表</el-button
                      >
                      <el-upload
                        :disabled="
                          pagedata.disableComment && !pagedata.forumAdmin
                        "
                        class="avatar-uploader"
                        action="/api/upload_image"
                        name="file"
                        :data="filedata"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-exceed="handleAvatarExceed"
                        :limit="imagesLimit"
                        multiple
                        accept="image/*"
                        style="display: inline-block"
                        ref="imageUpload"
                      >
                        <img
                          style="
                            vertical-align: middle;
                            margin-right: 10px;
                            cursor: pointer;
                          "
                          src="../../assets/images/icon/choose.png"
                          alt=""
                        />
                      </el-upload>
                      <div class="icons" style="z-index: 1">
                        <img
                          @click="showIcons"
                          src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=105646479,4120396531&fm=26&gp=0.jpg"
                          alt=""
                        />
                        <div class="emoji">
                          <span
                            v-for="(item, index) in icons"
                            @click="chooseEmoji(item)"
                            :key="index"
                            >{{ item }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="comment_list">
                    <div class="comment_title">
                      <el-icon style="font-size: 24px; vertical-align: middle"
                        ><el-icon-s-comment
                      /></el-icon>
                      评论
                      <div @click="checkoutOrder" class="tright">
                        <img
                          :src="
                            imgOrigin +
                            'biz/20712d8583a287b4941d8852af4f15e5.png'
                          "
                          alt=""
                        />
                        {{
                          params.order == 'new'
                            ? '新评'
                            : params.order == 'old'
                            ? '时间'
                            : '热评'
                        }}
                      </div>
                      <div class="tright" style="margin-right: 20px">
                        <el-checkbox
                          v-model="isPostOwnerCommentHighlight"
                          @change="postOwnerCommentHighlightCheckboxChange"
                          title="在“设置”中可设置为默认选中"
                          >高亮楼主评论</el-checkbox
                        >
                      </div>
                      <!--                            用户有异议，暂时先不展示-->
                      <!--                            <div class="tright" style="margin-right: 20px;">-->
                      <!--                              <el-checkbox v-model="withoutSubComment">只看一级评论</el-checkbox>-->
                      <!--                            </div>-->
                    </div>
                    <commentitem
                      ref="commentItemMark"
                      :postInfo="{
                        disableComment: pagedata.disableComment,
                        forumAdmin: pagedata.forumAdmin,
                        postOwnerUserId: pagedata.userInfo.userId,
                        isPostOwnerHighlight: isPostOwnerCommentHighlight,
                      }"
                      @refreshDelete="refreshDelete"
                      @toReplay2="toReplay2"
                      @refreshComment="refreshComment"
                      :treeData="treeData"
                      :without-sub-comment="withoutSubComment"
                    ></commentitem>
                    <div v-if="!lists.length" class="no_comment">
                      还没有评论，你的机会来了 ~
                    </div>
                  </div>
                </el-col>
                <el-col :span="7" :offset="0" class="content-right-wrapper">
                  <div
                    v-if="!ISPHONE"
                    class="grid-content bg-purple content-right"
                  >
                    <div v-if="forumInfo" class="asa">
                      <div class="forum_con">
                        <div
                          v-if="forumInfo.admin"
                          @click="manage"
                          style="
                            position: absolute;
                            right: 20px;
                            width: 40px;
                            color: blue;
                          "
                        >
                          管理
                        </div>
                        <div class="fir">
                          <img
                            :src="
                              imgOrigin +
                              forumInfo.imageName +
                              '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
                            "
                          />
                          <div>{{ forumInfo.name }}</div>
                        </div>
                        <div class="fensi">
                          <div>粉丝：{{ forumInfo.followers }}</div>
                          <div>帖子：{{ forumInfo.posts }}</div>
                        </div>
                        <div class="forum_desc">{{ forumInfo.desc }}</div>
                        <div class="forum_add">
                          <el-button
                            @click="inout(1)"
                            v-if="!forumInfo.joined"
                            type="primary"
                            block
                          >
                            进入版块
                          </el-button>
                          <el-button
                            @click="inout(2)"
                            v-else
                            type="danger"
                            onClick="{outForum}"
                            block
                          >
                            退出版块
                          </el-button>
                        </div>
                        <div class="forum_add">
                          <el-button @click="gotoSubmit" type="primary" block>
                            发帖
                          </el-button>
                        </div>
                        <div v-if="forumInfo.openChat" class="forum_add">
                          <el-button
                            @click="gotoChat"
                            style="width: 100%"
                            type="success"
                            block
                          >
                            加入版聊
                          </el-button>
                        </div>
                      </div>
                    </div>
                    <div v-if="pagedata.collection" class="heji">
                      <div class="col_title">
                        合集：《{{ pagedata.collection.name }}》
                      </div>
                      <div
                        @click="toDetail(it)"
                        v-for="(it, inds) in collectList"
                        :key="inds"
                        class="col_item"
                      >
                        <div
                          :style="{ 'background-image': `url(${doColBg(it)})` }"
                          class="col_img"
                        >
                          <!-- <img src="https://i.chao.fun/biz/de1910aadfac6f7b7fbef647e7ff4b1b.jpeg" alt=""> -->
                        </div>
                        <div class="c_main">
                          <div class="cc_title">
                            <span class="sim_tab">[{{ doType(it) }}]</span>
                            {{ it.title }}
                          </div>
                          <div
                            @click="changeTimeFormat"
                            title="点击切换时间格式"
                          >
                            <span class="from" v-if="humanizeTimeFormat">
                              大约
                              {{
                                moment
                                  .duration(moment(it.gmtCreate) - moment())
                                  .humanize(true)
                              }}
                            </span>
                            <span class="from" v-else>
                              {{
                                moment(it.gmtCreate).format(
                                  'YYYY年MM月DD日 HH:mm:ss'
                                )
                              }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- <RightCom :islogin="islogin"></RightCom> -->
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div v-if="!hasData" class="is404">
          <div>
            <div class="s404">
              <img
                src="https://i.chao.fun/biz/d5eb6aa7ed1fb2a5a0a04abbcc170e03.png"
                alt=""
              />
            </div>
            <p>
              帖子已被删除或不存在
              <span @click="back" class="lookother">看看其他 ></span>
            </p>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  Top as ElIconTop,
  Bottom as ElIconBottom,
  CaretTop as ElIconCaretTop,
  SComment as ElIconSComment,
  RefreshRight as ElIconRefreshRight,
  CaretBottom as ElIconCaretBottom,
} from '@element-plus/icons'
import { mapGetters, mapState } from 'vuex'
import * as api from '../../api/api'
import ListItem from '../../components/chaofan/ListItemWidth.vue'
import RightCom from '@/components/chaofan/RightCom'
// import "moment/locale/zh-cn";
import moment from 'moment'
import commentitem from '@/components/chaofan/commentItem'
export default {
  components: {
    ListItem,
    RightCom,
    commentitem,
    ElIconTop,
    ElIconBottom,
    ElIconCaretTop,
    ElIconSComment,
    ElIconRefreshRight,
    ElIconCaretBottom,
  },
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      withoutSubComment: false,
      isPostOwnerCommentHighlight: false,
      hasData: true,
      currentRole: 'adminDashboard',
      count: 5,
      lists: [],
      forumId: '',
      params: {
        postId: '',
        pageNum: 0,
        pageSize: 100,
        //order: 'hot'
        order:
          'new' ==
          localStorage.getItem('chao.fun.localSetting.commentOrderType')
            ? 'new'
            : 'old' ==
              localStorage.getItem('chao.fun.localSetting.commentOrderType')
            ? 'old'
            : 'hot',
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
      centerDialogVisible: true,
      pagedata: {},
      comment: '',
      moment: moment,
      icons: [
        '😀',
        '😃',
        '😁',
        '😆',
        '😅',
        '🤣',
        '😂',
        '🙂',
        '🙃',
        '😉',
        '😊',
        '😇',
        '😍',
        '😘',
        '🤪',
        '😝',
        '👍',
        '🤝',
        '🙏',
        '💪',
        '👏',
        '✍️',
        '💔',
        '👮‍♂️',
        '☠️',
        '👽',
      ],
      showIcon: false,
      replayItem: null,
      treeData: [],
      userinfo: this.$store.state.user.userInfo,
      canSub: true,
      images: [],
      filedata: {},
      imagesUploading: false,
      imagesNum: 0,
      imagesLimit: 9,
      collectList: [],
      atUsers: [],
      showAt: false,
      canSearch: true,
      curInput: '',
      ats: [],
      pointIndex: '',
      atIndex: '',
      searchkey: '',
      atUserName: [],
    }
  },
  watch: {},
  computed: {
    ...mapGetters(['roles', 'islogin']),
    ...mapState(['var']),
  },
  mounted() {
    if (
      'true' ==
      localStorage.getItem(
        'chao.fun.localSetting.isStoragePostOwnerCommentHighlight'
      )
    ) {
      this.isPostOwnerCommentHighlight =
        'true' ==
        localStorage.getItem(
          'chao.fun.localSetting.isPostOwnerCommentHighlight'
        )
    }

    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    if (window.history && window.history.pushState) {
      console.log(this.var.path404 == this.$route.fullPath)
      if (this.var.path404 == this.$route.fullPath) {
        history.pushState(null, null, '/')
        window.addEventListener('popstate', this.onCloseModal, false)
      }
    }
    this.$EventBus.$on('eventRefresh', () => {
      //需要执行的代码
      this.getDetail()
    })
    // 创建键盘监听事件
    addEventListener('keydown', this.keyDown)
  },
  created() {
    let params = this.$route.params
    this.params.postId = params.postId
    this.getDetail()
    this.getLists()
  },
  beforeMount() {
    this.inputBlur()
  },
  methods: {
    scrollToTop() {
      this.$refs.dialogMainMark.scrollTop = 0
    },

    scrollToEnd() {
      this.$refs.dialogMainMark.scrollTop =
        this.$refs.dialogMainMark.scrollHeight
    },

    scrollToComment() {
      this.$refs.dialogMainMark.scrollTop =
        this.$refs.scrollToCommentEmptyDivMark.offsetTop + 100

      // bug：会使整个dialog上移，致使顶部title看不到，然后底部会空白一部分。且该bug仅在部署后出现，本地调试未发现问题。
      // 未找到该bug的原因，猜想是title的index比空白div高，然后scrollIntoView的原因。
      // this.$refs.scrollToCommentEmptyDivMark.scrollIntoView();
    },

    postOwnerCommentHighlightCheckboxChange(val) {
      if (
        'true' ==
        localStorage.getItem(
          'chao.fun.localSetting.isStoragePostOwnerCommentHighlight'
        )
      ) {
        localStorage.setItem(
          'chao.fun.localSetting.isPostOwnerCommentHighlight',
          val
        )
      }
    },

    checkoutOrder() {
      if (this.params.order == 'hot') {
        this.params.order = 'new'
      } else if (this.params.order == 'new') {
        this.params.order = 'old'
      } else {
        this.params.order = 'hot'
      }
      this.getLists()
    },
    chooseAt(e, it) {
      // this.comment = this.comment+it.userName+' ';
      if (this.searchkey) {
        this.comment = this.comment.replace(
          '@' + this.searchkey,
          '@' + it.userName + ' '
        )
      } else {
        this.comment = this.comment + it.userName + ' '
      }
      this.searchkey = ''
      this.showAt = false
      this.ats.push(it.userId)
      this.atUserName.push('@' + it.userName)
      console.log('this.atUserName', this.atUserName)
      console.log(this.$(this.curInput))
      this.$(this.curInput).focus()
      // this.curInput
    },
    bindInput(e) {
      console.log(e)
      // let last = e.slice(-1);
      // console.log(last);
      // document.getElementById('')
      let index = e.target.selectionStart //光标位置
      this.pointIndex = index
      if (this.comment[index - 1] != '@') {
        this.showAt = false
      }
      if (this.comment.includes('@')) {
        this.curInput = e.target
        let s = this.comment.slice(0, index)

        let i = s.lastIndexOf('@')
        // if(index==i){return false}
        let str = this.comment.slice(i + 1, index)
        let isHave = str.includes(' ')
        if (!isHave) {
          this.atIndex = i
          let params = {
            keyword: str,
          }
          this.searchkey = str
          if (this.canSearch) {
            this.canSearch = false
            api
              .searchUserForAt(params)
              .then((res) => {
                if (res.success && res.data.length) {
                  this.canSearch = true
                  this.showAt = true
                  this.atUsers = res.data
                } else {
                  this.canSearch = true
                  this.showAt = false
                  this.atUsers = res.data
                }
              })
              .catch((e) => {
                this.canSearch = true
              })
          }
        }
        if (e.code == 'Backspace' && this.atUserName.length) {
          this.atUserName.forEach((item, ins) => {
            if (item.includes('@' + str) && item.slice(0, -1) == '@' + str) {
              this.ats.splice(ins, 1)
              this.atUserName.splice(ins, 1)
              console.log(this.ats, this.atUserName)
            }
          })
        }
        console.log(str)
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
        case 'forward':
          return '转发'
          break
        default:
          return '其他'
      }
    },
    toDetail(item) {
      this.$router.push({
        name: 'articleDetail',
        params: { postId: item.postId },
      })
    },
    doColBg(it) {
      // imgOrigin+it.imageName
      return this.doImageUrl(it)
    },
    listPosts() {
      if (!this.pagedata.collection) {
        return
      }
      let params = {
        collectionId: this.pagedata.collection.id,
      }
      api.listPosts(params).then((res) => {
        this.collectList = res.data
      })
    },
    doImageUrl(item) {
      var t = item.type
      // debugger
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
          if (item.imageName) {
            return (
              this.imgOrigin +
              item.imageName +
              '?x-oss-process=image/resize,h_150/format,webp/quality,q_75'
            )
          } else {
            return (
              this.imgOrigin +
              'biz/b64193b7beca6ae243341273adddf494.png?x-oss-process=image/resize,h_150/format,webp/quality,q_75'
            )
          }
          break
        case 'image':
          return (
            this.imgOrigin +
            item.imageName +
            '?x-oss-process=image/resize,h_150/format,webp/quality,q_75'
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
            '?x-oss-process=image/resize,h_150/format,webp/quality,q_75'
          )
        }
      } else {
        return (
          this.imgOrigin +
          'biz/b06148ccba2c8b527d979942131a9fd9.png?x-oss-process=image/resize,h_150/format,webp/quality,q_75'
        )
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.images.push(res.data)
      } else if (res.errorCode == 'invalid_content') {
        // this.imageUrl = ''
        this.$toast(res.errorMessage)
      }
      this.imagesNum--
      if (!this.imagesNum) {
        this.imagesUploading = false
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
        return false
      }
      this.imagesNum++
      this.imagesUploading = true
      this.filedata.fileName = file.name
      return true
    },
    handleAvatarExceed(files, fileList) {
      this.$message.warning({
        message: `当前限制选择 ${this.imagesLimit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
        duration: 2500,
      })
    },
    refreshDelete(item) {
      console.log('item', item)
      let idx = -1
      item.text = '[已删除]'
      this.lists.forEach((it, index) => {
        console.log(it)
        console.log(index)
        if (it.id == item.id) {
          idx = index
          this.lists.splice(index, 1, item)
        }
      })
      this.treeData = this.transformTree(this.lists)
    },
    refreshComment(obj) {
      this.lists.push(obj)
      this.treeData = this.transformTree(this.lists)
    },
    cancelReplay() {
      this.replayItem = null
    },
    toReplay2(item) {
      this.replayItem = item
    },
    doLogin() {
      this.doLoginStatus().then((res) => {
        if (res) {
        } else {
          console.log('未登录', res)
        }
      })
    },
    showIcons() {
      this.showIcon = true
    },
    chooseEmoji(item) {
      if (!this.pagedata.disableComment || this.pagedata.forumAdmin) {
        this.comment += item
        this.showIcon = false
      }
    },
    manage() {
      this.$router.push({ path: '/f/' + this.forumInfo.id + '/setting' })
    },
    doZan(v, item) {
      if (v == 1) {
        if (item.vote != 1) {
          if (item.vote == -1) {
            item.ups += 2
          } else {
            item.ups += 1
          }
          item.vote = 1
        } else if (item.vote === 1) {
          item.vote = 0
          item.ups -= 1
        }
        // this.lists.splice(index, 1, item);
        api.upvote_post({ postId: item.postId }).then((res) => {})
      } else {
        if (item.vote != -1) {
          if (item.vote == 1) {
            item.ups -= 2
          } else {
            item.ups -= 1
          }
          item.vote = -1
        } else if (item.vote === -1) {
          item.vote = 0
          item.ups += 1
        }
        api.downvote_post({ postId: item.postId }).then((res) => {})
      }
    },
    doZan2(v, item, index) {
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
    inout(v) {
      let self = this
      this.$router.replace({ path: `/f/${this.forumInfo.id}` })
      // this.doLoginStatus().then(resolve=>{
      //     if(resolve){
      //         if(v==1){
      //             // 加入
      //             api.joinForum({forumId: self.forumInfo.forumId}).then(res=>{
      //                 if(res.success){
      //                 self.$message({
      //                     message: '加入成功',
      //                     type: 'success',
      //                     offset: 20
      //                 });
      //                 self.getForumInfo()
      //                 }
      //             })
      //         }else if(v==2){
      //             api.leaveForum({forumId: self.forumInfo.forumId}).then(res=>{
      //                 if(res.success){
      //                 self.$message({
      //                     message: '退出成功',
      //                     type: 'success',
      //                     offset: 20
      //                 });
      //                 self.getForumInfo()
      //                 }
      //             })
      //         }
      //     }
      // })
    },
    gotologin() {
      this.showLogin('login')
    },
    showLogin(v) {
      this.$login({
        callBack: () => {
          this.$store.dispatch('user/getInfo')
        },
      })
    },
    gotoSubmit() {
      // 发帖
      this.toPost(
        this.forumInfo.id,
        this.forumInfo.name,
        this.forumInfo.imageName
      )
      // if(this.$store.state.user.islogin){
      //   this.$router.push({path: '/submit',query:{id: this.forumInfo.id,name:this.forumInfo.name}})
      // }else{
      //   this.showLogin('login')
      // }
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
    format(jsonData) {
      var result = [],
        temp = {},
        i = 0,
        j = 0,
        len = jsonData.length
      for (var i = 0; i < len; i++) {
        console.log(temp)
        temp[jsonData[i]['id']] = jsonData[i].parentId // 以id作为索引存储元素，可以无需遍历直接定位元素
      }
      for (var j = 0; j < len; j++) {
        var currentElement = jsonData[j]
        var tempCurrentElementParent = temp[currentElement['parentId']] // 临时变量里面的当前元素的父元素 parentId 父级ID
        if (tempCurrentElementParent) {
          // 如果存在父元素
          if (!tempCurrentElementParent['children']) {
            // 如果父元素没有chindren键
            tempCurrentElementParent['children'] = [] // 设上父元素的children键
          }
          tempCurrentElementParent['children'].push(currentElement) // 给父元素加上当前元素作为子元素
        } else {
          // 不存在父元素，意味着当前元素是一级元素
          result.push(currentElement)
        }
      }

      return result
    },
    transformTree(list) {
      const tree = []

      for (let i = 0, len = list.length; i < len; i++) {
        if (!list[i].parentId) {
          const item = this.queryChildren(list[i], list)

          tree.push(item)
        }
      }

      return tree
    },
    gotoChat() {
      this.doLoginStatus().then((res) => {
        if (res) {
          localStorage.setItem('wsForum', JSON.stringify(this.forumInfo))
          if (this.$store.state.user.showChatBox) {
            this.$store.dispatch('user/SET_showChatBox', false)
            setTimeout(() => {
              this.$store.dispatch('user/SET_showChatBox', true)
            }, 500)
          } else {
            this.$store.dispatch('user/SET_showChatBox', true)
          }
        }
      })
    },

    queryChildren(parent, list) {
      const children = []

      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].parentId === parent.id) {
          const item = this.queryChildren(list[i], list)

          children.push(item)
        }
      }

      if (children.length) {
        parent.children = children
      }

      return parent
    },
    getDetail() {
      api.getPostInfo({ postId: this.params.postId }).then((res) => {
        if (res.success) {
          let data = res.data
          this.pagedata = data
          this.forumInfo = res.data.forum
          console.log(res.data.forum, 'res')
          document.title = res.data.title + ' - 炒饭'
          this.listPosts()
        } else {
          this.hasData = false
          this.$store.commit('var/SET_PATH', this.$route.fullPath)
        }
      })
    },

    async getNewLists() {
      await this.getLists()
      this.$toast('评论已刷新')
    },
    getLists() {
      let params = this.params
      api.listCommentsV0(params).then((res) => {
        if (res.data.length) {
          this.lists = []
          this.lists.push(...res.data)
          let data = this.lists
          this.treeData = this.transformTree(data)
        }
      })
    },

    back() {
      if (this.forumInfo && this.forumInfo.id) {
        this.centerDialogVisible = false
      } else {
        location.href = 'https://chao.fun'
      }
    },
    close(e) {
      // 不存在的情况特殊处理
      if (!this.hasData) {
        this.back()
        return
      }
      localStorage.setItem('simple', JSON.stringify(this.pagedata))
      if (localStorage.getItem('storedata')) {
        const obj = JSON.parse(localStorage.getItem('storedata'))
        // TODO: 优化缓存方式
        // 判断如果缓存论坛ID不一致那么不读取缓存
        if (this.forumInfo.id !== obj.forumId) {
          this.$router.replace({ path: `/f/${this.forumInfo.id}` })
          return
        }
        const { params, query } = obj.from
        query.time = new Date().getTime()
        this.$router.replace({ path: obj.from.path, params, query })
      } else {
        this.$router.replace({ path: `/f/${this.forumInfo.id}` })
      }
    },
    doZanComment(v, item) {
      if (v == 1) {
        api.upvoteComment({ commentId: item.id }).then((res) => {
          item.ups += 1
        })
      } else {
        api.downvoteComment({ commentId: item.id }).then((res) => {
          item.ups -= 1
        })
      }
    },
    toSub() {
      if (this.canSub) {
        this.doLoginStatus().then((res) => {
          let comment = this.comment

          if (res) {
            console.log('comment')
            console.log(this.comment)
            console.log('images')
            console.log(this.images)
            if (!this.comment && (!this.images || this.images == 0)) {
              this.$toast('内容为空, 请输入内容')
              return
            }
            let reg = new RegExp(/@[^(\s)]+/g)
            let a = comment.match(reg)
            console.log(a)
            var ats = []
            if (a) {
              a.forEach((item, index) => {
                if (this.atUserName.includes(item)) {
                  let i = this.atUserName.findIndex((it) => it == item)
                  ats.push(this.ats[i])
                }
              })
              console.log('atc', ats)
              console.log(this.ats)
              console.log(this.atUserName)
            }

            let params = {
              parentId:
                this.replayItem && this.replayItem.id ? this.replayItem.id : '',
              postId: this.params.postId,
              comment: this.comment,
              imageNames: this.images.join(','),
              ats: ats.join(','),
            }
            this.canSub = false
            console.log(params)
            api.addComments(params).then((res) => {
              if (res.success) {
                this.images = []
                this.$toast('评论成功')
                setTimeout(() => {
                  // 先直接获取，后面评论多了再优化
                  // if(this.replayItem){
                  //   this.lists.push({
                  //     parentId: this.replayItem?this.replayItem.id:0,
                  //     text: comment,
                  //     type: 'text',
                  //     downs: 0,
                  //     ups: 0,
                  //     userInfo: this.userinfo
                  //   })
                  // }else{
                  //   this.lists.unshift(res.data)
                  // }
                  this.getLists()
                  this.comment = ''
                  this.canSub = true
                }, 1500)
              } else {
                this.canSub = true
                this.$toast(res.errorMessage)
              }
            })
          } else {
            console.log('未登录', res)
          }
        })
      } else {
        this.$toast('正在提交评论...')
        return
      }
    },
    toPaste(e) {
      var cbd = e.clipboardData
      var ua = window.navigator.userAgent
      console.log(this.$refs.imageUpload)
      if (!(e.clipboardData && e.clipboardData.items)) {
        return
      }
      if (
        cbd.items &&
        cbd.items.length === 2 &&
        cbd.items[0].kind === 'string' &&
        cbd.items[1].kind === 'file' &&
        cbd.types &&
        cbd.types.length === 2 &&
        cbd.types[0] === 'text/plain' &&
        cbd.types[1] === 'Files' &&
        ua.match(/Macintosh/i) &&
        Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49
      ) {
        return
      }
      // for(var i = 0; i < cbd.items.length; i++) {
      var item = cbd.items[cbd.items.length - 1]
      if (item.kind == 'file' && /^image\/[a-z]*$/.test(item.type)) {
        var blob = item.getAsFile()
        if (blob.size === 0) {
          return
        }
        this.$refs.imageUpload.$children[0].uploadFiles([blob])
      }
      // }
    },
    inputFocus() {
      document.addEventListener('paste', this.toPaste)
    },
    inputBlur() {
      document.removeEventListener('paste', this.toPaste)
    },
    // 修改时间格式
    changeTimeFormat() {
      this.humanizeTimeFormat = !this.humanizeTimeFormat
    },
    keyDown(e) {
      if (e.keyCode == 13) {
        if (e.altKey || e.shiftKey) {
          return
        }
        if (e.ctrlKey) {
          // 发表：快捷键Ctrl+Enter
          // 仅在输入框有焦点时生效
          if (
            this.$refs.commentItemMark &&
            this.$refs.commentItemMark.getCommentInputFocused()
          ) {
            this.$refs.commentItemMark.getCommentInputFocused().toSub()

            // this.$refs.commentItemMark.getCommentInputFocused().toSub();
            // this.$refs.commentItemMark.toSub();
            e.preventDefault()
            return
          } else if (
            this.$refs.commentInputMark &&
            this.$refs.commentInputMark.focused
          ) {
            this.toSub()
            e.preventDefault()
            return
          }
          return
        } else {
          // 子评论有焦点时
          if (
            this.$refs.commentItemMark &&
            this.$refs.commentItemMark.getCommentInputFocused()
          ) {
            return
          }
          // 评论获取焦点：快捷键Enter
          if (
            this.$refs.commentInputMark &&
            !this.$refs.commentInputMark.focused
          ) {
            this.$refs.commentInputMark.focus()
            e.preventDefault()
            return
          }
          return
        }
      } else if (e.keyCode == 112) {
        if (e.altKey || e.shiftKey || e.ctrlKey) {
          return
        }
        this.scrollToTop()
        e.preventDefault()
        return
      } else if (e.keyCode == 113) {
        if (e.altKey || e.shiftKey || e.ctrlKey) {
          return
        }
        this.scrollToComment()
        e.preventDefault()
        return
      } else if (e.keyCode == 114) {
        if (e.altKey || e.shiftKey || e.ctrlKey) {
          return
        }
        this.scrollToEnd()
        e.preventDefault()
        return
      } else if (e.keyCode == 115) {
        if (e.altKey || e.shiftKey || e.ctrlKey) {
          return
        }
        this.getNewLists()
        e.preventDefault()
        return
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.asa {
  background: #fff;
  margin-bottom: 20px;
}
/deep/ .el-dialog__wrapper {
  overflow-x: hidden;
}
.asa {
  // display: flex;
  // flex-direction: row-reverse;
  .forum_con {
    padding: 30px 20px;
    border: 1px solid #f1f1f1;
    // width: 100%;
    // min-width: 270px;
    width: 270px;
    box-sizing: border-box;
  }
}
/deep/ .item .rights {
  padding-right: 0;
}
.el-dialog {
  height: 100vh;
  overflow-x: hidden;
  div {
    margin: 0;
    padding: 0;
    text-align: left;
  }
}
/deep/ .el-dialog--center .el-dialog__body {
  padding: 0;
}
/deep/ .el-loading-spinner {
  top: 10%;
}
/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog {
  margin-top: 0 !important;
}
/deep/ .pc_dialog {
  height: 100vh;
  overflow-y: hidden;
  .el-dialog {
    max-width: 1280px;
  }
}
.dialog_top {
  position: absolute;
  z-index: 2;
  // width: calc(80% - 20px);
  width: 100%;
  // left: 10%;
  display: flex;
  background: #000;
  div {
    color: #fff;
    padding: 10px 20px;
    box-sizing: border-box;
  }
  .left {
    flex: 1;
    height: 54px;
    line-height: 34px;
    // text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // line-clamp: 2;
    // -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .title {
      padding-left: 20px;
    }
  }
  .right {
    flex: 0 0 70px;
    line-height: 34px;
    cursor: pointer;
    text-align: center;
  }
}
.dialog_main {
  padding: 30px !important;
  height: 100vh;
  overflow-y: scroll;
  background: #fff;
  box-sizing: border-box;
  overflow-x: hidden;
  // .dialog_main_content{
  //   // border: 1px solid #f1f1f1;
  // }
}
.dialog_main2 {
  // width: 1200px;
  // width: 80%;
  // border: 1px solid #f1f1f1;
  margin: 0 auto !important;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 8px;
    // height: 44px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    padding: 0;
    width: 8px;
    height: 44px;
    // background-color: rgba(0, 0, 0, .2);
    background-color: $linkcolor;
  }
  .asa {
    .forum_con {
      padding: 30px 20px;
      border: 1px solid #f1f1f1;
      // width: 100%;
      width: 270px;
      box-sizing: border-box;
    }
  }
}
/deep/ .item {
  padding: 20px 0 !important;
}
.content-right {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/deep/ .light {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.sub_comment {
  padding: 10px 0 0 50px !important;
  position: relative;
  .atuser {
    position: absolute;
    top: 70px;
    left: 50px;
    background: #fff;
    border: 1px solid #ddd;
    z-index: 10;
    padding: 10px 0;
    width: 100px;
    .at_item {
      padding: 0 10px;
      line-height: 28px;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      &:hover {
        color: #ff9300;
        background: #eee;
      }
    }
    // display: flex;
  }
  .textarea {
    resize: none;
    font-size: 16px;
  }
  .sub_botton {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    padding: 20px 20px 0;
    .subims {
      position: absolute;
      left: 0;
      top: 20px;
      a {
        + a {
          margin-left: 6px;
        }
      }
    }
    .icons {
      padding: 4px 20px 0;
      text-align: right;
      height: 60px;
      &:hover {
        flex: 1;
      }
      &:hover .emoji {
        display: block;
      }
      & > img {
        width: 24px;
        height: 24px;
      }
      .emoji {
        line-height: 34px;
        padding: 10px !important;
        border: 1px solid #d1d1d1;
        background: #fff;
        display: none;
        text-align: left;
        span {
          font-size: 24px;
          padding: 2px;
          cursor: pointer;
        }
      }
    }
  }
}
.sub_comment_phone {
  background: #fff;
  padding-left: 0 !important;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 4px 10px 0 !important;
  z-index: 1;
  border-top: 1px solid #f1f1f1;
  .sub_botton {
    padding: 0;
  }
  .icons {
    height: auto;
    &:hover .emoji {
      display: block;
      position: absolute;
      top: -200px;
      left: 0;
    }
  }
}

.el-dialog {
  .comment_title {
    margin: 0px 0 10px;
  }
  .no_comment {
    text-align: center;
    padding: 30px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #999;
  }
}
.phone_dialog {
  height: 100vh;
  overflow-y: hidden;
  .dialog_main {
    padding: 10px 10px 180px !important;
  }
  .dialog_top {
    width: 100%;
    left: 0;
    .left,
    .right {
      padding: 10px 4px;
    }
  }
}
/deep/ .forum_con .fir img {
  margin-right: 20px;
}
.forum_desc {
  margin: 10px 0 20px !important;
  text-align: center;
}
.fensi {
  margin: 10 auto 20px !important;
  text-align: center;
}
.forum_desc {
  margin-bottom: 20px;
  text-align: center;
}
.is404 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  height: 100vh;
  .s404 {
    font-size: 44px;

    color: cornflowerblue;
    img {
      width: 100%;
    }
  }
  p {
    text-align: center;
  }
  .lookother {
    padding-left: 10px;
    color: cornflowerblue;
    text-decoration: underline;
    cursor: pointer;
    font-size: 15px;
  }
}
.icons {
  text-align: right;
  height: 60px;
  &:hover .emoji {
    display: block;
  }
}
.emoji {
  // position: absolute;
  z-index: 1;
  width: 100%;
  top: 66px;
  left: 0;
  line-height: 34px;
  padding: 10px !important;
  border: 1px solid #d1d1d1;
  background: #fff;
  display: none;
  text-align: left;
  span {
    font-size: 24px;
    padding: 2px;
    cursor: pointer;
  }
}
/deep/ .item .item_image .imgs img {
  height: auto !important;
  // max-height: calc(100vh - 150px);
}
.comment_list {
  padding-bottom: 200px !important;
}
.dialog_main2 .heji {
  min-height: 180px;
  color: #fff;
  margin: 10px 0px 10px 0px;
  padding: 10px 10px;
  border: 1px solid #f1f1f1;
  color: #333;
  box-sizing: border-box;
  width: 270px;
  // margin-top: 10px;
  .col_title {
    color: #333;
    font-size: 16px;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .col_item {
    padding: 4px;
    border-bottom: 1px solid #f1f1f1;
    margin-bottom: 5px;
    cursor: pointer;
    display: flex;
    .col_img {
      flex: 0 0 60px;
      height: 60px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      border-radius: 4px;
      margin-right: 6px;
      img {
        width: 100%;
        height: 120px;
      }
    }
    .c_main {
      flex: 1;
      .sim_tab {
        font-size: 14px;
        color: #888;
        font-weight: normal;
      }
      .from {
        font-size: 12px;
        margin-top: 0;
        color: #999;
      }
    }
    .cc_title {
      // padding: 4px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    &:hover {
      color: $linkcolor;
    }
  }
}
@media (max-width: 1199px) {
  .content-right-wrapper {
    display: none;
  }
}
.tright {
  float: right;
  margin-right: 6px;
  padding: 2px 4px;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
  img {
    vertical-align: middle;
    width: 16px;
  }
}

/deep/.el-checkbox {
  .el-checkbox__input {
    margin-bottom: -2px;
    z-index: 0;
  }
  .el-checkbox__label {
    margin-left: -8px;
  }
}
</style>
