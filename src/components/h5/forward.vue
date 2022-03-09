<template>
  <div v-if="datas.dialogVisible" class="sss">
    <!-- <van-action-sheet v-model="datas.dialogVisible" title="转发" close-icon=""> -->
    <div class="content">
      <van-form @submit="onSubmit">
        <!-- <van-field
                rows="1"
                autosize
                type="textarea"
                maxlength="50"
                name="源标题"
                label="源标题"
                disabled
                placeholder="源标题"
                v-model="datas.data.sourceTitle"
              /> -->
        <div class="newInput">
          <span class="label">源标题</span>
          <textarea
            autosize
            maxlength="50"
            disabled
            v-model="datas.data.sourceTitle"
            placeholder="源标题"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div class="newInput">
          <span class="label">新标题</span>
          <textarea
            autosize
            maxlength="50"
            v-model="addForm.title"
            placeholder="新标题"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>

        <!-- <van-field
                rows="1"
                autosize
                type="textarea"
                maxlength="50"
                name="新标题"
                label="新标题"
                v-model="addForm.title"
                placeholder="输入新标题"
              /> -->
        <div class="bankuai">
          <div class="label">转发到</div>
          <div class="v">
            <!-- <van-field ref="newinput" v-if="indexs!==''" @click="toClear" v-model="chooseItem.title" disabled placeholder="请输入用户名" /> -->
            <!-- <van-field v-model="keyword" :placeholder="chooseItem.title||'搜索版块'" right-icon="search"/> -->
            <div class="newInput">
              <input
                type="text"
                v-model="keyword"
                clearable
                :placeholder="chooseItem.title || '搜索版块'"
                right-icon="search"
              />
            </div>
            <div class="lists">
              <div
                v-for="(item, index) in options"
                @click.stop="choose(item, index)"
                :key="index"
                :class="[{ active: indexs == index }]"
              >
                <img :src="imgOrigin + item.icon" alt="" />
                <span>{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="margin: 16px" class="bbbb">
          <van-button type="default" @click="cancel"> 取消 </van-button>
          <van-button type="info" native-type="submit"> 提交 </van-button>
        </div>
      </van-form>
    </div>
    <!-- </van-action-sheet> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { ActionSheet, Form, Field, Button } from 'vant'
// import 'vant/lib/index.css';
import * as api from '../../api/api'
Vue.use(ActionSheet)
Vue.use(Form).use(Field).use(Button)
export default {
  name: '',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    datas: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      username: '',
      password: '',
      addForm: {
        targetForumId: '',
      },
      options: [],
      loading: false,
      targetForumId: '',
      keyword: '',
      options: [],
      indexs: '',
      chooseItem: {},
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
  created() {},
  mounted() {
    this.getForum()
  },
  methods: {
    cancel() {
      this.datas.dialogVisible = false
    },
    toClear() {
      this.indexs = ''
      this.$refs.newinput.click()
    },
    choose(item, index) {
      this.indexs = index
      this.chooseItem = item
      this.keyword = item.title
      this.addForm.targetForumId = item.link
    },
    getForum(keyword) {
      api.searchForum({ keyword }).then((res) => {
        this.options = res.data
        this.chooseItem = res.data[0]
        this.addForm.targetForumId = this.options[0].link
      })
    },
    onSub() {
      let params = {
        sourcePostId: this.datas.data.sourcePostId,
        targetForumId: this.addForm.targetForumId.split('/')[2],
        title: this.addForm.title,
      }
      if (params.title) {
        api.submitForward(params).then((res) => {
          this.$message.success('转发成功')
          setTimeout(() => {
            // this.$router.push({path: this.addForm.targetForumId})
            let routeData = this.$router.resolve({
              path: this.addForm.targetForumId,
            })
            window.open(routeData.href, '_blank')
          }, 1500)
        })
      } else {
        // this.$message.error('请输入分享标题')
      }
      console.log(params)
    },
    onSubmit(values) {
      this.onSub()
      console.log('submit', values)
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
// @import '../../assets/css/vant/index.css';
.sss {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5);
  // display: ;
}
.sss .content {
  padding: 16px 16px 0px;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  background: #fff;
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
.sss .lists {
  height: 250px;
  width: 100%;
  overflow-y: scroll;
  div {
    padding: 10px 0;
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
.newInput {
  display: flex;
  margin-bottom: 8px;
  input {
    flex: 1;
    padding: 6px 10px;
    border-radius: 4px;
    margin-top: 10px;
    border: 1px solid #ddd;
  }
  span {
    flex: 0 0 78px;
    text-align: center;
    margin-right: 8px;
  }
  textarea {
    flex: 1;
    height: 74px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    padding: 6px 10px;
  }
}
</style>
