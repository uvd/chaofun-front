<template>
  <div class="container">
    <!-- <div class="fixed_top"></div> -->
    <div class="content">
      <!-- <div class="left">
              <div class="l_item l_item_active">炒饭版主介绍</div>
          </div> -->
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
export default {
  name: 'Help',
  components: {},
  data() {
    return {
      pagedata: [],
    }
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 0;
  background: #f7f7f7;
  .fixed_top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    // background: red;
    z-index: 10;
  }
  .content {
    height: 100vh;
    display: flex;
    box-sizing: border-box;
    padding-top: 60px;
    justify-content: space-between;
    align-items: center;
    .left {
      width: 120px;
      max-width: 440px;
      min-width: 256px;
      // background: #fff;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      padding-top: 54px;
      box-sizing: border-box;
      .l_item {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        font-size: 16px;
      }
      .l_item_active {
        color: $linkcolor;
        cursor: pointer;
      }
    }
    .main {
      width: 100%;
      max-width: 750px;
      // background: #fff;
      margin: 0 auto;
      height: 100%;
    }
  }
}
</style>
