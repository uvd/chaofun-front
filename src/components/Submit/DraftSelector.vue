<template>
  <div>
    <el-button type="text" @click="visible = true"
      >草稿箱 <span>{{ drafts.length }}</span></el-button
    >
    <el-dialog
      width="400"
      trigger="click"
      custom-class="draft-modal"
      :visible.sync="visible"
    >
      <span slot="title">
        草稿箱 <i>{{ drafts.length }}/20</i>
      </span>
      <ul>
        <li :key="item.i" v-for="item in drafts" @click="setContent(item)">
          <div class="draft-icon">
            <el-icon><el-icon-tickets /></el-icon>
          </div>
          <div class="draft-content">
            <h2 v-if="draftId && draftId === item.i" class="editing">
              正在编辑：{{ item.t }}
            </h2>
            <h2 v-else>{{ item.t }}</h2>
            <div class="draft-desc">
              <span v-if="item.n">{{ item.n }}</span>
              <span class="seprate" v-if="item.n">·</span>
              <time>{{ moment.unix(item.d).fromNow() }}</time>
            </div>
          </div>
          <div class="draft-operation">
            <el-button
              :icon="ElIconDelete"
              @click="
                () => {
                  removeDraft(item.i)
                  this.$toast('删除成功！')
                }
              "
            ></el-button>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <em>草稿箱只会暂存在当前浏览器中！</em>
        <el-button @click="visible = false" round>关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Tickets as ElIconTickets,
  Delete as ElIconDelete,
} from '@element-plus/icons'
import 'moment/locale/zh-cn'
import moment from 'moment'
import { nanoid } from 'nanoid'

export default {
  data() {
    return {
      moment: moment,
      drafts: [],
      visible: false,
      ElIconDelete,
    }
  },
  components: {
    ElIconTickets,
  },
  props: {
    title: String,
    value: String,
    draftId: String,
  },
  created() {
    this.drafts = this.getDrafts()
    console.log(this.drafts)
  },
  methods: {
    // 获取所有草稿
    getDrafts() {
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return []
      }
      const key = `draft:${userId}:article`
      const articles = JSON.parse(localStorage.getItem(key) || '[]')
      if (articles && articles.length > 0) {
        // 检查
        return articles.filter(
          (article) =>
            article && article.i && article.t && article.c && article.d
        )
      }
      return []
    },
    // 保存文章
    saveDraft(
      title,
      content,
      forumId = 0,
      formuName = '',
      tagId,
      collectionId
    ) {
      this.drafts.push({
        i: nanoid(),
        f: forumId,
        n: formuName,
        t: title,
        c: content,
        d: moment().unix(),
        ti: tagId || 0,
        ci: collectionId || 0,
      })
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return false
      }
      const key = `draft:${userId}:article`
      localStorage.setItem(key, JSON.stringify(this.drafts))
      this.$toast('保存草稿成功！')
    },
    // 更新文章
    updateDraft(
      id,
      title,
      content,
      forumId = 0,
      formuName = '',
      tagId,
      collectionId
    ) {
      const index = this.drafts.findIndex((article) => article.i === id)
      if (index === -1) {
        return false
      }
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return false
      }
      const key = `draft:${userId}:article`
      this.drafts[index] = {
        i: id,
        f: forumId,
        n: formuName,
        t: title,
        c: content,
        d: moment().unix(),
        ti: tagId || 0,
        ci: collectionId || 0,
      }
      localStorage.setItem(key, JSON.stringify(this.drafts))
      this.$toast('更新草稿成功！')
    },
    // 移除草稿
    removeDraft(id) {
      const userId = this.$store.state.user.userInfo.userId
      if (!userId) {
        return false
      }
      const key = `draft:${userId}:article`
      this.drafts = this.drafts.filter((article) => article.i !== id)
      localStorage.setItem(key, JSON.stringify(this.drafts))
    },
    // 设置父组件文章
    setContent(item) {
      this.$emit('setDraftContent', item)
      this.visible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.el-button {
  position: relative;
  color: #606266;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 24px;
  text-transform: uppercase;
  margin-left: 10px;
  padding: 4px;
  span {
    font-weight: 400;
    line-height: 18px;
    background: #606266;
    border-radius: 2px;
    color: #fff;
    margin-left: 4px;
    padding: 1px 3px;
  }
}
/deep/ .draft-modal {
  border-radius: 4px;
  max-height: 70vh;
  min-height: 400px;
  box-sizing: border-box;
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  .el-dialog__header {
    padding: 11px 12px;
    border-bottom: 1px solid #edeff1;
    span {
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      i {
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        margin-left: 10px;
        color: #7c7c7c;
        font-style: normal;
      }
    }
    .el-dialog__headerbtn {
      top: 12px;
      i {
        font-size: 20px;
      }
    }
  }
  .el-dialog__body {
    padding: 0;
    flex: 1;
    overflow-y: auto;
  }
  .el-dialog__footer {
    padding: 12px 16px;
    border-top: 1px solid #edeff1;
    em {
      font-style: normal;
      color: #ff2d20;
    }
    .el-button {
      padding-left: 16px;
      padding-right: 16px;
      margin-left: auto;
      min-width: 90px;
      position: relative;
      border: 1px solid #0079d3;
      color: #0079d3;
      fill: #0079d3;
      span {
        font-size: 14px;
      }
    }
  }
}

ul {
  li {
    cursor: pointer;
    display: flex;
    border-bottom: 1px solid #edeff1;
    .draft-icon {
      padding: 6px 12px;
    }
    .draft-content {
      flex: 1;
      /deep/ h2 {
        font-size: 14px;
        word-wrap: break-word;
        hyphens: auto;
        padding-top: 3px;
        word-break: break-all;
        font-weight: normal;
        &.editing {
          font-weight: 700;
        }
      }
      /deep/ .draft-desc {
        font-size: 12px;
        line-height: 18px;
        color: #7c7c7c;
        span {
          font-weight: 700;
          line-height: 16px;
          &.seprate {
            margin: 0 4px;
          }
        }
        time {
          vertical-align: middle;
        }
      }
    }
    .draft-operation {
      display: flex;
      align-items: center;
      padding: 12px;
      /deep/ .el-button {
        margin: 0;
        padding: 0;
        border: none;
        line-height: 1;
        i {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
