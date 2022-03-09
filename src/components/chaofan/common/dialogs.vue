<template>
  <div v-if="visible" class="dialog_cover">
    <div class="body">
      <slot name="content"></slot>
      <!-- <div><slot name="content"></slot></div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped type="text/scss">
.dialog_cover {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 5000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
