<template>
  <div style="padding-left: 10px; padding-right: 10px">
    <div
      style="
        text-align: center;
        width: 100%;
        font-weight: bold;
        font-size: 20px;
        color: #ff9300;
      "
    >
      FBi 历史
    </div>
    <div style="text-align: center; width: 100%">近200条记录</div>
    <div>/时间/行为/获得/剩余</div>
    <div
      v-if="history != null && history.length != 0"
      v-for="(item, index) in history"
    >
      <span>{{ moment(item.date).format('MM-DD HH:mm') }}</span>
      <span> {{ getReason(item.reason) }}</span>
      <span> {{ item.value }} </span>
      <span> {{ item.rest }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import * as api from '@/api/api'
export default {
  name: 'FBiHistory',
  data() {
    return {
      history: [],
      moment: moment,
    }
  },

  mounted() {
    api.getByPath('/api/v0/fbi/history', null).then((res) => {
      // log(res);
      if (res.success) {
        this.history = res.data
      } else {
        this.$toast(res.errorMessage)
      }
    })
  },

  methods: {
    getReason(reason) {
      if (reason === 'comment') {
        return '评论'
      }
      if (reason === 'admin') {
        return '管理员操作'
      }
      if (reason === 'sub_comment') {
        return '子评论'
      }
      if (reason === 'be_comment') {
        return '被评论'
      }
      if (reason === 'secret') {
        return '秘密花园'
      }
      if (reason === 'badge') {
        return '徽章'
      }
      if (reason === 'crazy_friday') {
        return '星期五登录'
      }

      if (reason === 'inviter') {
        return '邀请用户'
      }

      if (reason === 'button_game_pay') {
        return '春节小游戏点击'
      }

      if (reason === 'button_game_get') {
        return '春节小游戏获奖'
      }

      if (reason === 'send_red_packet') {
        return '发送红包'
      }

      if (reason === 'get_red_packet') {
        return '领取红包'
      }

      if (reason === 'red_packet_expire') {
        return '红包过期退回'
      }

      if (reason === 'get_fbi_gift') {
        return 'FBi 兑换礼品'
      }

      if (reason === 'be_thx') {
        return '被感谢'
      }

      if (reason === 'thx') {
        return '感谢赠与'
      }

      return reason
    },
  },
}
</script>

<style scoped></style>
