<template>
  <div v-if="show" class="newDialog">
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'newDialog',
  data() {
    return {
      show: false,
    }
  },
  computed: {},
  mounted() {
    this.$EventBus.$on('new-dialog', (data) => {
      //需要执行的代码
      this.show = data
    })
  },
}
</script>

<style lang="scss">
.newDialog {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
