<template>
  <div>
    <div style="padding: 20px">
      <img
        style="display: inline-block; height: 100%; width: 100%"
        :src="
          imgOrigin +
          this.badgeInfo.icon +
          '?x-oss-process=image/resize,h_256/format,webp/quality,q_75'
        "
      />
    </div>
    <div style="width: 100%">
      <p
        style="
          width: 100%;
          align-items: center;
          text-align: center;
          font-weight: bold;
          font-size: 25px;
        "
      >
        {{ this.badgeInfo.name }}
      </p>
      <p style="width: 100%; text-align: center">
        {{ this.badgeInfo.desc }}
      </p>
      <p
        style="
          padding-top: 20px;
          width: 100%;
          text-align: center;
          font-size: 16px;
        "
      >
        版块：{{ this.badgeInfo.forumName }}
      </p>
      <p style="width: 100%; text-align: center; font-size: 16px">
        获得人数：{{ this.badgeInfo.userNumber }}
      </p>
      <p style="width: 100%; text-align: center; font-size: 16px">
        FBi: {{ this.badgeInfo.integral }}
      </p>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'

export default {
  name: 'badgeDetail.vue',
  data() {
    return {
      badgeId: null,
      badgeInfo: {},
    }
  },
  props: {
    badgeInfo0: {
      type: Object,
      default() {
        return null
      },
    },
  },

  created() {
    if (this.badgeInfo0) {
      this.badgeInfo = this.badgeInfo0
    } else {
      this.badgeId = this.$route.query.badgeId
      this.getBadgeInfo()
    }
  },

  mounted() {},

  methods: {
    getBadgeInfo() {
      api
        .getByPath('/api/v0/badge/getBadge', { badgeId: this.badgeId })
        .then((res) => {
          if (res.success) {
            this.badgeInfo = res.data
          } else {
            this.$toast(res.errorMessage)
          }
        })
    },
  },
}
</script>

<style scoped></style>
