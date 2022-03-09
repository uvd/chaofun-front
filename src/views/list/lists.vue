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
        <!-- <div v-if="!ISPHONE" class="main_left">
          
          </div> -->
        <div class="main_center">
          <div
            class="grid-content"
            style="
              overflow: auto;
              width: 740px;
              max-width: 100%;
              margin: 0 auto;
            "
          >
            <div class="ccc">
              <div v-if="!ISPHONE" class="left_navs">
                <div
                  @click="chooseCate(item)"
                  v-for="(item, index) in lists"
                  :key="index"
                  :class="[
                    'left_li',
                    { items_title_active: cateId == item.id },
                  ]"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="right_main">
                <div
                  v-for="(item, index) in listsData"
                  :key="index"
                  @click="toUrl({ path: '/f/' + item.id })"
                >
                  <div class="item">
                    <img
                      :src="
                        'https://i.chao.fun/' +
                        item.imageName +
                        '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
                      "
                      alt=""
                    />
                    <div class="center">
                      <div class="name">{{ item.name }}</div>

                      <div class="desc">{{ item.desc }}</div>
                    </div>
                    <div class="right">
                      <div class="followers">关注：{{ item.followers }}</div>
                      <div>
                        <span
                          @click.stop="toAttent(item, index)"
                          :class="['btn', item.joined ? 'btn1' : '']"
                          >{{ item.joined ? '退出版块' : '加入版块' }}</span
                        >
                        <span @click.stop="toSubs(item, index)" class="btn btn2"
                          >发帖</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!listsData.length" class="nothing">
                  <p>暂无版块哦~</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div v-if="!ISPHONE" class="main_right">
            <div class="fixed_r">
              <div v-if="!ISPHONE" style="min-width:300px;padding-top: 10px;" class="grid-content bg-purple content-right">
                <RightDescribe :forumInfo="forumInfo" @getForumInfo="getForumInfo" :islogin="true"></RightDescribe>
              </div>
            </div>
          </div> -->
      </div>
      <!-- <el-row :gutter="24">
          <el-col :span="isPhone?24:doWidth()" :offset="0" >
          
            <div class="grid-content"  style="overflow:auto; width: 740px; max-width: 100%;margin:0 auto;">
              <div class="ccc">
                  <div v-if="!ISPHONE" class="left_navs">
                      <div @click="chooseCate(item)" v-for="(item,index) in lists" :key="index" :class="['left_li',{'items_title_active':cateId==item.id}]" >
                          {{item.name}}
                      </div>
                  </div>
                  <div class="right_main">
                      <div v-for="(item,index) in listsData" :key="index"  @click="toUrl({path:'/f/'+item.id})">
                          <div class="item">
                            <img :src="'https://i.chao.fun/'+item.imageName+'?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
                            <div class="center">
                              <div class="name">{{item.name}}</div>

                              <div class="desc">{{item.desc}}</div>
                            </div>
                            <div class="right">
                              <div class="followers">关注：{{item.followers}}</div>
                              <div>
                                <span @click.stop="toAttent(item,index)" :class="['btn', item.joined?'btn1':'']">{{item.joined?'退出版块':'加入版块'}}</span>
                                <span @click.stop="toSubs(item,index)" class="btn btn2">发帖</span>
                              </div>
                            </div>
                          </div>
                      </div>
                      <div v-if="!listsData.length" class="nothing">
                          <p>暂无版块哦~</p>
                      </div>
                  </div>
              </div>
            
            </div>
          </el-col>
        </el-row> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '../../api/api'

