<template>
  <div
    id="container"
    class="dashboard-container container infinite-list"
    ref="container"
    :style="{ height: scrollHeight + 'px' }"
  >
    <div>
      <div style="height: 50px"></div>
      <div class="main_content">
        <div v-if="!ISPHONE" class="main_left"></div>
        <div class="main_center">
          <div class="navs" :style="{ left: ISPHONE ? '0' : '0px' }">
            <div v-if="!isRecommend">
              <selectList
                @updateList="updateList"
                :params="params"
              ></selectList>
            </div>
            <div
              @click="reFresh"
              v-if="isRecommend && ISPHONE"
              style="font-size: 32px; padding: 6px 0px 0 0px; color: #999"
            >
              <el-icon><el-icon-refresh /></el-icon>
            </div>
          </div>
          <div class="grid-content" :style="{ left: ISPHONE ? '0' : '0px' }">
            <ListItem
              v-if="isRecommend || $store.state.user.listMode == 'normal'"
              :marker="params.marker"
              :keys="params.key"
              :isindex="true"
              :lists="lists"
              :order="params.order"
            ></ListItem>
            <SimListItem
              v-else
              :marker="params.marker"
              :keys="params.key"
              :isindex="true"
              :lists="lists"
              :order="params.order"
            ></SimListItem>
            <load-text :ifcanget="ifcanget" :loadAll="loadAll"></load-text>
          </div>
        </div>
        <div v-if="!ISPHONE" class="main_right">
          <div class="fixed_r">
            <div
              v-if="!ISPHONE"
              style="min-width: 300px; padding-top: 10px"
              class="grid-content bg-purple content-right"
            >
              <RightDescribe
                :forumInfo="forumInfo"
                @getForumInfo="getForumInfo"
                :islogin="islogin"
              ></RightDescribe>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      @click="reFresh"
      v-if="isRecommend && ISPHONE"
      class="reFresh"
      :style="{ left: ISPHONE ? '0' : '-40px' }"
    >
      <el-icon><el-icon-refresh /></el-icon>
    </div>
    <fixedBottom></fixedBottom>
  </div>
</template>

<script>
import { Refresh as ElIconRefresh } from '@element-plus/icons'
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import * as api from '../../api/api'

import ListItem from '../../components/chaofan/ListItem.vue'
import SimListItem from '../../components/chaofan/SimListItem.vue'
import RightDescribe from '@/components/chaofan/RightDescribe'
import loadText from '@/components/chaofan/loadText'
import VirtualList from 'vue-virtual-listview'
import fixedBottom from '@/components/chaofan/fixedBottom'

import selectList from '@/components/chaofan/common/selectList'

