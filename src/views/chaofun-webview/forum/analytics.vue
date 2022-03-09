<template>
  <div>
    <div class="title">累计版主激励: {{ modInfo.money }} 元</div>
    <div
      class="tips"
      style="margin-top: 0; line-height: 24px; margin-bottom: 10px"
      slot="tip"
    >
      (按照每日版块活跃度分配，每日3点过5分更新，请加微信: wwwchaofun 提取,
      多版主版块请协商提取)
    </div>
    <div class="tips">24小时帖子数: {{ modInfo.past24HPosts }}</div>
    <div class="tips">
      24小时帖子获赞数(不包括楼主自己的赞): {{ modInfo.past24HVotes }}
    </div>
    <div class="tips">24小时全站版块综合排名: {{ modInfo.rank }}</div>
  </div>
</template>

<script>
import * as api from '@/api/api'

export default {
  name: 'analytics',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      params: {},
      forumId: '',
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
    api.getModInfo({ forumId: this.forumId }).then((res) => {
      this.modInfo = res.data
    })
  },
}
</script>

<style scoped></style>
