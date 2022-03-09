<template>
  <div>
    <div v-if="this.displayAdd" class="ycovers">
      <div class="ycontainer">
        <div style="">
          <div>注：只有加入该版块的用户才能收到该通知</div>
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">标题：</div>
            <el-input
              type="textarea"
              placeholder="通知标题"
              v-model="addNotifyTitle"
            ></el-input>
          </div>
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">内容：</div>
            <el-input
              type="textarea"
              placeholder="内容, 可以为空"
              v-model="addNotifyContent"
            ></el-input>
          </div>
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">链接：</div>
            <el-input
              type="textarea"
              placeholder="链接,一般为 https://chao.fun/ 开头，一般是活动具体的帖子链接"
              v-model="addNotifyLink"
            ></el-input>
          </div>
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">定时(可选)：</div>
            <div class="block" style="z-index: 2000">
              <!--              <span class="demonstration">默认</span>-->
              <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间"
                :transfer="true"
              >
              </el-date-picker>
            </div>
          </div>
          <div style="margin: 20px 0px; display: flex">
            <el-button @click="toAdd" type="success">推送</el-button>
            <el-button @click="cancelAdd" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div @click="add" class="btns">添加通知</div>
    </div>
    <div v-for="(item, index) in lists" :key="index" class="item">
      <div>
        <div>标题: {{ item.title }}</div>
        <div>内容: {{ item.content }}</div>
        <div>链接: {{ item.link }}</div>
        <div v-if="item.sendTime">
          定时: {{ moment(item.sendTime).format('YYYY年MM月DD日 HH:mm:ss') }}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; width: 20%">
        <div v-if="item.status === 0">审批中</div>
        <div v-if="item.status === 1">已发送</div>
        <div v-if="item.status === 2">已拒绝</div>
        <div v-if="item.status === 2">
          拒绝原因: {{ item.reason === null ? '无' : item.reason }}
        </div>
        <div v-if="item.status === 1">已审批，待发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import 'moment/locale/zh-cn'
import moment from 'moment'

export default {
  name: 'notify',
  data() {
    return {
      value1: '',
      displayAdd: false,
      lists: [],
      moment: moment,
      addNotifyTitle: '',
      addNotifyContent: '',
      addNotifyLink: '',
    }
  },
  props: {
    forumId0: {
      type: String,
      default() {
        return null
      },
    },
  },
  created() {
    if (this.forumId0) {
      this.forumId = this.forumId0
    } else {
      this.forumId = this.$route.query.forumId
    }
    this.getNotifyList()
  },

  methods: {
    toAdd() {
      // this.$toast(this.addNotifyTitle)
      if (this.addNotifyTitle !== '') {
        api
          .forumNotify({
            forumId: this.forumId,
            title: this.addNotifyTitle,
            content: this.addNotifyContent,
            link: this.addNotifyLink,
            dateTime: this.value1,
          })
          .then((res) => {
            this.displayAdd = false
            this.getNotifyList()
          })
      }
    },
    cancelAdd() {
      this.displayAdd = false
    },
    add() {
      this.displayAdd = true
    },
    getNotifyList() {
      api.listNotify({ forumId: this.forumId }).then((res) => {
        this.lists = res.data
        // this.load()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ycovers {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;

  .ycontainer {
    background: #fff;
    width: 600px;
    max-width: 90%;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    min-height: 200px;
  }
}
.item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
  overflow: hidden;
}
.bottom {
  left: 0;
  right: 0;
  padding: 4px 10px 10px;
  .btns {
    width: 80%;
    margin: 0 auto;
    line-height: 44px;
    background: #ff9300;
    color: #fff;
    border-radius: 30px;
    text-align: center;
    font-size: 16px;
  }
}
input {
  height: 44px;
  outline: none;
  border: 1px solid #ededed;
  background: #f9f9f9;
  font-size: 15px;
  margin-top: 10px;
  padding-left: 10px;
  border-radius: 8px;
}

.el-input {
  height: 44px;
  outline: none;
  border: 1px solid #ededed;
  background: #f9f9f9;
  font-size: 15px;
  margin-top: 10px;
  padding-left: 10px;
  border-radius: 8px;
}
</style>
