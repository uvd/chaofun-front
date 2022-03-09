<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <!-- <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item> -->
    </transition-group>
    <div class="inline-flex">
      <!-- <el-cascader
            :placeholder="levelList[levelList.length-1].meta.title"
            :options="options"
            @change="changes"
            filterable></el-cascader> -->
      <el-select
        v-model="$store.state.var.formName"
        filterable
        remote
        reserve-keyword
        placeholder="版块搜索"
        :remote-method="changes"
        @change="toOpen"
        @focus="getForum('')"
        :style="{
          width: ISPHONE ? '120px' : '140px',
          paddingRight: ISPHONE ? '0px' : '',
        }"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.name"
          :label="item.title"
          :value="item.link"
          ><img class="sicon" :src="imgOrigin + item.icon" alt="" />
          <span>{{ item.title }}</span>
        </el-option>
      </el-select>
      <span @click="toUrl({ name: 'lists' })" class="af">
        <img src="./all.png" alt="" /> <em v-if="!ISPHONE">全部版块</em></span
      >
    </div>
    <!-- <div v-else class="block block2">
            <input  type="text" placeholder="搜索版块">
        </div> -->
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import * as api from '../../api/api'

export default {
  data() {
    return {
      levelList: null,
      loading: false,
      options: [],
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    toOpen(v) {
      this.$router.push({ path: v })
    },
    changes(v) {
      this.getForum(v ? v : '')
    },
    getForum(keyword) {
      api.searchForum({ keyword }).then((res) => {
        this.options = res.data
      })
    },
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '首页' } }].concat(
          matched
        )
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      // const { params } = this.$route
      // var toPath = pathToRegexp.compile(path)
      // return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
  },
}
</script>

<style lang="scss" scoped>
.inline-flex {
  display: inline-flex;
}
.app-breadcrumb.el-breadcrumb {
  display: inline-flex;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.sicon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 4px;
}
.block2 {
  background: #ddd;
}
.af {
  display: inline-block;
  // width: 90px;
  font-size: 14px;
  cursor: pointer;
  img {
    width: 16px;
    margin-left: 8px;
    vertical-align: middle;
  }
  &:hover {
    color: #1890ff;
  }
  em {
    font-style: normal;
  }
}
</style>
