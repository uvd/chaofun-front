<template>
  <div>
    <div
      v-for="(item, index) in lists"
      :key="index"
      style="
        margin-bottom: 20px;
        padding-bottom: 15px;
        border: #e0e0e0 solid 3px;
        border-radius: 10px;
        background: #f1f1f1;
      "
    >
      <ListItem
        :is-show-to-top-button="false"
        :lists="[item.post]"
        :isindex="true"
      ></ListItem>
      <commentItem :treeData="[item]" style="margin-right: 10px"></commentItem>
    </div>
    <div
      :class="[ISPHONE ? 'scroll_to_top_phone' : 'scroll_to_top']"
      @click="toTop"
    >
      <img alt="" src="../../assets/images/icon/to_top.png" />
    </div>
  </div>
</template>

<script>
import ListItem from '@/components/chaofan/ListItem.vue'
import commentItem from '_c/chaofan/commentItem'

export default {
  name: 'ListComment',
  data() {
    return {}
  },
  props: {
    lists: {
      type: Array,
      default() {
        return []
      },
    },
  },
  components: { ListItem, commentItem },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    toTop() {
      this.$('.infinite-list').animate({ scrollTop: 0 }, 200)
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.scroll_to_top_phone {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 10px;
  bottom: 65px;
  cursor: pointer;
  z-index: 1;

  img {
    width: 100%;
  }
}

.scroll_to_top {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 80px;
  bottom: 120px;
  cursor: pointer;
  z-index: 1;

  img {
    width: 100%;
  }
}
</style>
