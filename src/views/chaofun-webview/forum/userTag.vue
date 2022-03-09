<template>
  <div>
    <div v-if="this.displayAdd" class="ycovers">
      <div class="ycontainer">
        <div style="">
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">标签名：</div>
            <input type="text" v-model="addTagName" placeholder="标签名" />
          </div>
          <div style="margin: 20px 0px; display: flex">
            <el-button @click="toAdd" type="success">确认</el-button>
            <el-button @click="cancelAdd" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.displayRemove" class="ycovers">
      <div class="ycontainer">
        <div style="">
          <div>清除用户标签</div>
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">用户名：</div>
            <el-autocomplete
              v-model="state"
              :fetch-suggestions="querySearchAsync"
              placeholder="搜索用户名"
              @select="handleRemoveSelect"
              style="z-index: 100000"
            ></el-autocomplete>
          </div>
          <div style="margin: 20px 0px; display: flex">
            <el-button @click="removeUserTag" type="success">清除</el-button>
            <el-button @click="cancelClean" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.displayAddUserTag" class="ycovers">
      <div class="ycontainer">
        <div style="">
          <div>设置用户标签</div>
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">用户名：</div>
            <el-autocomplete
              v-model="state"
              :fetch-suggestions="querySearchAsync"
              placeholder="搜索用户名"
              @select="handleAddSelect"
            ></el-autocomplete>
          </div>
          <div style="margin: 10px 0px; display: flex">
            <el-button @click="grantUser" type="success">设置</el-button>
            <el-button @click="cancelSet" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div @click="add" class="btns">添加标签</div>
    </div>
    <div class="bottom">
      <div @click="toRemoveUserTag" class="btns">清除用户标签</div>
    </div>
    <div v-for="(item, index) in lists" :key="index" class="item">
      <div>{{ item.data }}</div>
      <div style="display: flex; justify-content: space-between; width: 20%">
        <div @click="toGrantUser(item)">添加给用户</div>
        <div @click="toDelete(item, index)">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import { getlistTag } from '../../../api/api'

export default {
  name: 'tag',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      displayAdd: false,
      displayRemove: false,
      displayAddUserTag: false,
      keyword: '',
      restaurants: [],
      state: '',
      params: {},
      forumId: '',
      lists: [],
      addTagName: '',
      orderNumber: 0,
      userIdToClean: 0,
      userIdToAdd: 0,
      tagToAdd: 0,
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
    this.getTagList()
  },

  methods: {
    removeUserTag() {
      this.displayRemove = false
      api
        .removeUserTag({ userId: this.userIdToClean, forumId: this.forumId })
        .then((res) => {
          if (res.success) {
            this.userIdToClean = null
            this.state = ''
            this.$toast('成功')
          } else {
            this.$toast(this.errorMessage)
          }
        })
    },
    toRemoveUserTag() {
      this.displayRemove = true
    },
    toGrantUser(item) {
      this.displayAddUserTag = true
      this.tagToAdd = item.id
    },
    grantUser() {
      this.displayAddUserTag = false
      api
        .setUserTag({
          userId: this.userIdToAdd,
          forumId: this.forumId,
          tagId: this.tagToAdd,
        })
        .then((res) => {
          if (res.success) {
            this.userIdToAdd = null
            this.tagToAdd = null
            ;(this.state = ''), this.$toast('成功')
          } else {
            this.$toast(this.errorMessage)
          }
        })
    },
    toAdd() {
      if (this.addTagName !== '') {
        api
          .addForumUserTag({
            forumId: this.forumId,
            data: this.addTagName,
            type: 'text',
          })
          .then((res) => {
            this.tagName = ''
            this.orderNumber = 0
            this.displayAdd = false
            this.getTagList()
          })
      }
    },

    cancelAdd() {
      this.displayAdd = false
    },
    cancelSet() {
      this.displayAddUserTag = false
    },
    cancelClean() {
      this.displayRemove = false
    },
    add() {
      this.displayAdd = true
    },

    toDelete(item, index) {
      this.$confirm(`是否确定删除标签 【${item.data}】？`, '提示', {
        type: 'warning',
        // position: center,
      }).then(() => {
        api.removeForumUserTag({ tagId: item.id }).then((res) => {
          this.getTagList()
        })
      })
    },
    getTagList() {
      api.listForumUserTag({ forumId: this.forumId }).then((res) => {
        this.lists = res.data
        // this.load()
      })
    },
    handleRemoveSelect(item) {
      this.userIdToClean = item.userId
      console.log(item)
    },
    handleAddSelect(item) {
      this.userIdToAdd = item.userId
    },

    querySearchAsync(queryString, cb) {
      api.getSearchUser({ keyword: queryString, pageNum: 1 }).then((res) => {
        let result = res.data.data.map((value) => {
          value.value = value.userName
          return value
        })
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(result)
        }, 3000 * Math.random())
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
