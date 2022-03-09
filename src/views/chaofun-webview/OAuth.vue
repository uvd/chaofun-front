<template></template>

<script>
import * as api from '@/api/api'

export default {
  name: 'OAuth',
  data() {
    return {
      redirectUrl: '',
    }
  },
  created() {
    this.redirectUrl = this.$route.query.redirectUrl

    if (this.redirectUrl) {
      this.getUserToken()
    } else {
      window.location.href = 'https://chao.fun'
    }
  },
  mounted() {},

  methods: {
    getUserToken() {
      api.getByPath('/api/v0/open/getUserToken', {}).then((res) => {
        // this.$toast(res.data.token);
        if (res.success && res.data) {
          if (this.redirectUrl.includes('?')) {
            this.redirectUrl = this.redirectUrl + '&cfToken=' + res.data.token
          } else {
            this.redirectUrl = this.redirectUrl + '?cfToken=' + res.data.token
          }
        }
        // this.$toast(this.redirectUrl);
        window.location.href = this.redirectUrl
      })
    },
  },
}
</script>

<style scoped></style>
