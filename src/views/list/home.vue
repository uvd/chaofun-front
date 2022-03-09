<template>
  <div
    id="container"
    class="dashboard-container container infinite-list"
    ref="container"
    :style="{ height: scrollHeight + 'px' }"
  >
    <div>
      <div
        v-if="!ISPHONE"
        style="padding-top: 50px; display: block; background-color: white"
      >
        <div
          v-if="forumInfo.bannerImageName"
          :style="{
            height: '164px',
            padding: '8px, 16px',
            background:
              'url(' +
              imgOrigin +
              forumInfo.bannerImageName +
              ')  no-repeat center / cover',
          }"
        ></div>
        <div v-else style="height: 80px; background-color: #3ba8ff"></div>
        <div class="forum_tab">
          <div class="forum_desc">
            <div style="width: 72px; height: 72px">
              <img
                v-if="forumInfo.imageName"
                :src="
                  imgOrigin +
                  forumInfo.imageName +
                  '?x-oss-process=image/resize,h_70/format,webp/quality,q_75'
                "
                class="forum_info_icon"
              />
            </div>
            <div class="box_class">
              <div style="box-sizing: border-box">
                <div
                  style="
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                  "
                >
                  <h1 class="forum_info_name">{{ forumInfo.name }}</h1>
                  <div style="padding-left: 20px">
                    <button
                      class="notJoin-button"
                      @click="inout(1)"
                      v-if="!forumInfo.joined"
                    >
                      加入版块
                    </button>
                    <button
                      class="join-button"
                      @click="inout(2)"
                      v-else
                      type="danger"
                      round
                    >
                      退出版块
                    </button>
                  </div>
                </div>
                <h2 class="forum_desc_text">{{ forumInfo.desc }}</h2>
              </div>
            </div>
          </div>
          <div v-if="GameInfo || tableList.length" class="navTab">
            <div
              @click="checkoutTab('post')"
              :class="[tab == 'post' ? 'tab_item_act' : 'tab_item']"
            >
              帖子
            </div>
            <div
              v-if="GameInfo"
              @click="checkoutTab('predictions')"
              :class="[tab == 'predictions' ? 'tab_item_act' : 'tab_item']"
            >
              竞猜
            </div>
            <div
              v-if="tableList.length"
              @click="checkoutTab('table')"
              :class="[tab == 'table' ? 'tab_item_act' : 'tab_item']"
            >
              表格
            </div>
          </div>
        </div>
      </div>
      <div v-else style="padding-top: 50px"></div>
      <div v-show="tab == 'post'" class="main_content">
        <div v-if="!ISPHONE" class="main_left">
          <div v-if="tagList.length" class="fixed_tag">
            <div
              @click="checkTag({ id: '' })"
              :class="['tag_item', { tag_item_active: !params.tagId }]"
            >
              全部
            </div>
            <div
              @click="checkTag(item)"
              v-for="(item, index) in tagList"
              :key="index"
              :class="[
                'tag_item',
                { tag_item_active: item.id == params.tagId },
              ]"
            >
              # {{ item.name
              }}<span v-if="tagCountList.length">{{ doTagCount(item) }}</span>
            </div>
          </div>
        </div>
        <div class="main_center">
          <div class="navs" :style="{ left: ISPHONE ? '0' : '0px' }">
            <div style="width: 100%">
              <selectList
                @updateList="updateList"
                :params="params"
              ></selectList>
            </div>
          </div>
          <div class="grid-content" :style="{ left: ISPHONE ? '0' : '0px' }">
            <keep-alive>
              <ListItem
                v-if="$store.state.user.listMode == 'normal'"
                :marker="params.marker"
                :keys="params.key"
                :isindex="false"
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
            </keep-alive>

            <load-text :ifcanget="ifcanget" :loadAll="loadAll"></load-text>
          </div>
        </div>
        <div v-if="!ISPHONE" class="main_right">
          <div v-if="!ISPHONE && clientWidth > 865" class="fixed_r">
            <div
              v-if="!ISPHONE"
              style="
                min-width: 300px;
                padding-top: 0px;
                display: block;
                height: 100%;
              "
              class="grid-content bg-purple content-right"
            >
              <RightCom
                :forumInfo="forumInfo"
                @getForumInfo="getForumInfo"
                :islogin="islogin"
              ></RightCom>
            </div>
          </div>
        </div>
      </div>
      <prediction
        v-if="GameInfo"
        :isForumPage="true"
        :GameInfo="GameInfo"
        :forumId="params.forumId"
        v-show="tab == 'predictions'"
      ></prediction>
      <div v-show="tab == 'table'" class="tables">
        <div v-show="tab == 'table'" class="main_content">
          <div v-if="!ISPHONE" class="main_left"></div>

          <div class="main_center">
            <div
              v-for="(item, index) in tableList"
              :key="index"
              class="table_item"
            >
              <div class="table_title">
                <i
                  v-if="tableList && tableList.length > 1"
                  @click="checkoutTable(1)"
                  :class="[
                    'el-icon-caret-left',
                    'iconsa',
                    tableIndex == 0 ? 'disabled' : '',
                  ]"
                ></i>
                <div class="t_name">{{ item.name }}</div>
                <i
                  v-if="tableList && tableList.length > 1"
                  @click="checkoutTable(2)"
                  :class="[
                    'el-icon-caret-right',
                    'iconsa',
                    tableIndex == tableList.length - 1 ? 'disabled' : '',
                  ]"
                ></i>
              </div>
              <!-- <div @click="toggleTable(item)" class="table_desc">{{item.desc}}</div> -->
              <div v-if="tables.table.length" class="table_main">
                <el-table
                  :data="tables.table"
                  style="width: 100%"
                  :row-class-name="tableRowClassName"
                >
                  <el-table-column width="50" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="(it, inds) in tables.header"
                    :key="inds"
                    :label="it"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row[it] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div v-if="!ISPHONE" class="main_right"></div>
        </div>
      </div>
    </div>
    <fixedBottom></fixedBottom>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '../../api/api'

