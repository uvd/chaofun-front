<template>
  <div
    class="editor-wrapper"
    :class="{
      fullscreen: isFullscreen,
    }"
  >
    <editor
      v-loading="loading"
      :initialValue="content"
      initialEditType="wysiwyg"
      :options="editorOptions"
      @change="onEditorChange"
      ref="editor"
    />
    <el-button class="switch-mode" @click="switchMode" round>
      {{ editType === 'wysiwyg' ? 'Markdown模式' : '切换传统编辑器' }}
    </el-button>
  </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import Editor from '@toast-ui/editor'
import { Editor as VueEditor } from '@toast-ui/vue-editor'
import { uploadImage } from '@/api/api'
Editor.setLanguage('zh-CN', {
  URL: '链接',
  'Link text': '标题',
})

export default {
  components: {
    editor: VueEditor,
  },
  data() {
    return {
      content: '',
      loading: false,
      isFullscreen: false,
      editType: 'wysiwyg',
      editorOptions: {
        language: 'zh-CN',
        hideModeSwitch: true,
        toolbarItems: [
          [
            {
              el: this.createFullscreenButton(),
              command: 'full-screen',
              tooltip: '全屏',
            },
          ],
          ['bold', 'italic', 'link', 'strike', 'code'],
          ['heading', 'ul', 'ol', 'quote', 'codeblock'],
          ['table', 'image'],
        ],
        hooks: {
          addImageBlobHook: (blob, callback) => {
            this.upload(blob).then((url) => callback(url, blob.name))
          },
        },
        placeholder: '写点什么吧~',
        minHeight: '300px',
        autofocus: false,
      },
    }
  },
  mounted() {
    this.$refs.editor.invoke('setLanguage')
  },
  methods: {
    onEditorChange() {
      this.content = this.$refs.editor.invoke('setHtml')
    },
    set(content) {
      this.content = this.$refs.editor.invoke('setHTML', content)
    },
    get() {
      return this.$refs.editor.invoke('getHTML')
    },
    switchMode() {
      this.editType = this.editType === 'wysiwyg' ? 'markdown' : 'wysiwyg'
      this.$refs.editor.invoke('changeMode', this.editType)
    },
    // 图片上传
    async upload(file) {
      this.loading = true
      const formdata = new FormData()
      formdata.append('file', file)
      formdata.append('fileName', file.name)
      try {
        const result = await uploadImage(formdata)
        if (!result) {
          this.$message.error('网络错误或文件过大，请重试上传！')
          this.loading = false
          return
        }
        if (!result.success) {
          this.$message.error(result.errorMessage)
          this.loading = false
          return
        }
        this.loading = false
        return `${this.imgOrigin}${result.data}`
      } catch (error) {
        console.error(error)
        this.$message.error('网络错误或文件过大，请重试上传！')
      }
      this.loading = false
    },
    // 创建全屏按钮
    createFullscreenButton() {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'toastui-editor-toolbar-icons fullscreen-icon'
      button.style.backgroundImage = 'none'
      button.style.margin = '0'
      button.innerHTML = `<i class="el-icon-monitor" />`
      button.addEventListener('click', () => {
        // toggleEditorFullScreen(this.$refs.editor)
        this.isFullscreen = !this.isFullscreen
      })

      return button
    },
  },
}
</script>

<style lang="scss">
.editor-wrapper {
  position: relative;
  .switch-mode {
    position: absolute;
    right: 5px;
    top: 12px;
    border: none;
    color: #ff2d20;
    background-color: transparent;
    font-weight: bold;
    padding: 4px 8px;
    line-height: 16px;
    &:hover {
      background-color: rgba(28, 28, 28, 0.08);
    }
  }
}
.toastui-editor-defaultUI {
  .toastui-editor-toolbar {
    padding: 0 100px 0 0;
    background-color: #f7f9fc;
    border-bottom: 1px solid #ebedf2;
    .toastui-editor-defaultUI-toolbar {
      padding: 0;
      background: none;
      border: none;
    }
  }
  .ProseMirror {
    padding: 8px 16px;
    position: relative;
    bottom: 0px;
    top: 0px;
  }
}
.toastui-editor-popup-body {
  label {
    line-height: 15px;
  }
  .toastui-editor-button-container {
    line-height: 32px;
  }
}
.toastui-editor-toolbar-divider {
  margin: 14px 4px;
}
.fullscreen {
  height: 100vh !important;
  width: 100vw;
  position: fixed;
  z-index: 9999;
  top: 0px;
  left: 0px;
  background-color: white;
  .switch-mode {
    z-index: 99999;
  }
  > div {
    height: 100vh !important;
  }
}
.fullscreen-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 20px;
  }
}
</style>