export default {
  components: {
    ListItem,
    SimListItem,
    RightDescribe,
    loadText,
    VirtualList,
    fixedBottom,
    selectList,
    ElIconRefresh,
  },
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      mode: 'simple',
      currentRole: 'adminDashboard',
      count: 5,
      lists: [],
      params: {
        onlyNew: false,
        pageSize: 30,
        marker: '',
        order:
          localStorage.getItem('chao.fun.timeline.order') == null
            ? 'hot'
            : localStorage.getItem('chao.fun.timeline.order'),
        range:
          localStorage.getItem('chao.fun.timeline.range') == null
            ? '1hour'
            : localStorage.getItem('chao.fun.timeline.range'),
      },
      options: [
        {
          label: '最新',
          value: 'new',
        },
        {
          label: '最热',
          value: 'hot',
        },
        {
          label: '新评',
          value: 'comment',
        },
        {
          label: '最赞',
          value: 'ups',
        },
      ],
      ranges: [
        {
          label: '现在',
          value: '1hour',
        },
        {
          label: '一天',
          value: '1day',
        },
        {
          label: '一周',
          value: '1week',
        },
        {
          label: '一个月',
          value: '1month',
        },
        {
          label: '一年',
          value: '1year',
        },
        {
          label: '全部',
          value: 'all',
        },
      ],
      isPhone: false,
      ifcanget: true,
      loadAll: false,
      isRecommend: false,
      forumInfo: null,
    }
  },
  computed: {
    ...mapGetters(['roles', 'islogin']),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例
      // vm.deleteScan();
      if (!vm.$store.state.user.islogin) {
        vm.nextReplace()
      }
    })
  },
  activated() {
    console.log('666', this.$route.query)
    if (this.$route.query.time) {
      this.toPosition()
    }
    if (this.$route.path.includes('/all')) {
      this.$store.dispatch('var/SET_formName', '全站')
    } else if (this.$route.path.includes('/recommend')) {
      this.$store.dispatch('var/SET_formName', '推荐')
    } else {
      this.$store.dispatch('var/SET_formName', '首页')
    }
    // 更新数据
    if (localStorage.getItem('simple')) {
      let data = JSON.parse(localStorage.getItem('simple'))

      this.lists.forEach((its, index) => {
        if (data.postId == its.postId) {
          this.lists.splice(index, 1, data)
        }
      })
      localStorage.removeItem('simple')
    }
  },
  mounted() {
    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    if (
      this.$store.state.user.listMode == 'normal' &&
      this.params.pageSize != 20
    ) {
      this.params.pageSize = 20
    } else {
      this.params.pageSize = 30
    }
    this.toPosition()
    // console.log('scrollHeight',this.scrollHeight)
    let self = this
    this.$refs.container.addEventListener('scroll', function () {
      let scrollTop = self.$refs.container.scrollTop
      let conTop = self.$refs.container.scrollTop
      // 变量windowHeight是可视区的高度
      let conHeight = self.$refs.container.clientHeight
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = self.$refs.container.scrollHeight - 4
      //  console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
      console.log(conTop, conHeight, scrollHeight)
      if (
        conTop + conHeight > scrollHeight ||
        conTop + conHeight == scrollHeight
      ) {
        console.log('到底了')
        if (self.ifcanget) {
          // self.load()
          self.getLists()
        }
      }
    })
  },
  created() {
    this.params.onlyNew =
      localStorage.getItem('onlyNew') == 'true' ? true : false
    // 小程序复制链接
    console.log(this.$route.meta)
    if (this.$route.query.code) {
      this.loginWithWeChatOAuth(this.$route.query.code)
    }
    if (this.$route.query.type == 1) {
      let url = decodeURI(this.$route.query.url)
      console.log('url', url)
      this.$dialog
        .confirm({
          title: '',
          message: '是否前往你复制的链接？',
          className: 'DialogsDialogs',
        })
        .then(() => {
          // on confirm

          window.open(url, '_blank')
          history.replaceState({ page: 3 }, 'title 3', '/all')
        })
        .catch(() => {
          history.replaceState({ page: 3 }, 'title 3', '/all')
          // on cancel
        })
    }
    if (this.$route.path.includes('recommend')) {
      this.isRecommend = true
      delete this.params.order
    }
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
    if (this.$route.path == '/all' || this.$route.path == '/middles') {
      this.params.forumId = 'all'
      this.forumInfo = {
        imageName: 'c1aaa496ec1ba20373225d232006ffdc.png',
        name: '全站',
        desc: '聚集所有版块的最新，最热的帖子',
      }
    }

    if (this.$route.path == '/recommend') {
      this.params.forumId = 'recommend'
      this.forumInfo = {
        imageName: '9f4736714abf8139e8cf06b2e56b7305.png',
        name: '推荐',
        desc: '炒饭为您个人推荐的优质内容，希望您能喜欢',
      }
    }
    if (this.$route.path == '/' && !this.islogin) {
      this.params.forumId = 'all'
      this.forumInfo = {
        imageName: 'c1aaa496ec1ba20373225d232006ffdc.png',
        name: '全站',
        desc: '聚集所有版块的最新，最热的帖子',
      }
    } else if (this.$route.path == '/' && this.islogin) {
      this.params.forumId = 'home'
      this.forumInfo = {
        imageName: '07453f3b30076cf0e1ab39ff62fcce0f.png',
        name: '首页',
        desc: '您加入版块的内容聚合',
      }
    }
    // if(!localStorage.getItem('storedata')){
    //     this.getLists()
    // }
    this.load()
  },
  watch: {
    $router(v) {
      console.log(v)
    },
  },
  methods: {
    loginWithWeChatOAuth(code) {
      //判断是否绑定账号
      api.loginWithWeChatOAuth({ authCode: code }).then((res) => {
        if (
          res.errorCode == 'need_register' ||
          res.errorCode == 'get_wechat_user_info_error'
        ) {
          this.showLogin('bind')
        } else {
          history.replaceState({ page: 3 }, 'title 3', location.pathname)
          this.$store.dispatch('user/getInfo')
        }
      })
    },
    nextReplace() {
      if (this.$route.path == '/' && !location.href.includes('code=')) {
        this.$router.replace({ path: '/all' })
      }
    },
    updateList(params) {
      this.params = params
      this.lists = []
      this.getLists()
    },
    getForumInfo() {
      console.log('getForumInfo')
    },
    gotologin() {
      console.log(this.$store.state)
      this.$login({
        callBack: () => {
          this.$store.dispatch('user/getInfo')
        },
      })
    },
    gotoSubmit() {},
    changes() {
      localStorage.setItem('chao.fun.timeline.order', this.params.order)
      localStorage.setItem('chao.fun.timeline.range', this.params.range)
      // this.params.pageNum = 1;
      delete this.params.marker
      delete this.params.key
      this.lists = []
      this.getLists()
    },
    getLists() {
      if (
        this.$store.state.user.listMode == 'normal' &&
        this.params.pageSize != 20
      ) {
        this.params.pageSize = 20
      } else {
        this.params.pageSize = 30
      }
      let params = this.params
      this.ifcanget = false

      api.getHome(params).then((res) => {
        console.log(res)
        this.ifcanget = true

        if (res.data.marker) {
          params.marker = res.data.marker
        } else {
          this.loadAll = true
        }
        if (res.data.posts.length < this.params.pageSize) {
          this.loadAll = true
        }
        if (params.order == 'hot' || params.order == 'comment') {
          params.key = res.data.key
        } else {
          delete params.key
        }
        if (this.$route.path.includes('recommend')) {
          params.key = res.data.key
        }

        // if(this.lists.length>200||this.lists.length==200){
        //   let list = JSON.parse(JSON.stringify(this.lists)).slice(30);
        //   list.push(...res.data.posts)
        //   this.$set(this,'lists',list)
        // }else{
        this.lists.push(...res.data.posts)
        // }
      })
    },
    load() {
      // if (
      //   localStorage.getItem("storedata") &&
      //   localStorage.getItem("spage") == this.$route.path
      // ) {
      //   var data = JSON.parse(localStorage.getItem("storedata"));
      //   this.lists = data.list;
      //   this.params.marker = data.marker;
      //   this.params.key = data.key;
      // } else {
      //   if (this.ifcanget) {
      //     this.getLists();
      //   }
      // }
      if (this.ifcanget) {
        this.getLists()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.asa {
  background: #fff;

  margin-bottom: 20px;
  // display: flex;
}

.forum_con {
  padding: 10px;
  background: #fff;
  margin-left: 10px;
  margin-bottom: 20px;
  width: 270px;
  display: block;
  box-sizing: border-box;
  // min-height: 300px;
  .fir {
    display: flex;

    img {
      width: 50px;
      height: 50px;
      // border-radius: 50%;
    }

    div {
      flex: 1;
      padding-left: 20px;
      line-height: 50px;
    }
  }

  .fensi {
    display: flex;
    line-height: 24px;
    padding: 20px 0;

    div {
      font-size: 14px;
      color: #666;
      flex: 1;
      text-align: center;
    }

    div:nth-child(1) {
      border-right: 1px solid #ddd;
    }
  }

  .forum_desc {
    color: #666;
    font-size: 14px;
    margin-bottom: 30px;
  }

  .forum_add {
    margin-bottom: 10px;
  }

  .el-button {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin: 10px 0;
  }
}

.tologin {
  background: #fff;
  border: 1px solid #f1f1f1;

  div {
    padding: 14px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: $linkcolor;
    }
  }
}

/deep/ .el-input--medium .el-input__inner {
  height: auto;
  line-height: normal;
  padding-top: 8px;
  padding-bottom: 8px;
}

/deep/ .el-scrollbar {
  > .el-scrollbar__bar {
    opacity: 1 !important;
  }
}
.navs {
  justify-content: space-between;
  width: 640px;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
}
.grid-content {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  width: 640px;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
}
.reFresh {
  position: absolute;
  right: 20px;
  bottom: 30px;
  z-index: 100;
  padding: 20px;
  background: #fff;
  border-radius: 40px;
  font-size: 32px;
  padding: 6px 0px 0 0px;
  color: #999;
  position: relative;
}
</style>
