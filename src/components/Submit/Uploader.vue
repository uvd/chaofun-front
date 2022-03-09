<template>
  <div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragover && !moving,
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <UploadVideo
      v-model="files[0]"
      :disabled="disabled"
      :handleRemove="handleRemove"
      :handleMove="onMove"
      :handlePreview="onPreview"
      :handleClick="handleClick"
      :listType="listType"
      v-if="files.length > 0 && isVideo"
    >
    </UploadVideo>
    <UploadList
      v-model="files"
      :disabled="disabled"
      :handleRemove="handleRemove"
      :handleMove="onMove"
      :handlePreview="onPreview"
      :handleClick="handleClick"
      :listType="listType"
      v-else-if="files.length > 0"
    >
    </UploadList>
    <div class="image-uploader-free" @click="handleClick" v-else>
      <p>将文件拖到此处，或 <el-button round>点击上传</el-button></p>
      <p class="tip">试试直接粘贴图片，更快上传！</p>
    </div>
    <input
      class="el-upload__input"
      type="file"
      ref="inputUploader"
      :name="name"
      @change="handleChange"
      :multiple="multiple"
      :accept="accept"
    />
  </div>
</template>

<script>
import ajax from 'element-ui/packages/upload/src/ajax'
import UploadList from './UploadList'
import UploadVideo from './UploadVideo'
import exif from '@/utils/exif-check'

function noop() {}

