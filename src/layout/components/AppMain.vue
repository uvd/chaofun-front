<template>
  <section class="app-main">
    <!-- <div style="height:50px;background:transparent;"></div> -->
    <!--    <transition name="fade-transform" mode="out-in">-->
    <!-- <keep-alive>
          <router-view :key="key"/>
      </keep-alive> -->
    <keep-alive>
      <router-view :key="key" v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件 -->
      </router-view>
    </keep-alive>

    <router-view :key="key" v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件 -->
    </router-view>
    <!-- <keep-alive>
          <router-view :key="key" />
       </keep-alive> -->
    <!--    </transition>-->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh);
  width: 100%;
  position: relative;
  // overflow: hidden;
  padding: 0px;
  box-sizing: border-box;
  background: #f0f2f5;
  -webkit-font-smoothing: antialiased;
}
@media screen and (max-width: 700px) {
  .app-main {
    /* 50= navbar  50  */

    padding: 0px;
  }
}
.fixed-header + .app-main {
  // padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh);
  }

  .fixed-header + .app-main {
    // padding-top: 54px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    // padding-right: 15px;
  }
}
</style>
