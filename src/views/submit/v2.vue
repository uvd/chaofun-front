<template>
  <div id="container" class="dashboard-container container" ref="container">
    <!-- <div style="padding-top: 50px;"></div> -->
    <el-container class="section-submit">
      <el-main>
        <el-container class="section-submit-header">
          <el-col>发帖</el-col>
          <DraftSelector
            @setDraftContent="setDraftContent"
            ref="draft"
            v-if="type === 'article'"
            :draftId="draftId"
          />
        </el-container>

        <el-container>
          <div class="section-submit-form">
            <img
              class="sicon"
              :src="imgOrigin + forum.imageName"
              alt=""
              v-if="forum.imageName"
            />
            <el-icon><el-icon-search /></el-icon>
            <el-select
              v-model="forum.id"
              filterable
              remote
              reserve-keyword
              placeholder="请选择版块"
              popper-class="section-submit-form-select"
              :popper-append-to-body="false"
              :remote-method="getForumCategories"
              :loading="loading"
              @change="forumSelectOnChange"
            >
              <el-option
                v-for="item in forums"
                :key="item.link"
                :label="item.title"
                :value="item.forumId"
              >
                <img class="sicon" :src="imgOrigin + item.icon" alt="" />
                <span>{{ item.title }}</span>
              </el-option>
            </el-select>
          </div>
        </el-container>
        <el-form :model="post" ref="form">
          <div class="postbox">
            <el-radio-group
              v-model="type"
              @change="
                $refs.form.clearValidate()
                $refs.title.focus()
                draftId = null
              "
            >
              <el-radio-button label="image">
                <el-icon><el-icon-picture-outline /></el-icon> 图片/视频
              </el-radio-button>
              <el-radio-button label="article">
                <el-icon><el-icon-tickets /></el-icon> 文章
              </el-radio-button>
              <el-radio-button label="link">
                <el-icon><el-icon-link /></el-icon> 链接
              </el-radio-button>
              <el-radio-button label="vote">
                <el-icon><el-icon-receiving /></el-icon> 投票
              </el-radio-button>
            </el-radio-group>

            <div class="postbox-fields">
              <el-row>
                <el-form-item
                  prop="title"
                  :rules="[
                    {
                      required: type === 'image' ? false : true,
                      message: '请输入标题',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入标题"
                    v-model="post.title"
                    maxlength="300"
                    show-word-limit
                    :autofocus="true"
                    ref="title"
                    class="title"
                  />
                </el-form-item>
              </el-row>
              <!-- 暂时隐藏投票描述 -->
              <el-row v-if="['article'].includes(type)">
                <el-form-item prop="content">
                  <editor :content="post.content" ref="editor" />
                </el-form-item>
              </el-row>

              <el-row class="image-box" v-if="type === 'image'">
                <Uploader v-model="post.ossNames" action="/api/upload_image" />
              </el-row>
              <el-row v-if="type === 'link'">
                <el-form-item
                  prop="link"
                  :rules="[
                    {
                      required: true,
                      message: '请输入链接地址',
                      trigger: 'blur',
                    },
                    {
                      type: 'url',
                      message: '链接地址格式不正确',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入链接地址"
                    v-model="post.link"
                    resize="none"
                    @input="getUrlTitle"
                  >
                  </el-input>
                </el-form-item>
              </el-row>

              <el-row class="vote-box" v-if="type === 'vote'">
                <div class="vote-control">
                  <draggable
                    class="vote-sort-list"
                    ghost-class="ghost"
                    v-model="post.options"
                    @start="drag = true"
                    @end="drag = false"
                    handle=".el-icon-rank"
                  >
                    <el-form-item
                      v-for="(option, index) in post.options"
                      :key="index"
                      :prop="`options.${index}.optionName`"
                    >
                      <el-input
                        class="vote-option"
                        :placeholder="`选项 ${index + 1}`"
                        v-model="option.optionName"
                      >
                        <el-icon><el-icon-rank /></el-icon>
                        <el-button
                          slot="suffix"
                          type="text"
                          :icon="ElIconDeleteSolid"
                          v-if="index > 1"
                          @click.prevent="removeOption(index)"
                        />
                      </el-input>
                    </el-form-item>
                  </draggable>
                  <div class="option-control">
                    <el-button round @click="addOption"> 新增选项 </el-button>
                    <!-- <el-form-item label="投票时长：">
                              <el-select v-model="post.voteDuration" placeholder="请选择">
                                <el-option
                                  v-for="day in 7"
                                  :key="day"
                                  :label="`${day}天`"
                                  :value="day"
                                />
                              </el-select>
                            </el-form-item> -->
                  </div>
                </div>
                <div class="vote-tips">
                  <p>
                    <el-icon><el-icon-warning-outline /></el-icon>
                    <span>发起投票建议</span>
                  </p>
                  <ol>
                    <li>投票选项简短明确</li>
                    <li>投票选项越多越准确</li>
                    <li>选择合适的投票时间（暂未开放）</li>
                    <li>创建投票后无法编辑投票</li>
                  </ol>
                </div>
              </el-row>

              <el-row>
                <div class="checkbox-group">
                  <el-checkbox
                    v-model="post.anonymity"
                    true-label="true"
                    false-label="false"
                    border
                    size="medium"
                  >
                    <i
                      :class="[
                        post.anonymity === 'true'
                          ? 'el-icon-check'
                          : 'el-icon-plus',
                      ]"
                    />
                    <span>匿 名</span>
                  </el-checkbox>

                  <TagSelector
                    ref="tag"
                    v-bind:forumId="post.forumId"
                    v-model="post.tagId"
                  />

                  <CollectionSelector
                    ref="collection"
                    v-model="post.collectionId"
                  />

                  <el-checkbox
                    style="margin-left: 5px"
                    v-if="
                      type === 'vote' &&
                      this.predictionsTournament &&
                      this.forum.admin
                    "
                    v-model="post.prediction"
                    true-label="true"
                    false-label="false"
                    border
                    size="medium"
                  >
                    <i
                      :class="[
                        post.prediction === 'true'
                          ? 'el-icon-check'
                          : 'el-icon-plus',
                      ]"
                    />
                    <span>{{ this.predictionsTournament.name }}</span>
                  </el-checkbox>
                </div>
              </el-row>
              <el-divider></el-divider>
            </div>
            <div class="postbox-buttons">
              <el-button type="primary" round @click="submit" :loading="loading"
                >发 布</el-button
              >
              <el-button v-if="type === 'article'" @click="saveDraft" round>
                {{ draftId ? '更新草稿' : '保存草稿箱' }}
              </el-button>
            </div>
            <div class="postbox-rules">
              <p>
                <el-icon><el-icon-warning-outline /></el-icon>
                严禁发布色情、暴恐、赌博及其他违反网络安全法的内容，或涉嫌隐私或未经授权的私人图片及信息，如违规发布，请自行删除或管理员强制删除。
              </p>
            </div>
          </div>
        </el-form>
      </el-main>
      <el-aside width="320px">
        <el-card class="aside-forum" shadow="never" v-if="forum.id">
          <div class="forum-header">
            <img
              :src="imgOrigin + forum.imageName"
              :alt="forum.name"
              v-if="forum.imageName"
            />
            <router-link :to="`/f/${forum.id}`">{{ forum.name }}</router-link>
          </div>
          <div class="forum-desc">
            {{ forum.desc }}
          </div>
          <div class="forum-statics">
            <div class="statics-box">
              <em>{{ forum.followers }}</em>
              <span>粉丝</span>
            </div>
            <div class="statics-box">
              <em>{{ forum.posts }}</em>
              <span>帖子</span>
            </div>
          </div>
          <div v-if="this.rules && this.rules.length != 0">
            <p>
              <span>版块发帖规则</span>
            </p>
            <ol>
              <li v-for="item in this.rules">{{ item.rule }}</li>
            </ol>
          </div>
        </el-card>
        <el-card class="aside-rule" shadow="never">
          <p>
            <img :src="logo" alt="" />
            <span>炒饭发帖规则</span>
          </p>
          <ol>
            <li>严禁发布色情、暴恐、赌博及其他违反网络安全法的内容</li>
            <li>严禁发布涉嫌隐私或未经授权的私人图片及信息</li>
            <li>如违规发布，请自行删除或管理员强制删除</li>
          </ol>
        </el-card>
        <el-card class="aside-help" shadow="never">
          <el-row :gutter="12">
            <el-col :span="12" class="help-item">
              <router-link to="/help/forumIntro">帮助文档</router-link>
            </el-col>
            <el-col :span="12" class="help-item">
              <router-link to="/forumRank">24小时版块排名</router-link>
              <router-link to="/userRank">24小时用户排名</router-link>
            </el-col>
          </el-row>
        </el-card>
        <el-button class="go-to-old-btn" type="primary" round @click="gotoOld"
          >返回旧版</el-button
        >
      </el-aside>
    </el-container>
    <!-- <div class="main_content">
          <div v-if="!ISPHONE" class="main_left">
          
          </div>
          <div class="main_center">
          
          </div>
          <div v-if="!ISPHONE" class="main_right">
          </div>
         </div> -->
  </div>
