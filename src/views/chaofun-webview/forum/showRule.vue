<template>
  <div>
    <el-card class="aside-rule" v-if="this.rules && this.rules.length != 0">
      <p>
        <span>{{ forumInfo.name }} 版块发帖规则</span>
      </p>
      <ol>
        <li v-for="item in this.rules">{{ item.rule }}</li>
      </ol>
    </el-card>
    <el-card class="aside-rule" shadow="never">
      <p>
        <span>炒饭发帖规则</span>
      </p>
      <ol>
        <li>严禁发布色情、暴恐、赌博及其他违反网络安全法的内容</li>
        <li>严禁发布涉嫌隐私或未经授权的私人图片及信息</li>
        <li>如违规发布，请自行删除或管理员强制删除</li>
      </ol>
    </el-card>
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
      forumInfo: {},
      params: {},
      forumId: '',
      lists: [],
      rules: [],
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

  created() {
    this.forumId = this.$route.query.forumId
    this.getForumInfo()
    this.getForumRules()
  },

  methods: {
    getForumInfo() {
      api.getForumInfo({ forumId: this.forumId }).then((res) => {
        this.forumInfo = res.data
      })
    },
    getForumRules() {
      api.getForumRules({ forumId: this.forumId }).then((res) => {
        this.rules = res.data
        this.load()
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
  margin-top: 10px;
  padding-left: 10px;
  border-radius: 8px;
}
.aside-rule {
  /deep/ .el-card__body {
    padding: 12px 12px;
    p {
      display: flex;
      justify-items: center;
      padding-bottom: 5px;
      border-bottom: 1px solid #dcdfe6;
      img {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
      span {
        font-size: 16px;
        line-height: 40px;
      }
    }
    ol {
      font-size: 12px;
      line-height: 18px;
      list-style: decimal;
      list-style-position: inside;

      li {
        border-bottom: 1px solid #dcdfe6;
        padding: 10px 6px;
        list-style: decimal;
        list-style-position: inside;
      }
    }
  }
}
</style>
