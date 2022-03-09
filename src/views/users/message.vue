<template>
  <!-- <div :class="['content',{'content2':ISPHONE}]">
     <div class="container infinite-list" v-infinite-scroll="load">
       <noticeItem v-for="(item,index) in message" :key="index" :items="item"></noticeItem>
     </div>
   </div> -->
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div
      class="container"
      ref="container"
      :style="{ height: scrollHeight + 'px' }"
    >
      <div style="height: 50px"></div>
      <el-row :gutter="24">
        <el-col :span="ISPHONE ? 24 : doWidth()" :offset="0">
          <div class="new_msg">
            <div v-if="!ISPHONE" class="left_nav">
              <div class="ccc">
                <div
                  @click="checkTab(item)"
                  v-for="(item, index) in msgNavs"
                  :key="index"
                  :class="[
                    'tag_item',
                    { tag_item_active: params.type == item.value },
                  ]"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
            <div
              class="grid-content"
              style="
                overflow: auto;
                width: 640px;
                max-width: 100%;
                margin: 0 auto;
              "
            >
              <div class="title">我的消息</div>
              <div v-if="message.length">
                <noticeItem
                  v-for="(item, index) in message"
                  :key="index"
                  :items="item"
                  :humanizeTimeFormat="humanizeTimeFormat"
                  @call-father-humanizeTimeFormatSwitch="
                    humanizeTimeFormatSwitch
                  "
                ></noticeItem>
                <load-text
                  :ifcanget="ifcanget"
                  :loadAll="loadAll"
                  :hasContent="Boolean(message.length)"
                ></load-text>
              </div>
              <div v-else-if="!loading" class="nothing">
                <img src="../../assets/images/kk.png" alt="" />
                <p>还没有消息哦~</p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import noticeItem from '@/components/chaofan/noticeItem'
import loadText from '@/components/chaofan/loadText'
import * as api from '../../api/api'
export default {
  name: '',
  data() {
    return {
      humanizeTimeFormat: true,
      msgNavs: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '评论',
          value: 'comment',
        },
        {
          label: '@ 我',
          value: 'at',
        },
        {
          label: '点赞',
          value: 'upvote',
        },
        {
          label: '通知',
          value: 'notice',
        },
      ],
      params: {
        pageSize: 20,
        type: '',
        //  marker: ''
      },
      message: [],
      ifcanget: true,
      loadAll: false,
      loading: false,
    }
  },
  components: {
    noticeItem,
    loadText,
  },
  created() {
    this.load()
  },
  mounted() {
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
          self.messageList()
        }
      }
    })
  },
  methods: {
    humanizeTimeFormatSwitch() {
      this.humanizeTimeFormat = !this.humanizeTimeFormat
    },

    checkTab(item) {
      this.params.type = item.value
      this.ifcanget = true
      this.params.marker = ''
      this.loadAll = false
      this.loading = true
      this.message = []
      this.messageList()
    },
    load() {
      if (this.ifcanget) {
        this.messageList()
      }
    },
    messageList() {
      let params = this.params
      this.ifcanget = false
      api.messageList(params).then((res) => {
        // this.message = res.data.messages;
        this.loading = false
        if (res.data.marker && res.data.size == this.params.pageSize) {
          this.ifcanget = true
        }
        if (res.data.marker) {
          params.marker = res.data.marker
        } else {
          if (res.data.size < this.params.pageSize) {
            console.log(res.data.size)
            this.loadAll = true
          }
        }
        if (res.data.size < this.params.pageSize) {
          this.loadAll = true
        }
        this.message.push(...res.data.messages)
      })
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.content {
  // width: 640px;
  // margin: 40px auto;
  // margin-left: 100px;
  // background: #fff;
  padding: 30px;
}
.content2 {
  padding: 10px;
}
.title {
  font-size: 16px;
  padding: 10px 0;
}
.nothing {
  text-align: center;
  font-size: 14px;
  color: #999;
  img {
    width: 50%;
  }
}
.new_msg {
  width: 750px;
  max-width: 100%;
  display: flex;
  margin: 0 auto;
  .left_nav {
    flex: 0 0 90px;
    height: 500px;
    // background: #fff;
    margin-right: 20px;
    margin-top: 30px;
    position: relative;
    // .ccc{
    //   position: absolute;
    //   left: 0;
    //   top: 0;

    // }
    .nav_i {
      line-height: 40px;
      background: #fff;
      border-radius: 4px;
      text-align: center;
      margin-bottom: 10px;
    }
    .tag_item {
      border: 1px solid transparent;
      line-height: 30px;
      text-align: center;
      margin: 10px 0;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
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
  }
  .grid-content {
    flex: 1;
  }
}
</style>
