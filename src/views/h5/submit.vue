<template>
  <div>
    <div class="container">
      <div style="height: 50px"></div>
      <div class="item">
        <div class="label">发布版块</div>
        <div>
          <input
            v-model="keyword"
            :placeholder="chooseItem.title || '搜索版块'"
            type="text"
          />
          <div class="lists">
            <div
              v-for="(item, index) in options"
              @click="choose(item, index)"
              :key="index"
              :class="[{ active: indexs == index }]"
            >
              <img :src="imgOrigin + item.icon" alt="" />
              <span>{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="label">帖子标题</div>
        <textarea
          type="text"
          v-model="baseForm.title"
          autosize
          rows="1"
          style="width: 100%; height: 80px"
          placeholder="请输入标题"
        ></textarea>
      </div>
      <div class="item">
        <div class="label">帖子类型</div>
        <van-radio-group v-model="radio" direction="horizontal">
          <van-radio name="1">图片</van-radio>
          <van-radio name="2">链接</van-radio>
          <van-radio name="3">帖子</van-radio>
        </van-radio-group>
      </div>

      <div v-if="radio == 1" class="item">
        <div class="label"></div>
        <van-uploader
          v-model="fileList"
          :max-count="1"
          :max-size="20971520"
          :after-read="afterRead"
        />
      </div>
      <div v-if="radio == 2" class="item">
        <div class="label"></div>
        <textarea
          v-model="baseForm.link"
          type="text"
          autosize
          rows="1"
          style="width: 100%; height: 80px"
          placeholder="请输入链接"
        ></textarea>
      </div>
      <div v-if="radio == 3" class="item">
        <div class="label"></div>
        <div>该类型只支持pc端发布</div>
      </div>
      <div class="btn">
        <van-button @click="sub" block type="info">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import vant from 'vant'
import 'vant/lib/index.css'
import * as api from '../../api/api'
Vue.use(vant)
export default {
  name: '',
  data() {
    return {
      radio: '1',
      username: '',
      options: [],
      loading: false,
      targetForumId: '',
      keyword: '',
      options: [],
      indexs: '',
      chooseItem: {},
      addForm: {
        targetForumId: '',
      },
      fileList: [],
      baseForm: {},
    }
  },
  watch: {
    keyword(n, o) {
      this.indexs = ''
      this.chooseItem = {}
      this.getForum(n)
    },
  },
  components: {},
  created() {
    if (this.$route.query.id) {
      this.addForm.targetForumId = '/f/' + this.$route.query.id
    }
  },
  mounted() {
    this.getForum()
  },
  methods: {
    choose(item, index) {
      this.indexs = index
      this.chooseItem = item
      this.keyword = item.title
      this.addForm.targetForumId = item.link
    },
    getForum(keyword) {
      api.searchForum({ keyword }).then((res) => {
        if (res.data.length) {
          this.options = res.data
          this.chooseItem = res.data[0]
          this.addForm.targetForumId = this.options[0].link
        }
      })
    },
    sub() {
      let params = {}
      if (this.radio == 1) {
        params = {
          title: this.baseForm.title,
          ossName: this.baseForm.ossName,
          forumId: this.addForm.targetForumId.split('/')[2],
        }
        if (params.title && params.ossName && params.forumId) {
          api.submitImage(params).then((res) => {
            if (res.success) {
              this.$message.success('发布成功')
              setTimeout(() => {
                // window.location.reload()
                this.$router.replace({ path: this.addForm.targetForumId })
              }, 1500)
            }
          })
        } else {
          this.$toast('请填写完整')
        }
      } else if (this.radio == 2) {
        params = {
          title: this.baseForm.title,
          link: this.baseForm.link,
          forumId: this.addForm.targetForumId.split('/')[2],
        }
        if (params.title && params.link && params.forumId) {
          api.submitLink(params).then((res) => {
            if (res.success) {
              this.$message.success('发布成功')
              setTimeout(() => {
                this.$router.replace({ path: this.addForm.targetForumId })
              }, 1500)
            }
          })
        } else {
          this.$toast('请填写完整')
        }
      } else if (this.radio == 3) {
        this.$toast('富文本帖子请用PC端发布')
      }
    },
    afterRead(files) {
      files.status = 'uploading'
      files.message = '上传中...'
      console.log(files)
      let formdata = new FormData()
      formdata.append('file', files.file)
      formdata.append('fileName', files.file.name)
      api.uploadImage(formdata).then((res) => {
        console.log(res)
        files.status = 'done'
        if (res.success) {
          files.message = ''
          this.baseForm.ossName = res.data
        } else if (res.errorCode == 'invalid_content') {
          this.$toast(res.errorMessage)
          this.fileList = []
          this.baseForm.ossName = ''
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
/deep/ .van-radio--horizontal {
  margin-right: 30px;
}
.container {
  background: #fff;
  padding-bottom: 120px;
  height: 100vh;
  overflow-y: scroll;
}
.item {
  background: #fff;
  padding: 20px;
  border-bottom: 1px dashed #f1f1f1;
  display: flex;
  .label {
    flex: 0 0 90px;
    color: #333;
    font-weight: bold;
    font-size: 14px;
  }
}
input,
textarea {
  border: 1px solid #ddd;
  padding: 6px;
}
.bankuai {
  display: flex;
  .label {
    flex: 0 0 78px;
    text-align: center;
    line-height: 40px;
    margin-right: 8px;
  }
}
.v {
  flex: 1;
}
.lists {
  max-height: 200px;
  width: 100%;
  overflow-y: scroll;
  div {
    padding: 10px;
    border-bottom: 1px dashed #ddd;
  }
  .active {
    color: #07c160;
  }
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    vertical-align: top;
  }
}
.bbbb {
  display: flex;
  button {
    flex: 1;
    margin: 0 10px;
  }
}
.btn {
  padding: 30px 40px;
}
</style>
