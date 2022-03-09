<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="'#fff'||variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :default-openeds="['/first','/second','/third']"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </el-scrollbar> -->
    <div class="scrollbar_container">
      <div v-if="$store.state.settings.leftNav == 'normal'">
        <div v-for="route in permission_routes" :key="route.name" class="items">
          <div v-if="route.name">
            <!-- 一级 -->
            <div @click="doCollapse(route)" class="items_title">
              <el-popover
                :disabled="!isCollapse"
                :visible-arrow="false"
                placement="right-start"
                width="200"
                trigger="hover"
              >
                <div
                  class="popover-title"
                  v-for="item in route.children"
                  :key="item.name"
                >
                  <span
                    @click="toUrl({ path: item.path })"
                    :class="[{ item_title_active: $route.path == item.path }]"
                    >{{ item.meta.title }}</span
                  >
                </div>
                <svg-icon slot="reference" :icon-class="route.meta.icon" />
              </el-popover>
              <!-- <img class="items_title_icon" :src="" alt="">  -->
              <span class="items_title_span">{{ route.meta.title }}</span>
            </div>
            <!-- 二级 -->
            <div v-if="!route.hide" class="item">
              <div v-for="item in route.children" :key="item.name">
                <div @click="toUrl({ path: item.path })" class="item_title">
                  <svg-icon
                    v-if="!item.meta.icon.includes('http')"
                    :icon-class="item.meta.icon"
                  />
                  <img
                    v-else
                    class="items_title_icon"
                    :src="item.meta.icon"
                    alt=""
                  />
                  <span
                    :class="[{ item_title_active: $route.path == item.path }]"
                    >{{ item.meta.title }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$store.state.settings.leftNav == 'allForm'">
        <div v-for="route in formRoute" :key="route.name" class="items">
          <div
            @click="toUrl2(route)"
            :class="[
              'items_title',
              { items_title_active: $store.state.var.cateId == route.id },
            ]"
          >
            {{ route.name }}
          </div>
          <!-- <div v-if="route.name">
              <div @click="doCollapse(route)" class="items_title">
                <svg-icon :icon-class='route.meta.icon'/>
                <span class="items_title_span">{{route.meta.title}}</span>
              </div>
              <div v-if="!route.hide" class="item">
                <div v-for="item in route.children" :key="item.path" >
                  <div @click="toUrl({path:item.path})" class="item_title">
                    <svg-icon v-if="!item.meta.icon.includes('http')" :icon-class='item.meta.icon'/>
                    <img v-else class="items_title_icon" :src="item.meta.icon" alt=""> 
                    <span :class="[{'item_title_active':$route.path==item.path}]">{{item.meta.title}}</span>
                  </div>
                </div>
              </div>
            
            </div> -->
        </div>
      </div>
    </div>
    <div ref="asd"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar', 'formRoute']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  mounted() {
    // this.$refs.asd.click(()=>{
    //   console.log(111)
    // })
  },
  methods: {
    toUrl2(route) {
      this.$store.dispatch('var/SET_cateId', route.id)
    },
    doCollapse(route) {
      route.hide = !route.hide
    },
  },
}
</script>

<style lang="scss" scoped>
.popover-title {
  font-size: 16px;
  padding-bottom: 8px;
  cursor: pointer;
}
/deep/ .nest-menu:hover {
  background: #fff;
}
/deep/ .el-scrollbar ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  padding: 0;
  width: 4px;
  height: 44px;
  // background-color: rgba(0, 0, 0, .2);
  background-color: $linkcolor;
}
.scrollbar-wrapper {
  background: #000;
}
/deep/ .is-vertical {
  padding: 2px 2px;
  width: auto !important;
  box-sizing: content-box;
  background: #fff;
  border: 1px solid #ddd;
}
/deep/ .el-scrollbar__bar.is-vertical > div {
  width: 4px;
}
::-webkit-scrollbar {
  width: 2px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
}

.scrollbar_container {
  .items {
    font-size: 14px;
    cursor: pointer;
    transition: all 2s linear;
    .items_title {
      line-height: 56px;
      padding: 0 20px;
      // width: 150px;
      moz-user-select: -moz-none;
      -moz-user-select: none;
      -o-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .s_s {
        display: inline-block;
        vertical-align: middle;
        width: 40px;
      }
    }
    .items_title_active {
      color: $linkcolor;
    }
    .item {
      padding: 0 34px;
      transition: all 2s linear;

      .item_title {
        line-height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .items_title_icon {
          width: 24px;
          height: 24px;
          margin-right: 6px;
          vertical-align: middle;
        }
        .item_title_active {
          color: $linkcolor;
        }
      }
    }
  }
}
</style>
