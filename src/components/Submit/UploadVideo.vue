<template>
  <div>
    <div class="uploader-video">
      <video
        preload="metadata"
        class="uploader-video-player"
        webkit-playsinline="true"
        x5-video-player-type="h5"
        playsinline="true"
        :controls="file.status !== 'uploading'"
      >
        <source :src="file.url" />
      </video>
      <el-progress
        v-if="file.status === 'uploading'"
        type="line"
        color="#FFF"
        :show-text="false"
        :stroke-width="4"
        :percentage="parsePercentage(file.percentage)"
      >
      </el-progress>
    </div>
    <div class="uploader-video-control">
      <el-button :icon="ElIconDelete" @click="remove"></el-button>
    </div>
  </div>
</template>

<script>
import { Delete as ElIconDelete } from '@element-plus/icons'
export default {
  data() {
    return {
      ElIconDelete,
    }
  },
  model: {
    prop: 'file',
  },
  props: {
    file: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
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
    parsePercentage(val) {
      return parseInt(val, 10)
    },
    remove() {
      this.$confirm('此操作将删除当前上传视频, 是否继续?', '删除视频？', {
        confirmButtonText: '删除',
        cancelButtonText: '保留',
        type: 'warning',
      })
        .then(() => {
          this.handleRemove()
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.uploader-video {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  user-select: none;
  cursor: default;
  white-space: nowrap;
  overflow: hidden;
  &:after {
    display: block;
    content: '';
    padding-top: 56.25%;
    pointer-events: none;
  }
  .uploader-video-player {
    position: absolute;
    background: #000;
    z-index: 0;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
  .el-progress {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 10px;
    z-index: 1;
    /deep/ .el-progress-bar__outer {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
.uploader-video-control {
  display: flex;
  justify-content: flex-end;
  padding: 10px 5px;
  .el-button {
    padding: 6px;
    /deep/ .el-icon-delete {
      font-size: 20px;
    }
    border: none;
  }
}
</style>