export default {
  components: {
    UploadList,
    UploadVideo,
  },
  model: {
    prop: 'fileList',
  },
  mounted() {
    // 拖拽更改Hover样式
    document.addEventListener('dragover', () => {
      this.isDrag = true
    })
    document.addEventListener('dragleave', () => {
      this.isDrag = false
    })
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    headers: {
      type: Object,
      default() {
        return {}
      },
    },
    data: Object,
    multiple: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: 'file',
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true,
    },
    accept: String,
    type: {
      type: String,
      default: 'select',
    },
    beforeUpload: Function,
    beforeRemove: Function,
    onRemove: {
      type: Function,
      default: noop,
    },
    onChange: {
      type: Function,
      default: noop,
    },
    onPreview: {
      type: Function,
    },
    onSuccess: {
      type: Function,
      default: noop,
    },
    onProgress: {
      type: Function,
      default: noop,
    },
    onError: {
      type: Function,
      default: noop,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String,
      default: 'picture',
    },
    httpRequest: {
      type: Function,
      default: ajax,
    },
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: noop,
    },
    // 是否支持粘贴上传
    pasteUpload: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dragover: false,
      moving: false,
      files: [],
      fileList: [],
      draging: false,
      isDrag: false,
      isVideo: false, // 是否视频模式
      tempIndex: 1,
      reqs: {},
    }
  },
  mounted() {
    // 监听粘贴上传
    document.addEventListener('paste', this.toPaste)
  },
  beforeDestroy() {
    // 移除监听上传
    document.removeEventListener('paste', this.toPaste)
  },
  watch: {
    // fileList: {
    //   immediate: true,
    //   handler(fileList) {
    //     this.files = fileList.map(item => {
    //       item.uid = item.uid || (Date.now() + this.tempIndex++);
    //       item.status = item.status || 'success';
    //       return item;
    //     });
    //   }
    // }
  },
  methods: {
    // === Drag ===
    onDragover() {
      if (!this.disabled) {
        this.dragover = true
      }
    },
    onDrop(e) {
      this.dragover = false
      if (!this.accept) {
        this.uploadFiles(e.dataTransfer.files)
        return
      }
    },
    onMove(movingStatus) {
      if (!this.disabled) {
        this.moving = movingStatus
      }
      // 同步数据
      this.fileList = this.files.map((file) => file.response.data)
      this.$emit('input', this.fileList)
    },

    // === Upload ===
    handleChange(ev) {
      const files = ev.target.files
      if (!files) return
      this.uploadFiles(files)
    },
    async uploadFiles(files) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList)
        return
      }
      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }
      if (postFiles.length === 0) {
        return
      }

      // 检测图片
      for (let index = 0; index < postFiles.length; index++) {
        let rawFile = postFiles[index]
        // 如果视频只上传第一个
        if (
          [
            'video/mp4',
            'video/quicktime',
            'video/x-quicktime',
            'image/mov',
            'video/avi',
            'application/mp4',
          ].includes(rawFile.type)
        ) {
          if (this.files.length > 0) {
            this.$message.error(
              '图片和视频不能同时上传，并且只支持上传1个视频！',
              {
                duration: 5000,
              }
            )
            return
          }
          // 视频上传模式
          this.isVideo = true
          this.handleStart(rawFile)
          if (this.autoUpload) this.upload(rawFile)
          break
        }

        // TODO: 前端暂时只做jpg检测，其他格式（TIFF, HEIC）后端默认会转成jpg
        if (['image/jpeg'].includes(rawFile.type)) {
          const data = await exif(rawFile, this.$createElement)
          if (data === false) {
            return
          }
          if (data !== true) {
            rawFile = data
          }
        }

        this.handleStart(rawFile)
        if (this.autoUpload) this.upload(rawFile)
      }
    },
    upload(rawFile) {
      this.$refs.inputUploader.value = null
      if (!this.beforeUpload) {
        return this.post(rawFile)
      }
      const before = this.beforeUpload(rawFile)
      if (before && before.then) {
        before.then(
          (processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile)
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type,
                })
              }
              for (const p in rawFile) {
                if (rawFile.hasOwnProperty(p)) {
                  processedFile[p] = rawFile[p]
                }
              }
              this.post(processedFile)
            } else {
              this.post(rawFile)
            }
          },
          () => {
            this.onRemove(null, rawFile)
          }
        )
      } else if (before !== false) {
        this.post(rawFile)
      } else {
        this.onRemove(null, rawFile)
      }
    },
    post(rawFile) {
      const { uid, name } = rawFile
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: {
          ...this.data,
          fileName: name,
        },
        filename: this.name,
        action: this.action,
        onProgress: (e) => {
          this.handleProgress(e, rawFile)
        },
        onSuccess: (res) => {
          this.handleSuccess(res, rawFile)
          delete this.reqs[uid]
        },
        onError: (err) => {
          this.handleError(err, rawFile)
          delete this.reqs[uid]
        },
      }
      const req = this.httpRequest(options)
      this.reqs[uid] = req
      if (req && req.then) {
        req.then(options.onSuccess, options.onError)
      }
    },

    // === Main ===
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++
      let file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile,
      }
      if (this.listType === 'picture-card' || this.listType === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
          return
        }
      }
      this.files.push(file)
      this.onChange(file, this.files)
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile)
      this.onProgress(ev, file, this.files)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile)
      try {
        if (file && res && res.success) {
          file.status = 'success'
          file.response = res
          // 转换格式图片后缀不一致更换图片地址
          if (
            rawFile.name.split('.').pop().toLowerCase() !==
            res.data.split('.').pop().toLowerCase()
          ) {
            file.url = `${this.imgOrigin}${res.data}`
          }
          this.fileList.push(res.data)
          this.$emit('input', this.fileList)
          this.onSuccess(res, file, this.files)
          this.onChange(file, this.files)
          return
        }
      } catch (error) {
        // 内部错误
        console.log(error)
      }

      this.handleError(res.errorMessage || '上传错误，请重试！', rawFile)
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile)
      const fileList = this.files
      file.status = 'fail'
      fileList.splice(fileList.indexOf(file), 1)
      this.$message.error(err)
      this.onError(err, file, this.files)
      this.onChange(file, this.files)
      // 视频处理
      if (this.isVideo) {
        // 视频处理
        this.isVideo = false
      }
    },
    handleRemove(file, raw) {
      if (raw) {
        file = this.getFile(raw)
      }
      let doRemove = () => {
        this.abort(file)
        let fileList = this.files
        fileList.splice(fileList.indexOf(file), 1)

        // 删除照片
        this.fileList.splice(this.fileList.indexOf(file.response.data), 1)
        this.$emit('input', this.fileList)
        this.onRemove(file, fileList)
        if (this.isVideo) {
          // 视频处理
          this.isVideo = false
        }
      }
      if (!this.beforeRemove) {
        doRemove()
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.files)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
    },
    handleClick() {
      if (!this.disabled) {
        this.$refs.inputUploader.value = null
        this.$refs.inputUploader.click()
      }
    },
    handleKeydown(e) {
      if (e.target !== e.currentTarget) return
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick()
      }
    },
    getFile(rawFile) {
      let fileList = this.files
      let target
      fileList.every((item) => {
        target = rawFile.uid === item.uid ? item : null
        return !target
      })
      return target
    },
    abort(file) {
      const { reqs } = this
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (reqs[uid]) {
          reqs[uid].abort()
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort()
          delete reqs[uid]
        })
      }
    },
    clearFiles() {
      this.uploadFiles = []
    },
    // 粘贴上传
    toPaste(event) {
      const { pasteUpload } = this
      // 是否允许上传
      if (!pasteUpload) {
        return
      }

      // 获取剪贴板文件
      const items = (event.clipboardData && event.clipboardData.items) || []
      if (!items || !items.length) {
        return
      }
      let file = null
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile()
          break
        }
      }
      // 没有图片那么不上传
      if (!file) {
        return
      }

      this.uploadFiles([file])
    },
  },
}
</script>

<style lang="scss" scoped>
.el-upload-dragger {
  width: 100%;
  height: auto;
  cursor: auto;
  &:hover {
    border-color: #d9d9d9;
  }
}
.image-uploader-free {
  min-height: 280px;
  display: flex;
  justify-content: center;
  flex-flow: column nowrap;
  flex-grow: 1;
  text-align: center;
  cursor: pointer;
}
.tip {
  line-height: 24px;
  color: #ff4949;
  font-size: 16px;
  font-weight: bold;
}
</style>
