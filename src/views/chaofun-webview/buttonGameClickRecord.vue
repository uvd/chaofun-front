<template>
  <div class="main">
    <div style="display: flex">
      <span>显示记录：</span>
      <el-switch
        v-model="onlyGetPrice"
        active-color="#13ce66"
        inactive-color="#1890ff"
        active-text="仅获奖"
        inactive-text="全部"
        @change="onlyGetPriceChange"
      ></el-switch>
    </div>
    <div ref="scrollDivMark" style="height: 85vh; overflow: auto">
      <div
        v-for="(item, index) in clickRecordArray"
        :key="index"
        v-if="!onlyGetPrice || (onlyGetPrice && 'success' == item.type)"
        @click="toUser(item.userId)"
        style="display: flex; cursor: pointer; margin: 15px 0px"
      >
        <span>{{ moment(item.timestamp).format('HH:mm:ss') }}</span>
        <i
          :class="'success' == item.type ? 'el-icon-success' : 'el-icon-error'"
          :style="{ color: 'success' == item.type ? '#13ce66' : '#ff4949' }"
          style="font-size: 20px; margin-left: 10px"
        />
        <span style="margin-left: 1px">{{ item.userName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'buttonGameClickRecord',
  components: {},
  data() {
    return {
      onlyGetPrice: false,
      moment: moment,
    }
  },
  props: {
    clickRecordArray: {
      type: Array,
      default: [],
    },
  },
  computed: {},
  watch: {
    clickRecordArray: function () {
      this.scrollToEnd()
    },
  },
  created() {},
  mounted() {},
  methods: {
    toUser(userId) {
      if (userId) {
        try {
          window.flutter_inappwebview.callHandler('toAppUser', {
            userId: userId + '',
          })
        } catch (e) {
          window.open(location.origin + '/user/' + userId, '_blank')
        }
      }
    },
    onlyGetPriceChange() {
      this.scrollToEnd()
    },
    scrollToEnd() {
      setTimeout(() => {
        this.$refs.scrollDivMark.scrollTop =
          this.$refs.scrollDivMark.scrollHeight
      }, 100)
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  margin: 10px 10px;
}
</style>

<style lang="scss">
.el-drawer__header {
  background: #000;
  color: #fff;
  font-size: 16px;
  margin: 0px;
  padding: 5px 20px;
}
</style>