import ListItem from '../../components/chaofan/ListItem.vue'
import SimListItem from '../../components/chaofan/SimListItem.vue'
import RightCom from '@/components/chaofan/RightCom'
import loadText from '@/components/chaofan/loadText'
import fixedBottom from '@/components/chaofan/fixedBottom'

import selectList from '@/components/chaofan/common/selectList'

import prediction from '@/views/activity/prediction'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      tab: 'post',
      hasGetData: false,
      pinList: [],
      currentRole: 'adminDashboard',
      count: 5,
      lists: [],
      forumId: '',
      params: {
        onlyNew: false,
        forumId: '',
        pageSize: 30,
        order:
          localStorage.getItem('chao.fun.timeline.order') == null
            ? 'hot'
            : localStorage.getItem('chao.fun.timeline.order'),
        range:
          localStorage.getItem('chao.fun.timeline.range') == null
            ? '1day'
            : localStorage.getItem('chao.fun.timeline.range'),
      },

      isPhone: false,
      forumInfo: {},
      ifcanget: true,
      loadAll: false,
      options: [
        {
          label: '最新',
          value: 'new',
          choose: true,
        },
        {
          label: '最热',
          value: 'hot',
          choose: false,
        },
        {
          label: '新评',
          value: 'comment',
          choose: false,
        },
        {
          label: '最赞',
          value: 'ups',
          choose: false,
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
      tagList: [],
      tagCountList: [],
      GameInfo: '',
      tableList: [],
      tables: {
        table: [],
      },
      tableIndex: 0,
    }
  },
  components: {
    ListItem,
    RightCom,
    loadText,
    fixedBottom,
    selectList,
    SimListItem,
    prediction,
  },
  watch: {
    // 'params.forumId'(v){
    //   this.params.pageNum = 1;
    //   this.lists = []
    // }
  },
  computed: {
    ...mapGetters(['roles', 'islogin']),
  },
  activated() {
    console.log('666', this.$route.query)
    if (this.$route.query.time) {
      this.toPosition()
    }
    this.getForumInfo()
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
    if (
      this.$store.state.user.listMode == 'normal' &&
      this.params.pageSize != 20
    ) {
      this.params.pageSize = 20
    } else {
      this.params.pageSize = 30
    }

    this.getGameInfo()
    this.getTableList()
    console.log(777)
    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    if (this.$route.query.game) {
      localStorage.setItem('gamemodule', true)
    }

    let self = this
    this.$refs.container.addEventListener('scroll', function () {
      let scrollTop = self.$refs.container.scrollTop
      let conTop = self.$refs.container.scrollTop
      // 变量windowHeight是可视区的高度
      let conHeight = self.$refs.container.clientHeight
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = self.$refs.container.scrollHeight - 4
      // console.log("距顶部" + scrollTop + "可视区高度" + conHeight + "滚动条总高度" + scrollHeight);
      // console.log(conTop,conHeight,scrollHeight)
      if (conTop + conHeight >= scrollHeight) {
        console.log('到底了')
        if (self.ifcanget) {
          // self.load()
          self.getLists()
        }
      }
    })
    // document.querySelector('meta[name="keywords"]').setAttribute("content", '111')
    // document.querySelector('meta[name="description"]').setAttribute("content", '222')
    this.$EventBus.$on('unPin', (index) => {
      //需要执行的代码
      this.lists.splice(index, 1)
    })
    this.$EventBus.$on('refreshItemTag', (params) => {
      //需要执行的代码
      console.log(params)
      if (params.way) {
        //refreshItemTag
        this[params.way]()
      } else {
        if (params.type) {
          // this.lists[params.index].tags.push(params.tag);
          this.lists[params.index].tags.splice(0, 1, params.tag)
        } else {
          // this.lists[params.index].tags.splice(
          //   this.lists[params.index].tags.findIndex((i) => i.id == params.tag.id),
          //   1
          // );
          this.lists[params.index].tags.splice(0, 1)
        }
      }
    })
    this.$EventBus.$on('resetItem', (params) => {
      //需要执行的代码
      this.lists.splice(params.index, 1, params.item)
    })
    this.$EventBus.$on('updateItem', (params) => {
      //需要执行的代码
      if (params.type == 'delete') {
        let index = this.lists.findIndex((i) => i.postId == params.postId)
        this.lists.splice(index, 1)
      } else if (params.type == 'update') {
        let index = this.lists.findIndex((i) => i.postId == params.postId)
        this.lists.splice(index, 1, params.item)
      }
    })
  },

  created() {
    this.params.onlyNew =
      localStorage.getItem('onlyNew') == 'true' ? true : false
    console.log(555)
    let id = this.$route.path.split('/')[2]
    if (!isNaN(id)) {
      this.params.forumId = id
      // if(!localStorage.getItem('storedata')){
      //   this.getLists()
      // }
    }
    // if(this.$route.params.forumId == 17){
    //   this.params.pageSize = 7
    // }
    this.params.forumId = this.$route.params.forumId

    if (this.$route.params.type) {
      this.tab = this.$route.params.type
    }

    this.load()
  },
  methods: {
    checkoutTable(v) {
      if (v == 1) {
        if (this.tableIndex > 0) {
          this.tableIndex -= 1
          this.toggleTable()
        }
      } else {
        if (this.tableIndex + 1 < this.tableList.length) {
          this.tableIndex += 1

          this.toggleTable()
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'warning-row success-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    toggleTable() {
      if (this.tableList.length) {
        api
          .tableGet({ tableId: this.tableList[this.tableIndex].id })
          .then((res) => {
            let lines = res.data.data.split('\n') // 1️⃣
            let header = lines[0].split(',') // 2️⃣
            let output = lines.slice(1).map((line) => {
              let fields = line.split(',') // 3️⃣
              return Object.fromEntries(header.map((h, i) => [h, fields[i]])) // 4️⃣
            })

            this.tables = {
              header,
              table: output,
            }

            console.log(output)
            console.log(res)
          })
      }
    },
    getGameInfo() {
      api.predictionsGet({ forumId: this.params.forumId }).then((res) => {
        if (res.data) {
          this.GameInfo = res.data
        }
      })
    },
    getTableList() {
      api.forumtablelist({ forumId: this.params.forumId }).then((res) => {
        res.data.forEach((item) => {
          item.show = false
          item.table = []
          item.header = []
          // item.desc = '41547878'
        })
        this.tableList = res.data
        this.toggleTable(this.tableList[0])
      })
    },
    checkoutTab(v) {
      this.tab = v
      history.pushState(
        {},
        null,
        `/f/${this.params.forumId}${v == 'post' ? '' : '/' + this.tab}`
      )
      // if(v=='table'&&!this.tableList.length){
      //   api.forumtablelist({forumId: this.params.forumId}).then(res=>{
      //     res.data.forEach(item=>{
      //       item.show = false;
      //       item.table = [];
      //       item.header = [];
      //     })
      //     this.tableList = res.data;
      //   })
      // }
    },
    inout(v) {
      if (this.$store.state.user.islogin) {
        if (v == 1) {
          // 加入
          api.joinForum({ forumId: this.params.forumId }).then((res) => {
            if (res.success) {
              this.$message({
                message: '加入成功',
                type: 'success',
                offset: 20,
              })
              this.forumInfo.joined = true
              // this.getForumInfo()
            }
          })
        } else if (v == 2) {
          api.leaveForum({ forumId: this.params.forumId }).then((res) => {
            if (res.success) {
              this.$message({
                message: '退出成功',
                type: 'success',
                offset: 20,
              })
              this.forumInfo.joined = false
              // this.getForumInfo()
            }
          })
        }
      } else {
        this.showLogin('login')
      }
    },
    doTagCount(item) {
      let count
      try {
        count =
          this.tagCountList[
            this.tagCountList.findIndex((it) => it.tag_id == item.id)
          ].count
      } catch {
        count = 0
      }

      if (count) {
        return '(' + count + ')'
      } else {
        return ''
      }
    },
    listTagPostCount() {
      api.listTagPostCount({ forumId: this.params.forumId }).then((res) => {
        this.tagCountList = res.data
      })
    },
    saveTagId() {
      if (this.params.tagId) {
        localStorage.setItem('tagInfo', JSON.stringify(this.params))
      }
    },
    listPins() {
      api.listPins({ forumId: this.params.forumId }).then((res) => {
        res.data.forEach((item) => {
          item.isPin = true
        })
        this.pinList = res.data
        this.lists.unshift(...res.data)
      })
    },
    chooseNav(index, item) {
      this.options.forEach((i) => {
        i.choose = false
      })
      item.choose = true
      this.options.splice(index, 1, item)
      localStorage.setItem('chao.fun.timeline.order', item.value)
      localStorage.setItem('chao.fun.timeline.range', this.params.range)
      delete this.params.marker
      delete this.params.key
      // delete this.params.tagId;
      this.params.order = item.value
      this.lists = []
      this.getLists('first')
    },
    updateList(params) {
      this.params = params
      // delete this.params.tagId;
      this.lists = []
      this.getLists('first')
    },
    changes() {
      localStorage.setItem('chao.fun.timeline.order', this.params.order)
      localStorage.setItem('chao.fun.timeline.range', this.params.range)
      delete this.params.marker
      delete this.params.key
      // delete this.params.tagId;
      this.lists = []
      this.getLists('first')
    },
    getForumInfo() {
      api.getForumInfo({ forumId: this.params.forumId }).then((res) => {
        if (res.success) {
          this.forumInfo = res.data
          document.title = '【' + res.data.name + '】- ' + document.title
          this.$store.dispatch('var/SET_formName', this.forumInfo.name)
          if (res.data.desc) {
            document
              .querySelector('meta[name="description"]')
              .setAttribute('content', res.data.desc)
          }
        } else {
          this.$router.push('/404')
        }
      })
    },
    checkTag(item) {
      this.params.tagId = item.id
      delete this.params.marker
      delete this.params.key
      this.lists = []
      this.getLists('first')
    },
    getForumTag() {
      api.getlistTag({ forumId: this.params.forumId }).then((res) => {
        this.listTagPostCount()
        this.tagList = res.data
      })
    },
    getLists(v) {
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
      if (v == 'first') {
        if (!this.tagList.length) {
          //获取置顶帖子

          //获取标签列表
          this.getForumTag()
        }
        if (params.order == 'hot' && !params.tagId) {
          this.listPins()
        }
      }
      api.getPosts(params).then((res) => {
        if (res.data.marker && res.data.posts.length != 0) {
          this.ifcanget = true
        }
        if (res.data.marker) {
          params.marker = res.data.marker
        } else {
          if (res.data.posts.length === 0) {
            this.loadAll = true
          }
        }
        if (res.data.posts.length === 0) {
          this.loadAll = true
        }
        if (params.order == 'hot' || params.order == 'comment') {
          params.key = res.data.key
        } else {
          delete params.key
        }
        this.lists.push(...res.data.posts)
      })
    },
    load() {
      if (this.ifcanget) {
        this.getLists('first')
      }
      // if (
      //   localStorage.getItem("storedata") &&
      //   localStorage.getItem("spage") == this.$route.path
      // ) {
      //   // var sdata = JSON.parse(localStorage.getItem("storedata"));
      //   // this.lists = sdata.list;
      //   // this.params.marker = sdata.marker;
      //   // this.params.key = sdata.key;
      //   // let tagInfo = JSON.parse(localStorage.getItem("tagInfo"));
      //   // if (tagInfo && tagInfo.forumId == sdata.forumId) {
      //   //   this.params.tagId = tagInfo.tagId;
      //   //   localStorage.removeItem("tagInfo");
      //   // }
      //   // this.getForumTag();
      // } else {
      //   if (this.ifcanget) {
      //     this.getLists("first");
      //   }
      // }
    },
  },
}
</script>

<style lang="scss" scoped>
.fixed_r {
  position: relative;
  display: block;
  height: 100%;
}
.content-right {
  top: 0px;
}
.rright {
  // max-height: ;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
.navs {
  justify-content: space-between;
  width: 640px;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
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
  overflow: auto;
  width: 640px;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.asa {
  margin-bottom: 20px;
  // display: flex;
}
.fixed_tag {
  position: sticky;
  width: 120px;
  // height: 700px;
  top: 50px;
  bottom: 0;
  z-index: 10;
  overflow-y: auto;
  // background: #fff;
  box-sizing: border-box;
  padding: 4px;
  // background: red;
  // left: 220px;
}
.tag_item {
  border: 1px solid transparent;
  line-height: 36px;
  // text-align: center;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  padding-left: 5px;
  span {
    font-size: 12px;
  }
  &:hover {
    border: 1px solid #f1f1f1;
    background: #f1f1f1;
  }
}
.tag_item_active {
  background: rgba(255, 147, 0, 0.3);
  &:hover {
    background: rgba(255, 147, 0, 0.3);
    border: 1px solid rgba(255, 147, 0, 0.3);
  }
}
.forum_tab {
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 0 auto;
  width: 984px;
  padding: 0 16px 0 24px;
}

.forum_desc {
  display: flex;
  padding-bottom: 16px;
  margin-top: -14px;
}
.forum_info_icon {
  border-radius: 100%;
  border: 4px solid #fff;
  display: inline-block;
  height: 72px;
  width: 72px;
  background-color: #fff;
  background-size: cover;
}
.box_class {
  box-sizing: border-box;
  align-items: flex-start;
  display: inline-flex;
  flex: 1;
  padding-left: 16px;
  margin-top: 24px;
  position: relative;
  width: calc(100% - 80px);
}
.forum_info_name {
  font-size: 28px;
  font-weight: 700;
}
.forum_desc_text {
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  padding-top: 5px;
  color: var(--newRedditTheme-metaText);
}

.iconsa {
  font-size: 28px;
  line-height: 30px;
  cursor: pointer;
}
.disabled {
  color: #ddd !important;
}

._2iuoyPiKHN3kfOoeIQalDT {
}
.navTab {
  display: flex;
  line-height: 35px;
  padding-left: 68px;
  font-size: 15px;
  .tab_item {
    text-align: center;
    flex: 0 0 60px;
    cursor: pointer;
    /*background: #f1f1f1;*/
    /*border: 1px solid #f1f1f1;*/
    color: #999;
    /*cursor: pointer;*/
    &:hover {
      color: #0179d2;
      font-weight: bold;
      opacity: 0.7;
    }
  }
  .tab_item_act {
    text-align: center;
    flex: 0 0 60px;
    border-bottom: 3px solid #0179d2;
    /*background: ;*/
    color: black;
    font-weight: bold;
    // border-top: 1px solid #f1f1f1;
    // border-left: 1px solid #f1f1f1;
  }
}
.tables {
}
.table_item {
  padding: 10px 14px;
  margin: 0 12px 12px;
  background: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  .table_title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 6px;
    line-height: 30px;
    display: flex;
    .t_name {
      flex: 1;
      text-align: center;
    }
    i {
      float: right;
      color: #999;
      line-height: 24px;
    }
  }
}
.table_main {
  margin-top: 14px;
}
/deep/ .el-table .warning-row {
  background: oldlace;
}

/deep/ .el-table .success-row {
  background: #f0f9eb;
}
</style>
