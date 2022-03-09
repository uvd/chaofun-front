<template>
  <el-popover
    title="选择一个合集"
    class="collection-selector"
    popper-class="collection-selector-popover"
    placement="top-start"
    width="400"
    trigger="click"
    v-model="collectionModalVisible"
    @hide="collectionSelectorHide"
  >
    <div class="collection-search">
      <el-input
        placeholder="搜索合集"
        :prefix-icon="ElIconSearch"
        v-model="collectionSearch"
      >
      </el-input>
      <el-radio-group v-model="collectionId" @change="changeCollection">
        <div
          class="collection-option"
          v-for="item in collections.filter(
            (collection) => collection.name.indexOf(collectionSearch) > -1
          )"
          v-bind:key="item.id"
        >
          <el-radio :label="item.id">
            {{ item.name }}
          </el-radio>
        </div>
      </el-radio-group>
    </div>

    <el-form class="collection-add" label-position="top">
      <el-form-item label="新增合集">
        <p>允许文字和Emoj表情</p>
        <el-input v-model="newCollection.name">
          <el-button type="primary" @click="onAddCollection" slot="append"
            >新增</el-button
          >
        </el-input>
      </el-form-item>
    </el-form>

    <div class="collection-buttons">
      <el-button
        :disabled="collection === null"
        @click="confirmCollection"
        type="primary"
        round
        >选 择</el-button
      >
      <el-button @click="clearCollection" round>清除选择</el-button>
    </div>

    <el-button
      slot="reference"
      :icon="ElIconCollection"
      v-bind:class="{ 'collection-button-no-collection': !dataCollectionId }"
      >{{ (dataCollectionId && collection && collection.name) || '合 集' }}
      <el-icon><el-icon-arrow-down /></el-icon
    ></el-button>
  </el-popover>
</template>

<script>
import {
  ArrowDown as ElIconArrowDown,
  Search as ElIconSearch,
  Collection as ElIconCollection,
} from '@element-plus/icons'
import { addCollection, userCollectionList } from '@/api/api'
export default {
  data() {
    return {
      dataCollectionId: null,
      // 用户合集
      collections: [],
      // 合集搜索
      collectionSearch: '',
      // 合集ID
      collectionId: null,
      // 合集当前选中
      collection: null,
      // 合集 Modal是否显示
      collectionModalVisible: false,
      // 新增合集
      newCollection: {
        name: null,
      },
      ElIconSearch,
      ElIconCollection,
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
    prop: 'dataCollectionId',
  },
  mounted() {
    this.getCollection()
  },
  methods: {
    // === Collection ===
    // 获取Collection
    async getCollection() {
      const result = await userCollectionList()
      this.collections = result.data
    },
    // 修改Collection
    changeCollection(label) {
      this.collection = this.collections.find(
        (collection) => collection.id === label
      )
      this.$emit('input', label)
    },
    // 设置Collection Id
    setCollection(label) {
      this.collection = this.collections.find(
        (collection) => collection.id === label
      )
      this.collectionId = label
      this.dataCollectionId = label
    },
    // 清除Collection
    clearCollection() {
      this.collection = null
      this.collectionId = null
      this.$emit('input', this.collectionId)
      this.dataCollectionId = null
      this.collectionSearch = ''
      this.newCollection.name = ''
    },
    // 确认Collection
    confirmCollection() {
      this.collectionModalVisible = false
      this.dataCollectionId = this.collectionId
      this.collectionSearch = ''
      this.newCollection.name = ''
    },
    // 关闭事件
    collectionSelectorHide() {
      if (this.collectionId && this.dataCollectionId !== this.collectionId) {
        this.collectionId = null
        this.$emit('input', this.collectionId)
        this.collection = null
        this.collectionSearch = ''
        this.newCollection.name = ''
      }
    },
    // 新增合集
    async onAddCollection() {
      const result = await addCollection(this.newCollection)
      if (result.success && result.data) {
        this.collections.push(result.data)
        this.newCollection.name = ''
        return
      }

      // TODO: 提示新增错误
    },
  },
}
</script>

<style lang="scss">
.collection-selector {
  .el-button {
    position: relative;
    padding: 4px 16px;
    border: 1px solid;
    border-radius: 9999px;
    background: #16679f;
    border-color: #16679f;
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
    &.collection-button-no-collection {
      background: transparent !important;
      color: #606266 !important;
      border-color: #606266 !important;
    }
  }
}
.collection-selector-popover {
  padding: 0;
  .el-popover__title {
    padding: 16px;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    border-bottom: 1px solid #edeff1;
  }
  .collection-search {
    height: 250px;
    background: #f6f7f8;
    padding: 16px 0;
    .el-input {
      padding: 0 16px 16px;
      .el-input__prefix {
        height: 36px;
        left: 21px;
      }
    }
    .el-radio-group {
      height: 180px;
      overflow: scroll;
      width: 100%;
      .el-radio__input {
        &.is-checked .el-radio__inner {
          border-color: #16679f;
          background: #16679f;
        }
        &.is-checked + .el-radio__label {
          color: #16679f;
        }
        .el-radio__inner:hover {
          border-color: #16679f;
        }
      }
    }
    .collection-option {
      cursor: pointer;
      line-height: 16px;
      padding: 4px 16px;
      display: flex;
      flex-direction: row;
    }
  }

  .collection-add {
    background: #fff;
    padding: 16px;
    .el-form-item {
      margin: 0;
      .el-form-item__label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        line-height: 12px;
        color: #606266;
        margin-bottom: 8px;
        padding: 0;
      }
      .el-form-item__content {
        line-height: 1;
        p {
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          color: #5a5e66;
          margin-bottom: 8px;
          text-align: left;
        }
        .el-input {
          border: 1px solid #edeff1;
          background-color: #f6f7f8;
          border-radius: 4px;
          color: #5a5e66;
        }
      }
    }
  }
  .collection-buttons {
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
  .popper__arrow::after {
    border-top-color: #edeff1 !important;
  }
}
</style>
