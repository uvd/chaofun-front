<template>
  <div>
    <div v-if="ISPHONE && show" class="fixed_bottom">
      <div class="logo">
        <img
          src="https://i.chao.fun/biz/08a2d3a676f4f520cb99910496e48b4e.png?x-oss-process=image/resize,h_80/format,webp/quality,q_75"
          alt=""
        />
      </div>
      <div class="center">
        <div class="title">炒饭超Fun</div>
        <div class="descs">世界那么大</div>
      </div>
      <div class="right">
        <div @click="toUrl({ url: '/app?from=h5', routeType: 1 })" class="btn">
          App下载
        </div>
        <img
          @click="cancelDown()"
          src="../../assets/images/icon/cancel1.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  computed: {
    show() {
      return this.$store.state.user.showDownApp
    },
  },
  props: {},
  components: {},
  created() {},
  mounted() {},
  methods: {
    cancelDown() {
      // this.show = false;
      this.$store.dispatch('user/SET_showDownApp', false)
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.fixed_bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 5px;
  z-index: 1000;
  display: flex;
  .logo {
    flex: 0 0 44px;
    margin-right: 10px;
    img {
      width: 100%;
      vertical-align: middle;
    }
  }
  .center {
    flex: 1;
    color: #fff;
    .desc {
      font-size: 12px;
    }
  }
  .right {
    position: relative;
    padding-right: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .btn {
      color: #fff;
      background: #e60045;
      padding: 6px 12px;
      border-radius: 20px;
    }
    img {
      position: absolute;
      width: 20px;
      right: 0px;
      top: 0px;
    }
  }
}
</style>
