<template>
  <div>
    <div class="title">
      <div class="title_source">
        <img
          class="source_icon"
          :src="
            imgOrigin +
            item.sourcePost.forum.imageName +
            '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
          "
          alt=""
        />
        <span class="span_username">{{ item.sourcePost.forum.name }}</span>
        来自
        <span>{{
          item.sourcePost.userInfo
            ? item.sourcePost.userInfo.userName
            : '测试账号'
        }}</span>
      </div>
      <!-- {{item.sourcePost.title}} -->
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.title {
  font-size: 15px;
  padding: 0 0 10px 0 !important;
  font-weight: 600;
  .title_source {
    margin-bottom: 0px;
    font-weight: normal;
    font-size: 13px;
  }
  .source_icon {
    width: 20px;
    margin-right: 4px;
    vertical-align: bottom;
  }
  span {
    font-size: 13px;
  }
  .span_source {
    color: #999;
    font-weight: normal;
  }
  .span_username {
    font-weight: normal;
    font-size: 13px;
    &:hover {
      text-decoration: underline;
      color: #1890ff;
    }
  }
}
</style>
