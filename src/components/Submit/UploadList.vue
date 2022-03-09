<template>
  <draggable
    class="image-uploader-sort-list"
    ghost-class="ghost"
    :list="files"
    @start="handleStart"
    @end="handleEnd"
    draggable=".image-uploader-file"
  >
    <transition-group
      tag="ul"
      :class="[
        'el-upload-list',
        'el-upload-list--picture-card',
        { 'is-disabled': disabled },
      ]"
      name="el-list"
    >
      <li
        v-for="file in files"
        :key="file.uid"
        tabindex="0"
        class="el-upload-list__item image-uploader-file"
      >
        <span
          :style="{
            backgroundImage: `url(${file.url})`,
          }"
        >
        </span>
        <el-progress
          v-if="file.status === 'uploading'"
          type="circle"
          :stroke-width="6"
          :percentage="parsePercentage(file.percentage)"
        >
        </el-progress>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview">
            <el-icon><el-icon-rank /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><el-icon-delete /></el-icon>
          </span>
        </span>
      </li>
      <li key="add">
        <span class="image-uploader-btn" @click="handleClick">
          <el-icon><el-icon-plus /></el-icon>
        </span>
      </li>
    </transition-group>
  </draggable>
</template>

<script>
import {
  Rank as ElIconRank,
  Delete as ElIconDelete,
  Plus as ElIconPlus,
} from '@element-plus/icons'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable,
    ElIconRank,
    ElIconDelete,
    ElIconPlus,
  },
  model: {
    prop: 'files',
  },
  props: {
    files: {
      type: Array,
      default() {
        return []
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handleMove: Function,
    handleRemove: Function,
    handleClick: Function,
    handlePreview: Function,
    listType: String,
    isVideo: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleStart() {
      this.drag = true
      this.handleMove(true)
    },
    handleEnd() {
      this.drag = false
      this.handleMove(false)
    },
    parsePercentage(val) {
      return parseInt(val, 10)
    },
  },
}
</script>

<style lang="scss" scoped>
.image-uploader-sort-list {
  padding: 12px;
  .el-upload-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    .image-uploader-file {
      margin: 0 12px 12px 0;
      padding: 0;
      position: relative;
      align-items: center;
      border-radius: 4px;
      border: 2px solid #5a5e66;
      box-sizing: border-box;
      display: flex;
      height: 150px;
      width: 150px;
      justify-content: center;
      > span {
        background-position: 50%;
        background-size: cover;
        border-radius: 4px;
        display: block;
        width: 134px;
        height: 134px;
        margin: 6px;
        outline: none;
        &.el-upload-list__item-actions {
          margin: 0;
          width: 146px;
          height: 146px;
          border-radius: 0;
          opacity: 0;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    .ghost {
      opacity: 0.5;
    }
  }
}
.image-uploader-btn {
  cursor: pointer;
  .el-icon-plus {
    align-items: center;
    border: 1px dashed #606266;
    border-radius: 4px;
    display: flex;
    width: 150px;
    height: 150px;
    justify-content: center;
    font-size: 40px;
    color: #606266;
    &:hover {
      color: #5a5e66;
    }
  }
}

.el-list-move {
  transition: transform 1s;
}
</style>
