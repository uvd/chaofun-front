<template></template>

<script>
import * as api from '@/api/api'
import { getUserInfo } from '../../../api/api'
export default {
  name: 'RedPacket',
  data() {
    return {
      input: '',
      showDetail: false,
      redPacket: null,
      fbi: 0,
    }
  },
  created() {
    this.password = this.$route.query.password
    if (this.password) {
      this.getRedPacket()
    }
  },
  mounted() {},

  methods: {
    getRedPacket() {
      api
        .getByPath('/api/v0/red_packet/get', {
          password: this.password,
          type: 'password',
        })
        .then((res) => {
          if (res.success && res.data !== null) {
            this.redPacket = res.data
            if (this.redPacket.isOpened || this.redPacket.isEnd) {
              this.showDetail = true
            }
          } else {
            this.redPacket = null
            if (res.errorMessage) {
              this.$toast(res.errorMessage)
            } else {
              this.$toast('没有这个红包')
            }
          }
        })
    },

    openRedPacket() {
      api
        .getByPath('/api/v0/red_packet/open', {
          password: this.password,
          type: 'password',
        })
        .then((res) => {
          if (res.success && res.data != null) {
            this.redPacket = res.data
            if (this.redPacket.isOpened || this.redPacket.isEnd) {
              this.showDetail = true
            }
          } else {
            this.redPacket = null
            if (res.errorMessage) {
              this.$toast(res.errorMessage)
            } else {
              this.$toast('没有这个红包')
            }
          }
        })
        .bind(this)
    },

    inputEnter() {
      this.password = this.input
      this.getRedPacket()
    },

    history() {
      window.open('https://chao.fun/webview/fbi/history', '_blank')
    },
  },
}
</script>

<style scoped></style>
