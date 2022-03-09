<template>
  <div>
    <div v-if="this.displayAdd" class="ycovers">
      <div class="ycontainer">
        <div style="">
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">发帖规范：</div>
          </div>
          <textarea
            class="text"
            v-model="addRule"
            style="background: #f9f9f9; width: 260px"
            placeholder="请点击输入发帖规范内容"
          />
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">排序值：</div>
            <input type="number" v-model="orderNumber" placeholder="排序值" />
          </div>

          <div style="margin: 20px 0px; display: flex">
            <el-button @click="toAdd" type="success">确认</el-button>
            <el-button @click="cancelAdd" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div @click="add" class="btns">添加发帖规范</div>
    </div>
    <div v-for="(item, index) in lists" :key="index" class="item">
      <div>{{ item.rule }} (排序值：{{ item.orderNumber }})</div>
      <div style="display: flex; justify-content: space-between; width: 20%">
        <div @click="toModify">修改</div>
        <div @click="toDelete(item, index)">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import { forumRemoveRule } from '../../../api/api'

export default {
  name: 'tag',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      displayAdd: false,
      params: {},
      forumId: '',
      lists: [],
      addRule: '',
      orderNumber: 0,
      modInfo: {
        money: 0.0,
        past24HPosts: 0,
        past24HVotes: 0,
        rank: 0,
      },
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
    this.getForumRules()
  },

  methods: {
    toAdd() {
      if (this.addRule !== '') {
        api
          .forumAddRule({
            forumId: this.forumId,
            rule: this.addRule,
            orderNumber: this.orderNumber,
          })
          .then((res) => {
            this.addRule = ''
            this.orderNumber = 0
            this.displayAdd = false
            this.getForumRules()
          })
      }
    },
    cancelAdd() {
      this.displayAdd = false
    },
    add() {
      this.displayAdd = true
    },
    toModify() {
      this.$toast('暂不支持')
    },
    toDelete(item, index) {
      this.$confirm(`是否确定删除标签 【${item.rule}】？`, '提示', {
        type: 'warning',
        // position: center,
      }).then(() => {
        api
          .forumRemoveRule({ forumId: this.forumId, ruleId: item.id })
          .then((res) => {
            this.getForumRules()
          })
      })
    },
    getForumRules() {
      api.getForumRules({ forumId: this.forumId }).then((res) => {
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
  z-index: 20;
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
    width: 400px;
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
  padding-left: 10px;
  border-radius: 8px;
}
</style>

<style lang="scss">
.el-message-box {
  width: 90vw;
  max-width: 400px;
}
</style>
