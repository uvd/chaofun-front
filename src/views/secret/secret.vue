<template>
  <div id="cc" class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="container">
      <div style="height: 50px"></div>
      <el-row :gutter="24">
        <el-col :span="24" :offset="0">
          <div style="display: flex; width: 840px; margin: 0 auto">
            <div
              class="content"
              :style="{ width: ISPHONE ? imgMaxWidth + 80 + 'px' : '640px' }"
            >
              <div
                :style="{
                  height: ISPHONE ? 'auto' : '440px',
                  maxWidth: ISPHONE ? imgMaxWidth + 80 + 'px' : '640px',
                  marginBottom: '20px',
                  overflow: 'hidden',
                }"
              >
                <div
                  v-viewer=""
                  v-if="!secret.imageUrl.includes('.mp4')"
                  :style="{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    margin: 'auto',
                    display: 'inline',
                  }"
                >
                  <img
                    v-if="!secret.imageUrl.includes('.gif')"
                    v-bind:src="
                      secret.imageUrl +
                      '?x-oss-process=image/resize,h_768/format,webp/quality,q_75'
                    "
                    :data-source="secret.imageUrl"
                    :style="{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      margin: 'auto',
                      display: 'table-cell',
                    }"
                  />
                  <img
                    v-if="gifShow && secret.imageUrl.includes('.gif')"
                    v-bind:src="secret.imageUrl"
                    :data-source="secret.imageUrl"
                    :style="{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      margin: 'auto',
                      display: 'table-cell',
                    }"
                  />
                  <img
                    v-if="!gifShow && secret.imageUrl.includes('.gif')"
                    v-bind:src="secret.imageUrl"
                    :data-source="secret.imageUrl"
                    :style="{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      margin: 'auto',
                      display: 'table-cell',
                    }"
                  />
                </div>
                <video
                  v-if="secret.imageUrl.includes('.mp4')"
                  controls
                  autoplay
                  loop
                  :src="secret.imageUrl"
                  alt=""
                  :style="{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    margin: 'auto',
                  }"
                ></video>
              </div>
              <!--            <el-input v-model="secret.subReddit" @focus="doFocus(1)" @blur="doFocus(2)" :style="{width: '100%'}" :disabled="true">-->
              <!--            </el-input>-->
              <!--            <el-input v-model="secret.enTitle" @focus="doFocus(1)" @blur="doFocus(2)" :disabled="true">-->
              <!--            </el-input>-->
              <el-input
                v-model="secret.cnTitle"
                placeholder="标题 (选填)"
                @focus="doFocus(1)"
                @blur="doFocus(2)"
                :style="{ width: '100%' }"
              >
              </el-input>
              <div class="searchBox">
                <div class="searchs">
                  <!-- <input placeholder="搜索版块" type="text"> -->
                  <div style="font-size: 16px; margin: 10px 0">
                    选择发布的版块：
                  </div>
                  <el-input
                    v-model="keyword"
                    :placeholder="forumsName"
                    style="width: 200px; margin-right: 30px"
                    clearable
                  ></el-input>
                  <el-button @click="reset" type="primary" size="mini"
                    >恢复默认</el-button
                  >
                </div>
                <div class="boxs">
                  <!-- <div class="items" v-if="keyword">
                      <span class="item" v-for="(item,index) in forums" :key="index"><img :src="imgOrigin+item.icon" alt="">{{item.title}}</span>
                    </div> -->
                  <div class="items">
                    <span
                      @click="chooseItem(item)"
                      :class="['item', { item_active: activeId == item.id }]"
                      v-for="(item, index) in forums"
                      :key="index"
                      ><img :src="imgOrigin + item.imageName" alt="" />{{
                        item.name
                      }}</span
                    >
                  </div>
                </div>
              </div>
              <!-- <el-select v-model="secret.submitForum" style="width:120px;">
                  <el-option
                      v-for="item in forums"
                      :key="item.id.toString()"
                      :label="item.name"
                      :value="item.id.toString()"
                  />
                </el-select>           -->
              <div class="subs">
                <el-button
                  type="primary"
                  v-on:click="submit"
                  :disabled="isSend"
                  :style="{ marginLeft: '20px' }"
                  >发布</el-button
                >
                <el-button
                  type="success"
                  v-on:click="skip"
                  :style="{ marginLeft: '20px' }"
                  >跳过</el-button
                >
              </div>
            </div>
            <div
              @keydown.prevent
              @keypress.prevent
              @keyup.prevent
              v-if="!ISPHONE"
              class="right_desc"
            >
              <div style="font-size: 20px; color: black">类型选择：</div>
              <div>
                <el-radio @change="generate" v-model="imageSource" label="all/"
                  >全部</el-radio
                >
              </div>
              <div>
                <el-radio
                  @change="generate"
                  v-model="imageSource"
                  label="pixiv/"
                  >二次元</el-radio
                >
              </div>
              <div>
                <el-radio
                  @change="generate"
                  v-model="imageSource"
                  label="artstation/"
                  >艺术</el-radio
                >
              </div>
              <div>
                <el-radio
                  @change="generate"
                  v-model="imageSource"
                  label="memes/"
                  >memes</el-radio
                >
              </div>

              <p style="padding-top: 20px">可以 ⬆️ 方向键直接提交图片</p>
              <p>可以 ➡️ 方向键快速跳过图片</p>
              <p>点击提交后，图片会从图库中删除，由你的账号发布到炒饭主站。</p>
              <p>图片不会重复出现（图库很大，请放心跳过）</p>
              <p>标题尽量编辑成通顺的话，如果有可能的话，希望做到信达雅：）</p>
              <p>请提交时尽量选择合适的版块（重要）</p>
              <p>如遇到违法图片，请立即向站长反馈并使用跳过按钮删除</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '../../api/api'
