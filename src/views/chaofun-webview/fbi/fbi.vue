<template>
  <div style="padding-left: 10px; padding-right: 10px">
    <div style="font-weight: bold; font-size: 20px; color: #ff9300">
      你的 FBi:
      <span style="color: orangered">
        {{ this.fbi }}
      </span>
    </div>
    <div>
      <el-button @click="history"> 查看记录 </el-button>
      <el-button @click="redPacketGet"> 口令红包 </el-button>
    </div>
    <div style="padding-top: 20px">
      <p style="font-weight: bold; font-size: 20px; color: #ff9300">
        FBi 是什么:
      </p>
      <p style="font-size: 14px">
        炒饭的消耗品，目前支持 App 和 网页 「我的」 中查看
      </p>
      <p
        style="
          font-weight: bold;
          font-size: 20px;
          color: #ff9300;
          padding-top: 20px;
        "
      >
        FBi 如何获得:
      </p>
      <p>- 通过徽章附带的 FBi（徽章由炒饭和版主颁发）</p>
      <p>
        - 秘密花园 发帖，每条奖励 2 FBi，24 小时内封顶 40
        FBi，请遵守版块发帖规范并请勿发无意义的帖子。
      </p>
      <p>- 每周五(炒饭爆炸星期五)登录使用炒饭，奖励 50 FBi</p>
      <p>- 你的帖子每得到一条评论 (非自己评论), 奖励 1 FBi</p>
      <p>- 每发出一条评论 (评论自己的帖子不算), 奖励 1 FBi</p>
      <p>- 你的评论每得到一条子评论 (非自己评论), 奖励 1 FBi</p>
      <p>- 向站长 (cijianzy) 反馈问题, 奖励 100 FBi</p>
      <div>
        <p>
          - 邀请用户注册炒饭，其他用户注册成功后，奖励 100 FBi, 邀请链接：
          https://chao.fun/app?inviter={{ this.userInfo.userId }}
        </p>
        <el-button @click="this.copyInviterLink">点击复制链接</el-button>
      </div>
      <p>- 他人赠与</p>
      <p>- 为炒饭贡献代码</p>
      <p
        style="
          font-weight: bold;
          font-size: 20px;
          color: #ff9300;
          padding-top: 20px;
        "
      >
        FBi 如何使用:
      </p>
      <p>- 兑换炒饭纪念品</p>
      <p>- 评论赠与他人: +xxxfbi</p>
    </div>
    <div
      style="
        padding-top: 20px;
        font-weight: bold;
        font-size: 20px;
        color: #ff9300;
      "
    >
      FBi兑换
    </div>
    <div style="padding-top: 10px; padding-bottom: 10px">
      注: 红包封面/京东E卡/B站会员
      支持点击自助兑换，杯子和T恤请私聊联系@cijianzy, 包邮
    </div>
    <div style="width: 100%">
      <div
        @click="getWechatCover"
        style="width: 50%; display: inline-block; text-align: center"
      >
        <img
          style="
            padding-right: 10px;
            padding-left: 10px;
            max-width: 100%;
            max-height: 200px;
          "
          src="https://i.chao.fun/biz/76b1d8fd9240d15b3520e9085662b415.png"
        />
        <p style="text-align: center">微信炒饭娘红包封面</p>
        <p style="text-align: center">FBi: 99</p>
      </div>
      <div @click="getJDECard" style="width: 50%; display: inline-block">
        <img
          style="padding-right: 10px; padding-left: 10px; width: 100%"
          src="https://i.chao.fun/biz/fc21232af2fa1849c3f0853b8748224c.png"
        />
        <p style="text-align: center">10元京东E卡</p>
        <p style="text-align: center">FBi: 1000</p>
      </div>
      <div style="width: 50%; display: inline-block">
        <img
          style="padding-right: 10px; padding-left: 10px; width: 100%"
          src="https://i.chao.fun/biz/0e848c137be852a5d7999f4acd10a640.png"
        />
        <p style="text-align: center">炒饭马克杯</p>
        <p style="text-align: center">FBi: 1500</p>
      </div>
      <div @click="getBilibili1Month" style="width: 50%; display: inline-block">
        <img
          style="padding-right: 10px; padding-left: 10px; width: 100%"
          src="https://i.chao.fun/biz/9683983f7ae6a723a76fc00dd7f9a103.png"
        />
        <p style="text-align: center">Bilibili月度大会员</p>
        <p style="text-align: center">FBi: 2500</p>
      </div>
      <div style="width: 50%; display: inline-block">
        <img
          style="padding-right: 10px; padding-left: 10px; width: 100%"
          src="https://i.chao.fun/biz/e3e44a77908676ea7047c18601a0297b.png"
        />
        <p style="text-align: center">炒饭 T-shirt</p>
        <p style="text-align: center">FBi: 7500</p>
      </div>
      <div @click="getBilibili1Year" style="width: 50%; display: inline-block">
        <img
          style="padding-right: 10px; padding-left: 10px; width: 100%"
          src="https://i.chao.fun/biz/9683983f7ae6a723a76fc00dd7f9a103.png"
        />
        <p style="text-align: center">Bilibili年度大会员</p>
        <p style="text-align: center">FBi: 16800</p>
      </div>
      <div style="width: 50%; display: inline-block">
        <img
          style="padding-right: 10px; padding-left: 10px; width: 100%"
          src="https://i.chao.fun/biz/da67f9c40bc0f80db68e40de94b9a3f5.png"
        />
        <p style="text-align: center">西兰公国 Lord (勋爵)</p>
        <p style="text-align: center">FBi: 35000</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import { getUserInfo } from '../../../api/api'
