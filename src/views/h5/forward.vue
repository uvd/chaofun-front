<template>
  <div>
    <van-action-sheet v-model="show" title="标题">
      <div class="content">内容</div>
    </van-action-sheet>
  </div>
</template>

<script>
import Vue from 'vue'
import { ActionSheet } from 'vant'

Vue.use(ActionSheet)
export default {
  name: '',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  components: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped type="text/scss">
.content {
  padding: 16px 16px 160px;
}
</style>
