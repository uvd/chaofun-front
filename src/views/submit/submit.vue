<template>
  <div id="container" class="dashboard-container container" ref="container">
    <div style="padding-top: 80px"></div>
    <div class="main_content">
      <div v-if="!ISPHONE" class="main_left"></div>
      <div class="main_center">
        <div>
          <el-form
            :model="baseForm"
            ref="baseForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="版块："
              prop="forumId"
              class="demo-forum-selector"
            >
              <el-select
                v-model="baseFormName"
                filterable
                remote
                reserve-keyword
                placeholder="请选择版块"
                :remote-method="changes"
                :style="{ width: ISPHONE ? '168px' : '' }"
                @change="changes2"
                :loading="loading"
              >
                <el-option
                  v-for="item in options"
                  :key="item.link"
                  :label="item.title"
                  :value="item.link"
                  ><img class="sicon" :src="imgOrigin + item.icon" alt="" />
                  <span>{{ item.title }}</span>
                </el-option>
              </el-select>
              <el-button type="primary" round @click="gotoV2"
                >尝试新版</el-button
              >
            </el-form-item>
            <div class="content">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="发布图片/视频" name="first">
                  <el-form-item label="标题：" prop="title">
                    <el-input
                      ref="firstTitle"
                      placeholder="请输入标题"
                      v-model="baseForm.title"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="图片/视频：" prop="ossName">
                    <el-upload
                      class="upload-demo avatar-uploader"
                      :file-list="fileList"
                      :show-file-list="false"
                      name="file"
                      :data="filedata"
                      drag
                      action="/api/upload_image"
                      :before-upload="beforeUpload"
                      :on-progress="getProgress"
                      :on-success="uploadSuccess"
                      :limit="9"
                      multiple
                    >
                      <el-icon><el-icon-upload /></el-icon>
                      <div class="el-upload__text">
                        将文件拖到此处，或<em>点击上传</em>
                      </div>
                      <!-- <div v-if="baseForm.ossName" style="position:absolute;left:0;top:0;width:100%;height:100%;background: #fff;text-align:center;">
                      <img style="max-width:100%;max-height:100%;" :src="imgOrigin+baseForm.ossName" alt="">
                    </div> -->
                      <!-- <i @click.stop="deleteImg" v-if="baseForm.ossName" class="delete_icon el-icon-delete"></i> -->
                      <div
                        class="el-upload__tip"
                        style="margin-top: 0; line-height: 24px"
                        slot="tip"
                      >
                        复制网络图片可直接粘贴完成上传图片，超过20M的图片建议拖拽上传,
                        Web 版支持多图。不支持单帖多视频发布
                      </div>
                    </el-upload>
                    <el-progress
                      v-if="progressFlag"
                      :percentage="loadProgress"
                    ></el-progress>
                    <div class="imgList">
                      <div
                        v-for="(item, index) in fileLists"
                        :key="index"
                        class="li"
                      >
                        <img
                          v-if="
                            !item.endsWith('.mp4') && !item.endsWith('.mkv')
                          "
                          :src="
                            imgOrigin +
                            item +
                            '?x-oss-process=image/resize,h_150/format,webp/quality,q_75'
                          "
                          alt=""
                        />
                        <img
                          v-if="item.endsWith('.mp4') || item.endsWith('.mkv')"
                          :src="
                            imgOrigin +
                            item +
                            '?x-oss-process=video/snapshot,t_1,h_150'
                          "
                          alt=""
                        />
                        <span class="del" @click="deleteImg(index)">删除</span>
                      </div>
                    </div>
                  </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="发布帖子" name="third">
                  <el-form-item label="标题：" prop="title">
                    <el-input
                      id="third"
                      placeholder="请输入标题"
                      v-model="baseForm.title"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="内容：" prop="link">
                    <!-- <editor-bar v-model="detail" :isClear="isClear" @change="changeEditor"></editor-bar> -->
                    <!-- <VueQuillEditor v-model="detail"
                  :options="editorOption"
                  ref="myQuillEditor">
                  </VueQuillEditor> -->
                    <quill-editor
                      v-model="detail"
                      :options="editorOption"
                      ref="myQuillEditor"
                    ></quill-editor>
                  </el-form-item>
                </el-tab-pane>

                <!-- <el-tab-pane label="发布视频" name="forth">
                  <el-form-item label="标题：" prop="title">
                      <el-input
                          placeholder="请输入标题"
                          v-model="baseForm.title"
                          clearable>
                      </el-input>
                      https://www.bilibili.com/video/av89493621/
                  </el-form-item>
                  <el-form-item label="视频地址：" prop="ossName">
                      <el-input
                          placeholder="请输入视频地址"
                          v-model="baseForm.title"
                          clearable>
                      </el-input>
                  </el-form-item>

              </el-tab-pane> -->
                <el-tab-pane label="发布链接" name="second">
                  <el-form-item label="标题：" prop="title">
                    <el-input
                      id="second"
                      placeholder="请输入标题(填入链接会自动抓取链接标题)"
                      v-model="baseForm.title"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="链接：" prop="link">
                    <el-input
                      @input="getUrlTitle"
                      type="textarea"
                      class="textarea"
                      placeholder="请输入链接地址"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      v-model="baseForm.link"
                    ></el-input>
                    <!--                <div class="el-upload__tip">* 先复制链接的话我们可能会帮你抓取到标题填上哦~<br/>* 只允许填写一个完整的链接地址~</div>-->
                    <div class="el-upload__tip" style="line-height: 20px">
                      * 先复制链接的话我们可能会帮你抓取到标题填上哦~<br />*
                      只允许填写一个完整的链接地址~
                    </div>
                  </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="发布投票" name="fourth">
                  <el-form-item label="标题：" prop="title">
                    <el-input
                      id="fourth"
                      placeholder="请输入标题"
                      v-model="baseForm.title"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="选项：" prop="link">
                    <div
                      v-for="(item, index) in voteList"
                      :key="index"
                      class="flexs"
                    >
                      <el-input
                        style="margin-bottom: 10px"
                        :placeholder="'请输入选项' + (index + 1)"
                        v-model="voteList[index].optionName"
                        clearable
                      >
                      </el-input>
                      <div v-if="voteList.length > 2" class="del">
                        <el-icon><el-icon-minus /></el-icon>
                      </div>
                    </div>
                    <div class="addbtn" style="margin-bottom: 20px">
                      <el-button @click="toAdd" type="primary"
                        >新增选项</el-button
                      >
                    </div>
                  </el-form-item>
                </el-tab-pane>
              </el-tabs>
            </div>
            <!-- <div class="markdown">
             <div class="container">
                 <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px"/>
                 <button @click="submit">提交</button>
             </div>
         </div> -->
            <el-form-item label="匿名：" prop="title">
              <template>
                <el-switch
                  class="switch"
                  v-model="anonymity"
                  :active-value="true"
                  :inactive-value="false"
                >
                </el-switch>
              </template>
            </el-form-item>
          </el-form>

          <div class="btns">
            <el-button
              @click="subs"
              type="primary"
              size="big"
              block
              :disabled="disableSubmit"
            >
              {{ submitTitle }}
            </el-button>
          </div>

          <div class="descr">
            <ul>
              <li>
                严禁发布色情、暴恐、赌博及其他违反网络安全法的内容，或涉嫌隐私或未经授权的私人图片及信息，如违规发布，请自行删除或管理员强制删除。
              </li>
              <!-- <li>版权声明
  炒饭发帖内容皆为炒饭用户发布，仅授权在煎蛋网页、煎蛋APP和煎蛋小程序访问。
  如有涉嫌侵权图请联系admin@jandan.com，告知图片URL或图片所在楼层编号以及侵权证据。</li> -->
            </ul>
          </div>
        </div>
        <el-dialog :visible.sync="dialogVisible" :modal="true">
          <el-image
            :src="bigImaUrl"
            fit="contain"
            :preview-src-list="srcList"
            ref="preview"
          ></el-image>
        </el-dialog>
      </div>
      <div v-if="!ISPHONE" class="main_right"></div>
    </div>
  </div>
  <!-- <div :class="[{'containersRight': opened}]">
      <div style="height:50px;"></div>
      <div :class="['container', 'containers',{'phone_container':ISPHONE}]">
      
      
    </div> -->