</template>

<script>
import {
  Search as ElIconSearch,
  PictureOutline as ElIconPictureOutline,
  Tickets as ElIconTickets,
  Link as ElIconLink,
  Receiving as ElIconReceiving,
  Rank as ElIconRank,
  WarningOutline as ElIconWarningOutline,
  DeleteSolid as ElIconDeleteSolid,
} from '@element-plus/icons'
import draggable from 'vuedraggable'
import Editor from '@/components/Submit/Editor'
import TagSelector from '@/components/Submit/TagSelector'
import CollectionSelector from '@/components/Submit/CollectionSelector'
import Uploader from '@/components/Submit/Uploader'
import DraftSelector from '@/components/Submit/DraftSelector'

import {
  getForumInfo,
  searchForum,
  getUrlTitle,
  submitImage,
  submitArticle,
  submitLink,
  submitVote,
  submitPrediction,
  getPredictionsTournament,
} from '@/api/api'

import { logo } from '@/settings'
import { getForumRules } from '../../api/api'

export default {
  data() {
    return {
      logo,
      type: 'image',
      forum: {
        name: '',
        id: this.$route.params.forumId,
      },
      post: {
        forumId: this.$route.params.forumId,
        title: '',
        link: '',
        content: '',
        options: [
          {
            optionName: '',
          },
          {
            optionName: '',
          },
        ],
        voteDuration: 3,
        anonymity: 'false',
        tagId: null,
        collectionId: null,
        ossNames: null,
        prediction: 'false',
      },
      forums: [],
      rules: [],
      predictionsTournament: {},
      // 文件参数
      filedata: {},
      // 发布中
      loading: false,
      // 草稿箱
      draftId: null,
      ElIconDeleteSolid,
    }
  },
  components: {
    Editor,
    draggable,
    TagSelector,
    CollectionSelector,
    Uploader,
    DraftSelector,
    ElIconSearch,
    ElIconPictureOutline,
    ElIconTickets,
    ElIconLink,
    ElIconReceiving,
    ElIconRank,
    ElIconWarningOutline,
  },
  name: 'submitV2',
  mounted() {
    // 加载论坛版块信息
    this.getForum().then(() => {
      this.getForumCategories()
      this.getForumRules()
      this.getPredictionsTournament()
      this.get
    })

    // 自动聚焦标题
    this.$refs.title.focus()
  },
  beforeDestroy() {},
  methods: {
    async forumSelectOnChange(forumId) {
      await this.getForum()
      this.getForumRules()
      this.getPredictionsTournament()
      // 静态替换路由
      history.pushState({}, null, `/f/${forumId}/submit`)
    },
    async getForum() {
      if (this.forum.id) {
        const result = await getForumInfo({ forumId: this.forum.id })
        this.forum.name = result.data.name
        this.forum.imageName = result.data.imageName
        this.forum.followers = result.data.followers
        this.forum.posts = result.data.posts
        this.forum.desc = result.data.desc
        this.forum.admin = result.data.admin
        this.post.forumId = this.forum.id
      }
    },

    async getForumRules() {
      if (this.forum.id) {
        const result = await getForumRules({ forumId: this.forum.id })
        if (result.success) {
          this.rules = result.data
        }
      }
    },

    async getPredictionsTournament() {
      this.post.prediction = 'false'
      if (this.forum.id) {
        const result = await getPredictionsTournament({
          forumId: this.forum.id,
        })
        if (result.success) {
          this.predictionsTournament = result.data
        }
      }
    },

    async getForumCategories(keyword = '') {
      const result = await searchForum({ keyword })
      this.forums = result.data
      // 如果没找对应版块，那么插入默认
      if (
        this.forum.id &&
        !this.forums.find((forum) => forum.forumId === this.forum.id)
      ) {
        this.forums.push({
          forumId: this.forum.id,
          icon: this.forum.imageName,
          title: this.forum.name,
        })
      }
    },

    // === 链接相关 ===
    // 通过URL获取链接标题
    async getUrlTitle() {
      if (this.post.title !== '') {
        return
      }
      const result = await getUrlTitle({ url: this.post.link })
      if (result && result.data) {
        this.post.title = result.data
      }
    },
    // === 投票相关 ===
    // 新增选项
    addOption() {
      if (this.post.options.length > 5) {
        this.$message.error('最多支持6个选项！')
        return
      }
      this.post.options.push({
        optionName: '',
      })
    },
    // 移除选项
    removeOption(index) {
      if (index !== -1) {
        this.post.options.splice(index, 1)
      }
    },

    // === 提交 ===
    submit() {
      // TODO: 增加Vote文章详情
      if (['article'].includes(this.type)) {
        // 同步内容
        this.post.content = this.$refs.editor.get()
      }
      this.$refs.form.validate((result) => {
        if (!result) {
          this.$message.error('选项未填写完整')
          return
        }
        const { type, post } = this
        if (type === 'image' && (!post.ossNames || post.ossNames.length < 1)) {
          this.$message.error('请上传至少一张图片或一个视频！')
          return
        }
        this.doSubmit()
      })
    },
    // 提交操作
    async doSubmit() {
      this.loading = true
      const loginStatus = await this.doLoginStatus()
      if (!loginStatus) {
        return
      }
      const { type, post } = this
      let result
      // 公共参数
      const params = {
        forumId: post.forumId,
        title: post.title,
        anonymity: post.anonymity,
      }
      if (post.tagId) {
        params.tagId = post.tagId
      }
      if (post.collectionId) {
        params.collectionId = post.collectionId
      }
      try {
        // 图片/视频
        if (type === 'image') {
          if (post.ossNames.length === 1) {
            params.ossName = post.ossNames[0]
          } else {
            params.ossNames = post.ossNames.join(',')
          }
          result = await submitImage(params)
        } else if (type === 'article') {
          params.article = post.content
          params.articleType = 'richtext'
          result = await submitArticle(params)
        } else if (type === 'link') {
          params.link = post.link
          result = await submitLink(params)
        } else if (type === 'vote') {
          params.article = post.content
          params.options = JSON.stringify(post.options)
          if (post.prediction == 'true' && this.predictionsTournament.id) {
            params.predictionsTournamentId = this.predictionsTournament.id
            result = await submitPrediction(params)
          } else {
            result = await submitVote(params)
          }
        }
        if (!result || !result.success) {
          this.$message.error(result.errorMessage)
          this.loading = false
          return
        }
        this.loading = false
        if (this.draftId) {
          this.$refs.draft.removeDraft(this.draftId)
        }
        this.draftId = null // 清空草稿箱

        this.$message.success('发布成功')
        setTimeout(() => {
          this.$router.push({ path: '/p/' + result.data.postId })
        }, 1500)
      } catch (error) {
        console.error(error)
        // 其他网络问题
        this.$message.error('发布失败，尝试联系下开发同学！')
      }
      this.loading = false
    },
    // 保存草稿箱
    saveDraft() {
      const { post } = this
      const content = this.$refs.editor.get()
      if (this.draftId) {
        this.$refs.draft.updateDraft(
          this.draftId,
          post.title,
          content,
          this.forum.id,
          this.forum.name,
          this.post.tagId,
          this.post.collectionId
        )
      } else {
        this.$refs.draft.saveDraft(
          post.title,
          content,
          this.forum.id,
          this.forum.name,
          this.post.tagId,
          this.post.collectionId
        )
      }
    },
    // 返回旧版
    gotoOld() {
      this.toPost(this.forum.id, this.forum.name, this.forum.imageName, false)
    },
    // 设置草稿内容
    async setDraftContent(draftArticle) {
      // 版块
      if (draftArticle.f) {
        this.forum.id = draftArticle.f
        this.post.forumId = draftArticle.f
        await this.forumSelectOnChange(draftArticle.f)
      }

      this.draftId = draftArticle.i
      this.post.title = draftArticle.t
      this.post.content = draftArticle.c
      if (draftArticle.ti) {
        this.post.tagId = draftArticle.ti
        this.$refs.tag.setTag(draftArticle.ti)
      }
      if (draftArticle.ci) {
        this.post.collectionId = draftArticle.ci
        this.$refs.collection.setCollection(draftArticle.ci)
      }
      this.$refs.editor.set(draftArticle.c)
      this.$refs.form.clearValidate()
    },
    unsupported() {
      this.$toast('暂不支持，尽请期待')
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.section-submit {
  max-width: 1248px;
  padding: 60px 55px;
  margin: 0 auto;

  .section-submit-header {
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 10px;
    .el-col {
      padding: 0;
      font-size: 18px;
      font-weight: 500;
      line-height: 34px;
    }
  }
  .section-submit-form {
    position: relative;
    display: flex;
    box-sizing: border-box;
    min-width: 300px;
    width: auto;
    height: 40px;
    border-radius: 4px;
    transition: box-shadow 0.2s ease;
    box-shadow: 0 0 0 0 #fff;
    border: 1px solid #edeff1;
    background-color: #fff;
    align-items: center;
    padding: 0 8px;
    margin-bottom: 8px;
    i,
    img {
      margin: 0;
      height: 22px;
      width: 22px;
      font-size: 22px;
      line-height: 22px;
      border-radius: 9999px;
    }
    .el-select {
      width: 100%;
      /deep/ .el-select__caret {
        font-size: 22px;
        color: #606266;
        &:before {
          content: '\e6e1';
        }
      }
      /deep/ .el-input.is-focus {
        .el-select__caret {
          transform: rotate(0deg);
        }
      }
    }
    /deep/ .el-input__inner {
      border: none;
    }
  }
  .postbox {
    width: 100%;
    background: #fff;
    overflow: hidden;
    border-radius: 10px;
    // padding-bottom: 20px;

    .el-radio-group {
      width: 100%;
      display: flex;
      label {
        flex: 1;
        /deep/ .el-radio-button__inner {
          display: flex;
          flex: 1;
          width: 100%;
          box-sizing: border-box;
          padding: 15px 24px;
          outline: none;
          position: relative;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          border: none;
          background: transparent;
          border: 1px solid #dcdfe6;
          border-width: 0 1px 1px 0;
          align-items: center;
          justify-content: center;
          box-shadow: none;
          color: #606266;
          line-height: 20px;
          i {
            font-size: 20px;
            font-weight: 400;
            height: 20px;
            line-height: 20px;
            margin-right: 8px;
          }
        }

        &:hover {
          background-color: rgba(0, 121, 211, 0.05);
          /deep/ .el-radio-button__inner {
            color: #606266;
          }
        }

        &:last-child {
          /deep/ .el-radio-button__inner {
            border-width: 0 0 1px 0;
          }
        }

        &.is-active {
          /deep/ .el-radio-button__inner {
            color: #16679f;
            background-color: rgba(0, 121, 211, 0.05);

            &::after {
              content: ' ';
              box-sizing: border-box;
              background-color: #16679f;
              position: absolute;
              left: 0;
              right: 0;
              bottom: -1px;
              height: 2px;
            }
          }
        }
      }
    }
  }
  .postbox-fields {
    margin: 16px;
    .el-row {
      margin: 0;
    }
    .title {
      /deep/ textarea {
        padding: 12px 8px;
        resize: none;
        box-sizing: border-box;
        overflow: hidden;
      }
      /deep/ .el-input__count {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        line-height: 12px;
        text-transform: uppercase;
        bottom: 12px;
        pointer-events: none;
        position: absolute;
        right: 12px;
        opacity: 0.65;
      }
    }
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      margin-bottom: 20px;
    }
    /deep/ .el-checkbox {
      position: relative;
      padding: 4px 16px;
      border: 1px solid;
      border-radius: 9999px;
      color: #606266;
      font-size: 14px;
      min-height: 32px;
      height: auto;
      min-width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      margin-right: 4px;
      .el-checkbox__inner {
        display: none;
      }
      .el-checkbox__label {
        padding-left: 0;
        display: flex;

        i {
          font-size: 20px;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
          margin-right: 8px;
        }
      }

      &.is-checked {
        background: #16679f;
        border-color: #16679f;
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .el-divider {
      margin: 0;
    }
    .image-box {
      margin-bottom: 22px;
    }
    // 投票样式
    .vote-box {
      display: flex;
      flex-direction: row;
      border: 1px solid #dcdfe6;
      margin: 0 0 22px;
      padding: 8px 0;
      .vote-control {
        flex-grow: 1;
        width: 100%;
        .vote-sort-list {
          /deep/ .el-form-item {
            margin-bottom: 0;
          }
        }
        .vote-option {
          display: flex;
          align-items: center;
          flex-direction: row;
          padding: 4px 0 4px 4px;
          position: relative;
          transition: opacity 0.2s, left 0.2s;

          /deep/ .el-form-item__error {
            display: none;
          }

          /deep/ .el-input-group__prepend {
            display: flex;
            fill: #5a5e66;
            height: 20px;
            width: 20px;
            font-size: 20px;
            margin-right: 4px;
            padding: 0;
            background: transparent;
            border: none;
            i {
              cursor: pointer;
            }
          }
          /deep/ .el-input__suffix {
            i {
              font-size: 20px;
              color: #606266;
            }
          }
        }
        .option-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding-right: 20px;
          flex-direction: row;
          .el-button {
            margin-left: 26px;
            align-items: center;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            position: relative;
            text-align: center;
            width: auto;
            line-height: 20px;
            padding: 4px 16px;
            border: none;
            color: #16679f;
            font-weight: bold;
          }
          /deep/ .el-form-item {
            display: flex;
            align-items: center;
            -ms-flex-direction: row;
            flex-direction: row;
            justify-content: center;
            margin: 0;
            label {
              font-weight: normal;
              line-height: 20px;
            }
            .el-form-item__content {
              line-height: 20px;
            }
            .el-select {
              position: relative;
              width: 60px;
              font-size: 12px;
              line-height: 20px;
              .el-input {
                .el-input__icon {
                  line-height: 20px;
                }
                input {
                  align-items: center;
                  display: flex;
                  flex-direction: row;
                  border: none;
                  padding: 0 30px 0 0;
                  color: #16679f;
                  height: 20px;
                  line-height: 20px;
                }
              }
            }
          }
        }
      }
      .vote-tips {
        flex-grow: 0;
        flex-shrink: 0;
        padding: 4px 0 4px 8px;
        width: 250px;
        p {
          margin-left: 5px;
          padding-bottom: 6px;
          font-size: 13px;
          display: flex;
          align-content: center;
          flex-direction: row;
          flex-grow: 0;
          i {
            font-size: 16px;
            padding: 2px;
            font-weight: 600;
          }
          span {
            line-height: 22px;
            padding-left: 4px;
          }
        }
        ol {
          padding: 0 24px;
          li {
            list-style: decimal outside;
            font-size: 11px;
            font-weight: 500;
            line-height: 15px;
            margin-bottom: 5px;
            padding-left: 6px;
          }
        }
      }
    }
  }
  .postbox-buttons {
    display: flex;
    margin: 0 16px 16px;
    flex-direction: row-reverse;
    text-transform: uppercase;
    .el-button {
      margin-left: 8px;
      &.el-button--primary {
        background-color: #16679f;
        border-color: #16679f;
      }
    }
  }

  .postbox-rules {
    display: none;
    background-color: #edeff1;
    padding: 8px 16px 21px;
    i {
      font-size: 18px;
      color: #fc471e;
    }
  }

  /deep/ .section-submit-form-select {
    .el-select-dropdown__item {
      display: flex;
      align-items: center;
      img {
        display: flex;
        border-radius: 9999px;
        width: 24px;
        height: 24px;
        overflow: hidden;
      }

      span {
        display: flex;
        padding-left: 8px;
      }

      &.selected {
        background-color: #f5f7fa;
      }
    }
  }
  .el-aside {
    background: none;
    padding: 0;
    position: relative;
    .go-to-old-btn {
      position: absolute;
      top: 30px;
      right: 10px;
    }
    .el-card {
      margin-top: 15px;
    }
    .aside-forum {
      /deep/ .el-card__body {
        padding: 12px 12px;
      }
      .forum-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        img {
          display: block;
          border-radius: 9999px;
          box-sizing: border-box;
          height: 52px;
          width: 52px;
          font-size: 52px;
          line-height: 52px;
          margin-right: 8px;
        }
        a {
          color: #5a5e66;
          font-size: 20px;
        }
      }
      .forum-desc {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 21px;
        font-weight: 400;
        color: #606266;
      }

      ol {
        font-size: 12px;
        line-height: 18px;
        list-style: decimal;
        list-style-position: inside;

        li {
          border-bottom: 1px solid #dcdfe6;
          padding: 10px 6px;
          list-style: decimal;
          list-style-position: inside;
        }
      }
      .forum-statics {
        display: flex;
        margin-bottom: 8px;
        .statics-box {
          flex: auto;
          border-right: 1px solid #dcdfe6;
          padding: 8px 0 8px 12px;
          em {
            display: block;
            font-size: 16px;
            font-weight: 500;
            font-style: normal;
            line-height: 20px;
            color: #5a5e66;
          }
          span {
            display: block;
            font-size: 12px;
            font-weight: 500;
            font-style: normal;
            line-height: 16px;
            color: #5a5e66;
          }
          &:last-child {
            border: none;
          }
        }
      }
    }
    .aside-rule {
      /deep/ .el-card__body {
        padding: 12px 12px;
        p {
          display: flex;
          justify-items: center;
          padding-bottom: 5px;
          border-bottom: 1px solid #dcdfe6;
          img {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }
          span {
            font-size: 16px;
            line-height: 40px;
          }
        }
        ol {
          font-size: 12px;
          line-height: 18px;
          list-style: decimal;
          list-style-position: inside;

          li {
            border-bottom: 1px solid #dcdfe6;
            padding: 10px 6px;
            list-style: decimal;
            list-style-position: inside;
          }
        }
      }
    }
    .aside-help {
      /deep/ .el-card__body {
        padding: 12px 12px;
        .help-item {
          padding: 0 4px;
          a {
            display: block;
            color: #606266;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .section-submit {
    padding: 60px 24px;
    .el-aside {
      display: none;
    }
    .postbox-rules {
      display: flex;
    }
  }
}
@media (max-width: 600px) {
  .section-submit {
    padding: 60px 8px;
    .section-submit-form {
      min-width: 0;
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>