function ClearSubmit(e) {
  if (e.keyCode == 39) {
    return false
  }
}

export default {
  name: 'Secret',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      imageSource: 'all/',
      gifShow: false,
      keyword: '',
      ossName: '',
      secret: {
        imageUrl: 'xxx.png',
      },
      preLoadSecret: {},
      titleInputFocus: false,

      forums: [],
      keyNext: true,
      defaultId: '',
      defaultName: '',
      activeId: '',
      isSend: false,
    }
  },
  watch: {
    // 'params.forumId'(v){
    //   this.params.pageNum = 1;
    //   this.lists = []
    // }
    keyword(v) {
      if (v) {
        this.getForum(v)
      } else {
        this.getDefaultForum()
      }
    },
  },
  computed: {
    forumsName: {
      // if(this.keyword){

      // }else{
      //   return this.defaultName
      // }
      get() {
        // console.log('计算属性', this.message)
        // return this.defaultName
        let name
        this.forums.forEach((i) => {
          if (i.id == this.activeId) {
            name = i.name
          }
        })
        return name
      },
      set(newVal) {
        // this.message = newVal
        // console.log('newVal', newVal)
      },
    },
    ...mapGetters(['roles', 'islogin']),
  },
  mounted() {
    // api.getMenu({pageNum:1,order:'new'}).then(res=>{
    //   console.log(res)
    // })
    let self = this
    document.onkeydown = function (event) {
      var e = event || window.event || arguments.callee.caller.arguments[0]
      if (e && e.keyCode == 39) {
        //右
        if (self.keyNext) {
          self.skip()
          console.log(2)
        }
      }

      if (e && e.keyCode == 38) {
        //上
        if (self.keyNext) {
          self.submit()
          console.log(3)
        }
      }
    }
  },
  created() {
    this.generate()
    this.getDefaultForum()
    // this.getForum('')
  },
  methods: {
    dealResponse(res) {
      if (res.data.imageName == null) {
        this.$toast('没有该类型的内容了，请选择其他类型')
        return
      }
      this.keyword = ''
      this.secret = res.data
      this.defaultId = res.data.submitForum
      this.activeId = res.data.submitForum
      this.ossName = res.data.imageName
      this.getForumById(this.secret.submitForum)
    },
    getForumById(forumId) {
      api.getForumInfo({ forumId: forumId }).then((res) => {
        var isAdd = true
        this.forums.forEach((i) => {
          if (i.id == res.data.id) {
            isAdd = false
          }
        })
        if (isAdd) {
          this.forums.unshift(res.data)
        }
      })
    },
    generate() {
      api.generate_secret_image({ prefix: this.imageSource }).then((res) => {
        this.dealResponse(res)
      })
    },
    reset() {
      this.activeId = this.defaultId
      this.keyword = ''
    },
    chooseItem(item) {
      this.activeId = item.id
      this.forumsName = item.name
    },
    getDefaultForum() {
      api.list_forums().then((res) => {
        res.data.forEach((i) => {
          if (i.id == this.defaultId) {
            this.defaultName = i.name
          }
        })
        this.forums = res.data
      })
    },
    doFocus(v) {
      if (v == 1) {
        this.keyNext = false
      } else {
        this.keyNext = true
      }
    },
    getForum(keyword) {
      api.searchForum({ keyword }).then((res) => {
        if (res.data.length) {
          res.data.forEach((item) => {
            item.name = item.title
            item.imageName = item.icon
            item.id = item.link.split('/')[2]
          })
          this.activeId = res.data[0].id
          this.forums = res.data
          console.log(this.forums)
        }
      })
    },
    doImgStyle(w, h) {
      if (document.body.clientWidth < 700) {
        // 适配移动端, 这里后续尽量封装成组件
        const temp = Math.ceil(document.body.clientWidth * 0.85)
        if (w < h && h > temp) {
          return {
            height: this.imgMaxWidth + 'px',
          }
        } else {
          return {}
        }
      } else {
        if (w < h && h > 512) {
          return {
            height: '512px',
          }
        } else {
          return {}
        }
      }
    },
    submit() {
      this.gifShow = !this.gifShow
      if (this.secret.cnTitle == undefined || this.secret.cnTitle == '') {
        // this.$notify({
        //   title: '标题为空',
        //   type: 'warn',
        //   duration: 2000
        // });
        this.secret.cnTitle = ''
      }
      if (!this.isSend) {
        this.isSend = true
        api
          .submit_secret_image({
            imageUrl: this.secret.imageUrl,
            title: this.secret.cnTitle,
            forumId: parseInt(this.activeId),
            prefix: this.imageSource,
          })
          .then((res) => {
            this.isSend = false
            this.dealResponse(res)
            this.$toast('发布成功')
          })
          .catch((e) => {
            this.isSend = false
          })
      }
    },

    skip() {
      this.gifShow = !this.gifShow
      api
        .delete_secret_image({
          imageUrl: this.secret.imageUrl,
          prefix: this.imageSource,
        })
        .then((res) => {
          this.dealResponse(res)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: block;
  height: 100vh;
  overflow: scroll;
  width: 100%;
  overflow-x: hidden;
  // position: relative;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  // background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.asa {
  background: #fff;
  margin-bottom: 20px;
  // display: flex;
}

.content {
  padding-bottom: 90px;
  .el-input {
    margin-bottom: 10px;
  }
}
.subs {
  position: fixed;
  bottom: 20px;
  z-index: 1;
  //  background: #fff;
}

.searchBox {
  background: #fff;
  padding: 10px;
  .boxs {
    min-height: 300px;
  }
  .searchs {
    //  margin-bottom: 10px;
    input {
      padding: 4px 10px;
      font-size: 14px;
      border: 1px solid #ddd;
    }
  }
  .items {
    display: flex;
    flex-flow: wrap;
  }
  .item {
    padding: 4px 10px;
    margin-right: 12px;
    background: #fff;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    cursor: pointer;
    img {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 4px;
    }
  }
  .item_active {
    border: 1px solid orangered;
    background: orangered;
    color: #fff;
  }
}
.right_desc {
  padding-left: 20px;
  color: #999;
  padding-top: 40px;
  line-height: 24px;
}
</style>