</template>

<script>
import {
  Upload as ElIconUpload,
  Minus as ElIconMinus,
} from '@element-plus/icons'
import Vue from 'vue'
// import { mavonEditor } from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
import * as api from '../../api/api'
import request from '@/utils/request'
import md5 from 'js-md5'
// import EditorBar from '../../components/wangEditor/editor'
import { quillEditor, Quill } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { container, ImageExtend } from '@/utils/quill-image-extend-module'
// import { addQuillTitle } from './modules/quill-title.js'
import '../../assets/quill/quill.core.css'
import '../../assets/quill/quill.snow.css'
import '../../assets/quill/quill.bubble.css'
import { Toast } from 'vant'
import errorLog from '../../store/modules/errorLog'
Quill.register('modules/ImageExtend', ImageExtend)
const uploadConfig = {
  action: '/api/upload_image', // 必填参数 图片上传地址
  res: (respnse) => {
    console.log(respnse)
    return respnse //return图片url
  },
  name: 'file', // 图片上传参数名
}
const vm = new Vue()
const handlers = {
  image: function image() {
    var self = this
    var fileInput = this.container.querySelector('input.ql-image[type=file]')
    let loading = null
    if (fileInput === null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('multiple', 'multiple')
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name)
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept)
      fileInput.classList.add('ql-image')
      // 监听选择文件
      fileInput.addEventListener('change', function () {
        let pro = new Promise((resolve, rej) => {
          // 判断签名有没有过期
          var res = JSON.parse(localStorage.getItem('sign'))
          var timestamp = Date.parse(new Date()) / 1000
          console.log(res)
          resolve(res)
        })
        pro.then((success) => {
          let arr = Array.from(fileInput.files)
          var data = success
          // let file = fileInput.files[0];
          for (let file of arr) {
            var ossData = new FormData()
            ossData.append('fileName', file.name)
            //key就代表文件层级和阿里云上的文件名
            let imgType = file.type.split('/')[1]
            let filename = file.name + file.size
            // let keyValue = data.dir + "/" + md5(filename) + "." + imgType;
            // ossData.append("key", keyValue);
            // ossData.append("policy", data.policy);
            // ossData.append("OSSAccessKeyId", data.accessid);
            // ossData.append("success_action_status", 201);
            // ossData.append("signature", data.signature);
            ossData.append('file', file)
            loading && loading.close()
            loading = vm.$loading({
              target: '.quill-editor',
              fullscreen: false,
              text: 'uploading...',
            })
            api.uploadImage(ossData).then((res) => {
              console.log(res)
              if (res.success) {
                let length = self.quill.getSelection(true).index
                //图片上传成功后，img的src需要在这里添加
                let url = 'https://i.chao.fun/' + res.data
                self.quill.insertEmbed(length, 'image', url)
                self.quill.setSelection(length + 1)

                fileInput.value = ''
              } else if (res.errorCode == 'invalid_content') {
                loading.close()
                Toast(res.errorMessage)
              }
            })
          }
          loading.close()
        })
      })
      this.container.appendChild(fileInput)
    }
    fileInput.click()
  },
}
export default {
  components: {
    // mavonEditor,
    quillEditor,
    ElIconUpload,
    ElIconMinus,
  },
  name: 'submit',
  data() {
    return {
      voteList: [{ optionName: '' }, { optionName: '' }],
      disableSubmit: false,
      submitTitle: '发布',
      baseFormName: '',
      fileList: [],
      fileLists: [
        // 'biz/563a9785150700000c41340852d39afa.jpg?x-oss-process=image/resize,h_512/format,webp/quality,q_75',
        // 'biz/563a9785150700000c41340852d39afa.jpg?x-oss-process=image/resize,h_512/format,webp/quality,q_75',
        // 'https://i.chao.fun/biz/563a9785150700000c41340852d39afa.jpg?x-oss-process=image/resize,h_512/format,webp/quality,q_75',
        // 'https://i.chao.fun/biz/563a9785150700000c41340852d39afa.jpg?x-oss-process=image/resize,h_512/format,webp/quality,q_75',
        // 'https://i.chao.fun/biz/563a9785150700000c41340852d39afa.jpg?x-oss-process=image/resize,h_512/format,webp/quality,q_75',
        // 'https://i.chao.fun/biz/563a9785150700000c41340852d39afa.jpg?x-oss-process=image/resize,h_512/format,webp/quality,q_75'
      ],
      filedata: {},
      activeName: 'first',
      options: [],
      baseForm: {
        forumId: '',
        title: '',
        link: '',
        ossName: '',
      },
      anonymity: false,
      loading: false,
      rules: {
        forumId: [{ required: true, message: '请选择版块', trigger: 'blur' }],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        link: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
        ossName: [{ required: true, message: '请选择图片', trigger: 'blur' }],
      },
      content: '', // 输入的markdown
      html: '', // 及时转的html
      configs: {},
      isClear: false,
      detail: '',
      editorOption: {},
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条
      dialogVisible: false,
      bigImaUrl: '',
      srcList: [],
      // editorOption: {
      //     // 图片上传的设置
      //     // uploadConfig: {
      //     //     action: '/api/upload_image',  // 必填参数 图片上传地址
      //     //     res: (respnse) => {
      //     //         console.log(respnse)
      //     //     return respnse.data.src;//return图片url
      //     //     },
      //     //     name: 'file'  // 图片上传参数名
      //     // },
      //     modules: {
      //         toolbar: {
      //             // container: toolbarOptions,  // 工具栏选项
      //             container: [
      //     ['bold', 'italic', 'underline', 'strike'],
      //     [{ 'indent': '-1' }, { 'indent': '+1' }],
      //     [{ 'size': ['12px', '14px', false ,'18px', '22px', '26px', '30px', '36px', '42px'] }],
      //     [{ 'font': [] }],
      //     [{ 'align': [] }],
      //     ["image"] //上传图片
      //   ],
      //             handlers: handlers  // 事件重写
      //         }
      //     }
      // }
    }
  },
  beforeCreate(vm) {
    console.log('this.ISPHONE', this.ISPHONE)
  },
  created() {
    this.getForum('')
  },
  beforeCreate() {},
  beforeMount() {
    this.editorOption = {
      modules: {
        ImageExtend: {
          loading: true,
          name: 'img',
          action: '/api/upload_image',
          response: (res) => {
            return 'https://i.chao.fun/' + res.data
          },
        },
        toolbar: {
          // container: toolbarOptions,  // 工具栏选项
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            // [{ 'indent': '-1' }, { 'indent': '+1' }],
            [
              {
                size: [
                  '12px',
                  '14px',
                  '16px',
                  '18px',
                  '22px',
                  '26px',
                  '30px',
                  '36px',
                  '42px',
                ],
              },
            ],
            [{ font: [] }],
            [{ align: [] }],
            ['link', 'image'], //上传图片
          ],
          handlers: handlers, // 事件重写
        },
        clipboard: {
          matchers: [
            [
              'IMG',
              () => {
                const Delta = Quill.import('delta')
                return new Delta().insert('')
              },
            ],
            [
              'PICTURE',
              () => {
                const Delta = Quill.import('delta')
                return new Delta().insert('')
              },
            ],
          ],
        },
      },
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.baseForm.forumId = '/f/' + this.$route.query.id
      this.baseFormName = this.options.filter(
        (i) => i.forumId == this.$route.query.id
      )
    }
    document.addEventListener('paste', this.toPaste)

    // 初始化聚焦默认标题
    this.$refs.firstTitle.focus()

    //  addQuillTitle();
  },
  methods: {
    imgClick(e) {
      if (e.target.localName != 'img') return
      let src = e.target.src
      this.bigImaUrl = src
      // this.srcList.push(src)
      this.dialogVisible = true
      // this.$nextTick(()=>{
      //   this.$refs.preview.showViewer = true
      // })

      // console.log(src);
    },
    getProgress(event, file, fileList) {
      console.log(event, file, fileList)
      this.progressFlag = true // 显示进度条
      this.loadProgress = parseInt(event.percent) // 动态获取文件上传进度
      if (this.loadProgress >= 100) {
        this.loadProgress = 100
        setTimeout(() => {
          this.progressFlag = false
        }, 1000) // 一秒后关闭进度条
      }
    },
    toDel(index) {
      this.voteList.splice(index, 1)
    },
    toAdd() {
      if (this.voteList.length < 6) {
        this.voteList.push({ optionName: '' })
      }
    },
    deleteImg(index) {
      // this.baseForm.ossName = ''
      this.fileLists.splice(index, 1)
    },
    changeEditor(val) {
      //   console.log(val)
      //   console.log(this.detail)
      //   this.baseForm.article = val
    },
    $imgAdd(pos, $file) {
      let formdata = new FormData()

      this.$upload
        .post('/上传接口地址', formdata)
        .then((res) => {
          this.$refs.md.$img2Url(pos, res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render
    },
    getUrlTitle() {
      api
        .getUrlTitle({ url: this.baseForm.link })
        .then((res) => {
          if (res.data !== null && this.baseForm.title === '') {
            this.baseForm.title = res.data
          }
        })
        .catch((err) => {})
    },
    toPaste(e) {
      console.log('begin to paste')
      var cbd = e.clipboardData
      var ua = window.navigator.userAgent
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
      if (item.kind == 'file') {
        var blob = item.getAsFile()
        if (blob.size === 0) {
          return
        }
        var data = new FormData()
        console.log(blob)
        data.append('file', blob)
        console.log('file.type', blob.type.split('/')[1])
        console.log('data---------', data)
        let time = new Date().getTime()
        time = md5(time + '')
        let fileName = time + '.' + blob.type.split('/')[1]
        data.append('fileName', fileName)
        request({
          url: '/api/upload_image',
          method: 'post',
          timeout: 60 * 60 * 1000,
          data,
        }).then((res) => {
          console.log(res)
          if (res.success) {
            this.baseForm.ossName = res.data
            this.fileLists.push(res.data)
          }
        })
      }
      // }
    },
    // 提交
    submit() {
      console.log(this.content)
      console.log(this.html)
      this.$message.success('提交成功，已打印至控制台！')
    },
    uploadSuccess(file) {
      console.log('file', file)
      console.log(this.fileList)
      if (file.success) {
        this.baseForm.ossName = file.data
        this.fileLists.push(file.data)
      } else if (file.errorCode == 'invalid_content') {
        this.$toast(file.errorMessage)
        this.filedata = {}
        this.baseForm.ossName = ''
      }
    },
    subs() {
      console.log(this.voteList)
      this.submitTitle = '发布中'
      this.disableSubmit = true

      this.doLoginStatus().then((res) => {
        if (res) {
          if (this.activeName == 'first') {
            delete this.baseForm.link
            delete this.baseForm.article
            delete this.baseForm.articleType
          } else if (this.activeName == 'third') {
            delete this.baseForm.link
            delete this.baseForm.ossName
            // this.baseForm.forumId = '16';

            this.baseForm.article = this.detail
            this.baseForm.articleType = 'richtext'
          } else if (this.activeName == 'second') {
            delete this.baseForm.ossName
            delete this.baseForm.article
            delete this.baseForm.articleType
          } else {
            delete this.baseForm.link
            delete this.baseForm.ossName
            delete this.baseForm.article
            delete this.baseForm.articleType
          }
          for (var i of Object.entries(this.baseForm)) {
            if (!i[1]) {
              console.log(999)
              this.$message.error(this.rules[i[0]][0].message)
              this.submitTitle = '发布'
              this.disableSubmit = false
              return
            }
          }
          if (this.activeName == 'first') {
            delete this.baseForm.link
            let params = {
              title: this.baseForm.title,
              forumId: this.baseForm.forumId.split('/')[2],
              anonymity: this.anonymity,
            }
            if (this.fileLists.length == 1) {
              params.ossName = this.fileLists[0]
            } else {
              params.ossNames = this.fileLists.join(',')
            }
            api.submitImage(params).then((res) => {
              if (res.success) {
                this.$message.success('发布成功')
                setTimeout(() => {
                  // window.location.reload()
                  this.$router.replace({ path: this.baseForm.forumId })
                }, 1500)
              } else {
                this.submitTitle = '发布'
                this.disableSubmit = false
              }
            })
          } else if (this.activeName == 'third') {
            let params = {
              title: this.baseForm.title,
              article: this.baseForm.article,
              articleType: this.baseForm.articleType,
              forumId: this.baseForm.forumId.split('/')[2],
              anonymity: this.anonymity,
            }
            api
              .submitArticle(params)
              .then((res) => {
                if (res.success) {
                  this.$message.success('发布成功')
                  setTimeout(() => {
                    // window.location.reload()
                    this.$router.replace({ path: this.baseForm.forumId })
                  }, 1500)
                } else {
                  this.submitTitle = '发布'
                  this.disableSubmit = false
                }
              })
              .catch((error) => {
                this.submitTitle = '发布'
                this.disableSubmit = false
                this.$toast('发布失败，请联系开发同学查看')
              })
          } else if (this.activeName == 'second') {
            let params = {
              title: this.baseForm.title,
              link: this.baseForm.link,
              forumId: this.baseForm.forumId.split('/')[2],
              anonymity: this.anonymity,
            }
            api.submitLink(params).then((res) => {
              if (res.success) {
                this.$message.success('发布成功')
                setTimeout(() => {
                  // window.location.reload()
                  this.$router.replace({ path: this.baseForm.forumId })
                }, 1500)
              } else {
                this.submitTitle = '发布'
                this.disableSubmit = false
              }
            })
          } else if (this.activeName == 'fourth') {
            var c = true
            this.voteList.forEach((item) => {
              if (!item.optionName) {
                c = false
              }
            })
            if (c) {
              let params = {
                title: this.baseForm.title,
                options: JSON.stringify(this.voteList),
                forumId: this.baseForm.forumId.split('/')[2],
                anonymity: this.anonymity,
              }
              api.submitVote(params).then((res) => {
                if (res.success) {
                  this.$message.success('发布成功')
                  setTimeout(() => {
                    // window.location.reload()
                    this.$router.replace({ path: this.baseForm.forumId })
                  }, 1500)
                } else {
                  this.submitTitle = '发布'
                  this.disableSubmit = false
                }
              })
            } else {
              this.$message.error('选项未填写完整')
            }

            console.log(params)
          }
          // document.getElementById(this.activeName).focus();
        }
      })
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1000
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 100MB!')
        return false
      }
      this.filedata.fileName = file.name
      return true
    },
    handleClick(tab, event) {
      if (tab.paneName == 'third') {
        this.$nextTick(() => {
          document
            .getElementsByClassName('quill-editor')[0]
            .addEventListener('click', (e) => {
              this.imgClick(e)
            })
        })
      } else {
        document
          .getElementsByClassName('quill-editor')[0]
          .removeEventListener('click', (e) => {
            this.imgClick(e)
          })
      }

      // Title聚焦
      this.$nextTick(() => {
        tab.$children[0].$children
          .find((component) => component.type === 'text')
          .focus()
      })
    },
    toOpen(v) {
      console.log(v)
      this.$router.push({ path: v })
    },
    changes(v) {
      console.log(v)
      this.getForum(v ? v : '')
    },
    changes2(v) {
      console.log(v)
      this.baseForm.forumId = v
    },
    getForum(keyword) {
      api.searchForum({ keyword }).then((res) => {
        this.options = res.data
        if (this.$route.query.id) {
          this.baseForm.forumId = '/f/' + this.$route.query.id
          let a = this.options.filter((i) => i.forumId == this.$route.query.id)
          if (a.length) {
            this.baseFormName = this.options.filter(
              (i) => i.forumId == this.$route.query.id
            )[0]['title']
          } else {
            this.baseFormName = this.$route.query.name
          }

          // if(){

          // }
          console.log(222, this.baseFormName)
        }
      })
    },
    gotoV2() {
      const path = this.baseForm.forumId
        ? `${this.baseForm.forumId}/submit`
        : `/f/submit`
      this.$router.push({ path })
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  padding: 0;
  width: 2px;
  height: 44px;
  // background-color: rgba(0, 0, 0, .2);
  // background-color: #f1f1f1;
  background-color: #999;
}
::-webkit-scrollbar {
  width: 2px;
  padding: 1px;
  // height: 44px;
  background-color: #fff;
}
.containersRight {
  margin-right: 240px;
}
.containers {
  width: 1000px;
  margin: 40px auto;
  padding: 30px 30px 100px;
  background: #fff;
  height: 100vh;
  overflow-y: scroll;
}
.phone_container {
  width: 100%;
  margin: 0;
  padding: 0;
  padding-top: 30px;
  /deep/ .el-form-item__label {
    width: 70px !important;
  }
  /deep/ .el-form-item__content {
    margin-left: 70px !important;
  }
  .el-button {
    width: 100%;
  }
  .btns {
    padding: 4px;
  }
  /deep/ .el-upload-dragger {
    width: 318px;
  }
}
.sicon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 4px;
}
.content {
  // height: 400px;
  // padding-left: 40px;
}
.upload-demo {
  margin: 20px 0 0;
  position: relative;
}
.delete_icon {
  position: absolute;
  font-size: 20px;
  right: 10px;
  bottom: 10px;
  z-index: 1;
}
.textarea {
  margin: 20px 0 0px;
}
.btns {
  // position: fixed;
  // width: 100%;
  left: 0;
  bottom: 0;
  padding-left: 100px;
  display: flex;
  // flex-direction: row-reverse;
  // text-align: center;
}
/deep/ .el-tabs__nav-scroll {
  padding-left: 40px;
  margin-bottom: 20px;
}
/deep/ .el-tabs__nav-wrap::after {
  display: none;
}
.descr ul {
  padding: 20px 120px;
  padding-right: 0;
  li {
    list-style: disc;
    font-size: 13px;
    color: #999;
  }
}
.imgList {
  display: flex;
  flex-flow: wrap;
  .li {
    flex: 0 0 200px;
    height: 200px;
    margin-top: 10px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .del {
      position: absolute;
      padding: 4px 10px;
      right: 4px;
      bottom: 4px;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      border-radius: 4px;
      cursor: pointer;
      display: none;
    }
  }
  .li:hover .del {
    display: block;
  }
}
.flexs {
  display: flex;
  .del {
    flex: 0 0 40px;
    text-align: center;
    color: red;
  }
}
/deep/ .el-dialog__body {
  display: flex;
  justify-content: center;
}
.demo-forum-selector {
  position: relative;
  .el-button {
    position: absolute;
    right: 0;
  }
}
</style>
