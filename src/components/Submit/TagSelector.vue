<template>
  <el-popover
    class="tag-selector"
    popper-class="tag-selector-popover"
    placement="top-start"
    width="400"
    trigger="click"
    v-model="tagModalVisible"
    v-if="tags.length > 0"
    @hide="tagSelectorHide"
  >
    <div class="tag-title">
      <p v-if="tag">
        <el-tag :color="tag.backgroundColor || '#ff9300'">
          #{{ tag.name }}
        </el-tag>
        <span> [类型] </span>
        帖子标题
      </p>
      <p v-else>没有选择标签</p>
    </div>
    <el-input
      placeholder="搜索标签"
      :prefix-icon="ElIconSearch"
      v-model="tagSearch"
    >
    </el-input>
    <el-radio-group v-model="tagId" @change="changeTag">
      <div
        class="tag-option"
        v-for="item in tags.filter((tag) => tag.name.indexOf(tagSearch) > -1)"
        v-bind:key="item.id"
      >
        <el-radio :label="item.id">
          <el-tag :color="item.backgroundColor || '#ff9300'">
            #{{ item.name }}
          </el-tag>
        </el-radio>
      </div>
    </el-radio-group>
    <div class="tag-buttons">
      <el-button
        :disabled="tag === null"
        @click="confirmTag"
        type="primary"
        round
        >选 择</el-button
      >
      <el-button @click="clearTag" round>清除选择</el-button>
    </div>

    <el-button
      slot="reference"
      :icon="ElIconPriceTag"
      v-bind:class="{ 'tag-button-no-tag': !dataTagId }"
      :style="{
        backgroundColor: (tag && tag.backgroundColor) || '#ff9300',
        borderColor: (tag && tag.backgroundColor) || '#ff9300',
      }"
      >{{ (dataTagId && tag && '#' + tag.name) || '标 签' }}
      <el-icon><el-icon-arrow-down /></el-icon
    ></el-button>
  </el-popover>
</template>

<script>
import {
  ArrowDown as ElIconArrowDown,
  Search as ElIconSearch,
  PriceTag as ElIconPriceTag,
} from '@element-plus/icons'
import { getlistTag } from '@/api/api'
export default {
  data() {
    return {
      dataTagId: null,
      // Tag 列表
      tags: [],
      // 选中Tag
      tag: null,
      // 预选Tag
      tagId: null,
      // Tag 搜索
      tagSearch: '',
      // Tag Modal是否显示
      tagModalVisible: false,
      ElIconSearch,
      ElIconPriceTag,
    }
  },
  components: {
    ElIconArrowDown,
  },
  props: {
    forumId: {
      type: String,
      required: false,
    },
  },
  model: {
    prop: 'dataTagId',
  },
  mounted() {
    this.forumId && this.getForumTag(this.forumId)
  },
  watch: {
    forumId(newId, oldId) {
      if (newId !== oldId) {
        this.getForumTag(this.forumId)
        this.clearTag()
      }
    },
  },
  methods: {
    // === Tag ===
    // 获取论坛Tag
    async getForumTag(forumId) {
      const result = await getlistTag({ forumId })
      this.tags = result.data
    },
    // 修改Tag
    changeTag(label) {
      this.tag = this.tags.find((tag) => tag.id === label)
    },
    // 设置Tag
    async setTag(label) {
      await this.getForumTag(this.forumId)
      this.tag = this.tags.find((tag) => tag.id === label)
      this.tagId = label
      this.dataTagId = label
    },
    // 清除Tag
    clearTag() {
      this.tag = null
      this.tagId = null
      this.dataTagId = null
      this.$emit('input', this.dataTagId)
      this.tagSearch = ''
    },
    // 确认Tag
    confirmTag() {
      this.tagModalVisible = false
      this.dataTagId = this.tagId
      this.$emit('input', this.dataTagId)
      this.tagSearch = ''
    },
    // 关闭事件
    tagSelectorHide() {
      if (this.tagId && this.dataTagId !== this.tagId) {
        this.tagId = null
        this.tag = null
        this.tagSearch = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.tag-selector {
  display: flex;
  margin-right: 4px;

  .el-button {
    position: relative;
    padding: 4px 16px;
    border: 1px solid;
    border-radius: 9999px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    min-height: 32px;
    height: auto;
    min-width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    i {
      font-size: 20px;
      font-weight: 400;
      height: 20px;
      line-height: 20px;
      margin-right: 8px;
    }
    span {
      margin: 0;
      line-height: 20px;

      i {
        font-size: 16px;
        margin-left: 6px;
      }
    }
    &.tag-button-no-tag {
      background: transparent !important;
      color: #606266 !important;
      border-color: #606266 !important;
    }
  }
}

.tag-selector-popover {
  padding: 0px;
  .tag-title {
    display: flex;
    text-align: center;
    padding: 22px 16px 22px;
    p {
      line-height: 24px;
      font-size: 16px;
    }
    span {
      font-size: 16px;
      color: #888;
      font-weight: 400;
      &.el-tag {
        font-size: 13px;
        color: #fff;
      }
    }
  }
  .el-input {
    padding: 0 16px;
    margin-bottom: 16px;
    /deep/ .el-input__prefix {
      left: 21px;
    }
  }
  .el-radio-group {
    width: 100%;
    overflow: auto;
    height: 200px;
    /deep/ .el-radio__input {
      &.is-checked .el-radio__inner {
        border-color: #16679f;
        background: #16679f;
      }
      .el-radio__inner:hover {
        border-color: #16679f;
      }
    }
  }
  .tag-option {
    cursor: pointer;
    line-height: 16px;
    padding: 4px 16px;
  }
  .el-tag {
    display: inline-block;
    vertical-align: middle;
    padding: 2px 6px;
    background: #ff9300;
    border-radius: 4px;
    font-size: 13px;
    color: #fff;
    border: none;
    height: 22px;
    line-height: 18px;
  }
  .tag-buttons {
    background: #edeff1;
    border: none;
    display: flex;
    flex-direction: row-reverse;
    padding: 16px;
    button {
      margin: 0 0 0 8px;
      &.el-button--primary {
        background: #16679f;
        border-color: #16679f;
      }
      &.is-disabled {
        background: #788898;
        border-color: #788898;
      }
    }
  }
}
</style>

<style lang="scss">
.tag-selector-popover {
  padding: 0px;
  .popper__arrow::after {
    border-top-color: #edeff1 !important;
  }
}
</style>