import { Dialog } from 'vant'

export default {
  name: 'fbi.vue',

  data() {
    return {
      userInfo: {},
      fbi: 0,
    }
  },
  created() {
    this.getUserInfo()
  },
  mounted() {},

  methods: {
    getUserInfo() {
      api.getUserInfo().then((res) => {
        if (res.success) {
          this.userInfo = res.data
          this.fbi = res.data.fbi
        } else {
          this.$toast(res.errorMessage)
        }
      })
    },
    copyInviterLink() {
      var input = document.createElement('input')
      input.setAttribute(
        'value',
        'https://chao.fun/app?inviter=' + this.userInfo.userId
      )
      document.body.appendChild(input)
      input.select()
      var result = document.execCommand('copy')
      document.body.removeChild(input)
      this.$toast('复制邀请地址成功')
      return result
    },

    history() {
      window.open('https://chao.fun/webview/fbi/history', '_blank')
    },

    redPacketGet() {
      window.open('https://chao.fun/webview/fbi/redPacket', '_blank')
    },

    getWechatCover() {
      Dialog.confirm({
        title: '是否确认兑换',
        message: `兑换会扣除 99 FBi`,
        messageAlign: 'left',
      })
        .then(() => {
          api.getByPath('/api/v0/gift/getWechatCover', {}).then((res) => {
            if (res.success) {
              this.$message.success('已兑换, 请查看消息')
              this.getUserInfo()
            } else {
              this.$message.error(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },

    getJDECard() {
      Dialog.confirm({
        title: '是否确认兑换',
        message: `兑换会扣除 1000 FBi`,
        messageAlign: 'left',
      })
        .then(() => {
          api.getByPath('/api/v0/gift/getJDECard', {}).then((res) => {
            if (res.success) {
              this.$message.success('已兑换, 请查看消息')
              this.getUserInfo()
            } else {
              this.$message.error(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },

    getBilibili1Month() {
      Dialog.confirm({
        title: '是否确认兑换',
        message: `兑换会扣除 2500 FBi`,
        messageAlign: 'left',
      })
        .then(() => {
          api.getByPath('/api/v0/gift/getBilibili1Month', {}).then((res) => {
            if (res.success) {
              this.$message.success('已兑换, 请查看消息')
              this.getUserInfo()
            } else {
              this.$message.error(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    getBilibili1Year() {
      Dialog.confirm({
        title: '是否确认兑换',
        message: `兑换会扣除 16800 FBi`,
        messageAlign: 'left',
      })
        .then(() => {
          api.getByPath('/api/v0/gift/getBilibili1Year', {}).then((res) => {
            if (res.success) {
              this.$message.success('已兑换, 请查看消息')
              this.getUserInfo()
            } else {
              this.$message.error(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
  },
}
</script>

<style scoped></style>