import ListItem from '../../components/chaofan/ListItem.vue'
import RightCom from '@/components/chaofan/RightCom'
import loadText from '@/components/chaofan/loadText'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      count: 5,
      lists: [],
      forumId: '',
      params: {
        pageNum: 0,
      },
      options: [
        {
          label: '最热',
          value: 'hot',
        },
        {
          label: '最新',
          value: 'new',
        },
        {
          label: '新评',
          value: 'comment',
        },
      ],
      isPhone: false,
      forumInfo: null,
      ifcanget: true,
      loadText: false,
      loadAll: false,
      keyword: '',
      listsData: [],
      cateId: '',
    }
  },
  components: {
    ListItem,
    loadText,
  },
  watch: {
    // '$store.state.var.cateId'(v){
    //     this.cateId = v;
    //     this.load()
    // }
  },
  computed: {
    ...mapGetters(['roles', 'islogin']),
  },
  mounted() {
    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    this.toPosition()
    // api.getMenu({pageNum:1,order:'new'}).then(res=>{
    //   console.log(res)
    // })
    let self = this
    this.$refs.container.addEventListener('scroll', function () {
      let scrollTop = self.$refs.container.scrollTop
      let conTop = self.$refs.container.scrollTop
      // 变量windowHeight是可视区的高度
      let conHeight = self.$refs.container.clientHeight
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = self.$refs.container.scrollHeight - 4
      //  console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
      // console.log(conTop,conHeight,scrollHeight)
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
    let id = this.$route.path.split('/')[2]
    this.params.keyword = this.$route.query.q
    this.keyword = this.$route.query.q
    this.getListTag()

    console.log(this.$store.state.settings.leftNav)
  },
  methods: {
    toAttent(item, index) {
      item.joined = !item.joined
      if (this.$store.state.user.islogin) {
        if (item.joined) {
          // 加入
          api.joinForum({ forumId: item.id }).then((res) => {})
        } else {
          api.leaveForum({ forumId: item.id }).then((res) => {})
        }
      } else {
        this.showLogin('login')
      }
    },
    toSubs(item) {
      console.log(item)
      this.toPost(item.id, item.name, item.imageName)
    },
    chooseCate(item) {
      this.cateId = item.id
      this.load()
    },
    getListTag() {
      api.listTags({}).then((res) => {
        // this.$store.dispatch('settings/SET_leftNav','allForm')
        // this.$store.dispatch('permission/SET_formRoute',res.data)
        this.lists = res.data
        this.load()
      })
    },
    getLists() {
      let params = this.params
      this.ifcanget = false
      api.listForumsByTag({ tagId: this.cateId || '0' }).then((res) => {
        console.log(res)
        this.ifcanget = true
        this.params.pageNum += 1
        this.listsData = res.data
      })
    },
    load() {
      this.getLists()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  // background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding-top: 20px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.item {
  display: flex;
  padding: 10px 20px;
  background: #fff;
  // margin-bottom: 10px;
  // border-radius: 10px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
  align-items: center;
  .center {
    flex: 1;
  }
  .right {
    flex: 0 0 120px;
    text-align: right;
  }
  .btn {
    padding: 2px 6px;
    background: #1890ff;
    color: #fff;
    border-radius: 4px;
    margin-left: 10px;
    font-size: 12px;
    margin-top: 4px;
    display: inline-block;
    vertical-align: middle;
  }
  .btn1 {
    background: #ccc;
  }
  .btn2 {
    background: #ff9300;
  }
  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    vertical-align: middle;
  }
  .desc {
    flex: 1;
    font-size: 13px;
    color: #999;
    line-height: 22px;
  }
  .name {
    margin-right: 10px;
  }
  .followers {
    flex: 0 0 84px;
    font-size: 13px;
    color: #999;
    text-align: right;
  }
}
.nothing {
  background: #fff;
  width: 100%;
  text-align: center;
  padding: 100px 0 50px;
  color: #999;
}
.ccc {
  display: flex;
  background: #fff;
  .left_navs {
    flex: 0 0 120px;
    border-right: 1px solid #f1f1f1;
    .left_li {
      line-height: 40px;
      padding-left: 20px;
      border-bottom: 1px solid #f1f1f1;
      cursor: pointer;
    }
    .items_title_active {
      color: $linkcolor;
    }
  }
  .right_main {
    flex: 1;
  }
}
</style>
