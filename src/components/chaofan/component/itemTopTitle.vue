<template>
  <h1>
    <div>
      <div v-if="item.isPin" style="display: inline-block">
        <img
          class="icon icon2"
          :src="
            imgOrigin +
            'biz/daa54c993451a77d3e723405afbcd15c.png?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
          "
          alt=""
        />
        <span class="zhiding">版主置顶</span>
      </div>

      <img
        v-if="isindex"
        class="icon"
        :src="
          imgOrigin +
          item.forum.imageName +
          '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
        "
        alt=""
      />
      <span @click.stop="" v-if="isindex" class="module_name">
        <b @click.stop="toForum(item)"> {{ item.forum.name }} </b>
        <div class="hovercon">
          <div>
            <img
              style=""
              class="imgs"
              :src="
                imgOrigin +
                item.forum.imageName +
                '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
              "
              alt=""
            />
            <i style="font-style: normal; font-size: 16px">{{
              item.forum.name
            }}</i>
          </div>
          <div class="shu">
            <div style="display: flex; justify-content: space-around">
              <div>{{ item.forum.followers }}</div>
              <div>{{ item.forum.posts }}</div>
            </div>
            <div style="display: flex; justify-content: space-around">
              <div>粉丝</div>
              <div>贴子</div>
            </div>
          </div>
          <div style="text-align: center">
            <el-button
              @click.stop="
                toUrls(item, { url: '/f/' + item.forumId, routeType: 1 })
              "
              type="success"
              size="mini"
              >进入版块</el-button
            >
          </div>
        </div>
      </span>
      来自
      <span class="username username_toHover">
        <b @click.stop="toUser(item.userInfo)">{{
          item.userInfo ? item.userInfo.userName : '测试账号'
        }}</b>
        <div
          v-if="item.userInfo"
          :class="['hovercon', { hovercon2: !item.userInfo.desc }]"
        >
          <div style="display: flex">
            <img
              @click.stop="toUser(item.userInfo)"
              style="width: 40px; height: 40px"
              class="imgs"
              :src="
                imgOrigin +
                item.userInfo.icon +
                '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'
              "
              alt=""
            />
            <div>
              <i
                @click.stop="toUser(item.userInfo)"
                style="font-style: normal; font-size: 16px"
                >{{ item.userInfo.userName }}</i
              >
              <p style="font-size: 12px; color: #999">
                获赞：{{ item.userInfo.ups }}
              </p>
            </div>
          </div>
          <div v-if="item.userInfo.desc" class="shu">
            <div>{{ item.userInfo.desc }}</div>
          </div>
          <div v-if="!item.userInfo.desc" style="height: 15px"></div>
          <div style="text-align: center">
            <el-button
              @click.stop="
                toAttention(
                  item.userInfo.focused,
                  item.userInfo.userId,
                  item.userInfo
                )
              "
              :type="item.userInfo.focused ? 'info' : 'success'"
              size="mini"
            >
              {{ item.userInfo.focused ? '取消关注' : '关注' }}
            </el-button>
          </div>
        </div>
      </span>
      <span
        v-if="item.userInfo.userTag"
        title="用户在版块的标签"
        style="
          background-color: rgb(237, 239, 241);
          color: rgb(26, 26, 27);
          padiding: 0, 0;
        "
        >{{ item.userInfo.userTag.data }}</span
      >
      <span
        class="time"
        v-if="humanizeTimeFormat"
        title="点击切换时间格式"
        @click.stop="changeTimeFormat"
        >{{
          moment.duration(moment(item.gmtCreate) - moment()).humanize(true)
        }}</span
      >
      <span
        class="time"
        v-else
        @click.stop="changeTimeFormat"
        title="点击切换时间格式"
        >{{ moment(item.gmtCreate).format('YYYY年MM月DD日 HH:mm:ss') }}</span
      >
      <span class="time" v-if="order == 'comment' && item.gmtComment"
        >新评于
        {{
          moment.duration(moment(item.gmtComment) - moment()).humanize(true)
        }}</span
      >
    </div>
    <!-- <div v-if="isMy&&datas.type=='pub'" @click.stop="deletePost(item,index)" class="delete">删除</div> -->
    <div @click.stop="" class="delete">
      <!-- @click.stop="deletePost(item,index)" -->
      <!-- <i class="el-icon-delete"></i> 删除 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <!-- 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> -->
          <el-icon style="font-size: 24px"><el-icon-more /></el-icon>
        </span>
        <el-dropdown-menu style="width: 150px" slot="dropdown">
          <el-dropdown-item v-if="item.canDeleted" command="添加标签">
            <div @click.stop="toadd" class="addTag">添加标签 ></div>
          </el-dropdown-item>
          <div v-if="showTag" class="showTags">
            <div v-if="tagList.length">
              <!-- <div
                    @click="clickTagAdd(it)"
                    class="k"
                    v-for="(it, ins) in tagList"
                    :key="ins"
                  >
                    <el-dropdown-item command="">
                      <div class="addTag">{{ it.name }}</div>
                    </el-dropdown-item>
                  </div> -->
              <el-checkbox-group @change="aaa" v-model="tags">
                <div class="k" v-for="(it, ins) in tagList" :key="ins">
                  <el-checkbox
                    @change="changeBox($event, it)"
                    :label="it.id"
                    :model-value="it.name"
                    style="width: 100%"
                    >{{ it.name }}</el-checkbox
                  >
                </div>
              </el-checkbox-group>
            </div>
            <div v-else>暂无标签</div>
          </div>
          <el-dropdown-item v-if="item.canChangeTitle" command="加入合集">
            <div @click.stop="toCollect" class="addTag">加入合集 ></div>
          </el-dropdown-item>
          <div v-if="showCollect" class="showTags">
            <div>
              <!-- <div class="k" v-for="(it, ins) in collectList" @click="postCollect(it)" :key="ins">
                      {{ it.name }}
                  </div> -->
              <!-- <el-checkbox-group @change="aaa" v-model="tags">
                    <div class="k" v-for="(it, ins) in collectList" :key="ins">
                      <el-checkbox
                        @change="changeBox($event, it)"
                        :label="it.id"
                        :value="it.name"
                        >{{ it.name }}</el-checkbox
                      >
                    </div>
                  </el-checkbox-group> -->
              <el-radio-group v-model="collectId">
                <div class="k" v-for="(it, ins) in collectList" :key="ins">
                  <el-radio
                    :label="it.id"
                    :model-value="it.name"
                    style="width: 100%"
                    >{{ it.name }}</el-radio
                  >
                </div>
              </el-radio-group>
              <div class="addrows">
                <el-input
                  type="text"
                  maxlength="20"
                  v-model="collectName"
                  placeholder="合集名称"
                ></el-input>
                <span @click="toAddCollect">新增</span>
              </div>
              <div @click="postCollect" class="add_collect">确定</div>
            </div>
            <!-- <div v-else class="add_collect" >新增合集</div> -->
          </div>
          <el-dropdown-item
            v-if="item.forum.admin && !item.isPin"
            command="置顶"
            >置顶</el-dropdown-item
          >

          <el-dropdown-item
            v-if="item.forum.admin && item.isPin"
            command="取消置顶"
            >取消置顶</el-dropdown-item
          >
          <el-dropdown-item v-if="item.canDeleted" command="trans"
            >转移版块</el-dropdown-item
          >
          <el-dropdown-item v-if="item.type === 'gif'" command="download_gif"
            >下载GIF</el-dropdown-item
          >
          <el-dropdown-item
            v-if="item.forumAdmin && item.disableComment"
            command="开启评论"
            >开启评论</el-dropdown-item
          >
          <el-dropdown-item
            v-if="item.forumAdmin && !item.disableComment"
            command="关闭评论"
            >关闭评论</el-dropdown-item
          >
          <el-dropdown-item
            v-if="
              item.type === 'prediction' &&
              item.canDeleted &&
              item.predictionStatus === 'live'
            "
            command="暂停下注"
            >暂停下注</el-dropdown-item
          >
          <el-dropdown-item v-if="item.canAddToRecommend" command="推荐"
            >推荐</el-dropdown-item
          >
          <el-dropdown-item v-if="item.canDeleted" command="删除"
            >删除帖子</el-dropdown-item
          >
          <el-dropdown-item command="关闭">
            <div ref="cocolse">关闭</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="转移板块(不能保留评论和赞)"
      :visible.sync="this.displayTrans"
      width="30%"
      :append-to-body="true"
      :before-close="cancelSet"
    >
      <div class="ycontainer">
        <div style="">
          <!--            <div>转移板块(评论暂不支持转移)</div>-->
          <div style="margin: 10px 0px; display: flex; align-items: center">
            <div style="align-content: center">新板块：</div>
            <el-autocomplete
              v-model="state"
              :fetch-suggestions="querySearchAsync"
              placeholder="搜索板块"
              @select="handleAddSelect"
            ></el-autocomplete>
          </div>
          <div style="margin: 10px 0px; display: flex">
            <el-button @click="transPostRequest" type="success">转移</el-button>
            <el-button @click="cancelSet" type="success">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </h1>
  <!--    <dialogs :visible="dialogVisible">-->
  <!--      <template slot="content">-->
  <!--        <h1>this is slot2</h1>-->
  <!--      </template>-->
  <!--    </dialogs>-->
</template>

<script>
import { More as ElIconMore } from '@element-plus/icons'
import * as api from '@/api/api'
import { Dialog } from 'vant'
import 'vant/lib/dialog/style'
// import "moment/locale/zh-cn";
import moment from 'moment'

import dialogs from '../common/dialogs.vue'
import { searchForum } from '../../../api/api'
export default {
  components: {
    dialogs,
    ElIconMore,
  },
  name: '',
  data() {
    return {
      collectId: '',
      collectName: '',
      dialogVisible: false,
      hasGetCollect: false,
      showCollect: false,
      collectList: [],
      checkList: [],
      moment: moment,
      showTag: false,
      tagList: [],
      hasGetTag: false,
      tags: [],
      displayTrans: false,
      forumToTrans: null,
      state: '',
    }
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    isindex: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    order: {
      type: String,
      default: '',
    },
  },
  created() {
    if (this.item.tags.length) {
      this.item.tags.forEach((item) => {
        this.tags.push(item.id)
      })
    }
  },
  mounted() {},
  methods: {
    toAddCollect() {
      if (this.collectName) {
        api.addCollection({ name: this.collectName }).then((res) => {
          if (res.success) {
            this.collectList.push(res.data)
            this.collectName = ''
          }
        })
      } else {
        this.$toast('请输入合集名称')
      }
    },
    postCollect(it) {
      if (this.collectId) {
        let params = {
          postId: this.item.postId,
          collectionId: this.collectId,
        }
        api.addPostCollection(params).then((res) => {
          if (res.success) {
            // document.getElementById('cocolse').click()
            this.$refs.cocolse.click()
            this.$toast('加入合集成功')
          }
        })
      } else {
        this.$toast('还没有选中合集')
      }
    },
    addCollection() {
      api.addCollection({ name: '测试合集_2' }).then((res) => {
        this.userCollectionList()
      })
    },
    toAddCol() {
      // this.dialogVisible = true;
      this.addCollection()
    },
    aaa(e) {
      console.log(e)
    },
    doStatus(it) {
      let checked = false
      this.tagList.forEach((item) => {
        if (item.id == it.id) {
          checked = true
        }
      })
      return checked
    },
    changeBox(e, it) {
      console.log(e)
      console.log(it)
      this.tags = []
      if (e) {
        this.tags.push(it.id)
        this.clickTagAdd(it)
      } else {
        api
          .removeTag({
            postId: this.item.postId,
            tagId: it.id,
          })
          .then((res) => {
            this.$refs.cocolse.click()
          })
      }
      this.$EventBus.$emit('refreshItemTag', {
        index: this.index,
        tag: it,
        type: e,
      })
    },
    clickTagAdd(it) {
      let params = {
        postId: this.item.postId,
        tagId: it.id,
      }
      api.addTag(params).then((res) => {
        if (res.success) {
          this.$refs.cocolse.click()
          this.$toast('添加标签成功')
        }
      })
    },
    toadd() {
      if (this.hasGetTag) {
        this.showTag = !this.showTag
      } else {
        this.getForumTag()
      }
    },
    toCollect() {
      if (this.item.collection) {
        this.collectId = JSON.parse(JSON.stringify(this.item)).collection.id
      }

      if (this.hasGetCollect) {
        this.showCollect = !this.showCollect
      } else {
        this.userCollectionList()
      }
    },
    userCollectionList() {
      api.userCollectionList().then((res) => {
        this.collectList = res.data
        this.hasGetCollect = true
        this.showCollect = !this.showCollect
      })
    },
    getForumTag() {
      api.getlistTag({ forumId: this.item.forum.id }).then((res) => {
        this.tagList = res.data
        this.hasGetTag = true
        this.showTag = !this.showTag
      })
    },
    handleCommand(command) {
      // this.$message('click on item ' + command);
      if (command == '置顶') {
        api.forumpin({ postId: this.item.postId }).then((res) => {
          if (res.success) {
            this.$toast('帖子置顶成功，刷新可查看')
          }
        })
      } else if (command == '取消置顶') {
        api.forumunpin({ postId: this.item.postId }).then((res) => {
          if (res.success) {
            this.$toast('帖子已取消置顶')
            this.$EventBus.$emit('unPin', this.index)
            // this.$emit('deletePost',this.index)
          } else {
            this.$toast(res.message)
          }
        })
      } else if (command == '删除') {
        this.deletePost(this.item, this.index)
      } else if (command == '关闭评论') {
        this.disableComment('close')
      } else if (command == '开启评论') {
        this.disableComment('open')
      } else if (command == '暂停下注') {
        this.pausePrediction(this.item)
      } else if (command == '推荐') {
        this.addToRecommend(this.item)
      } else if (command == 'trans') {
        this.transPost(this.item, this.index)
      } else if (command == 'download_gif') {
        window.open(
          this.imgOrigin + this.item.imageName.replace('.mp4', '.gif')
        )
      }
    },
    pausePrediction(item) {
      api.pausePrediction({ postId: this.item.postId }).then((res) => {
        if (res.success) {
          this.$toast('暂停成功')
        } else {
          this.$toast(res.errorMessage)
        }
      })
    },
    addToRecommend(item) {
      api.addToRecommend({ postId: this.item.postId }).then((res) => {
        if (res.success) {
          this.$toast('推荐成功')
        } else {
          this.$toast(res.errorMessage)
        }
      })
    },
    disableComment(v) {
      if (v == 'close') {
        api.disableComment({ postId: this.item.postId }).then((res) => {
          this.item.disableComment = true
          this.$toast('该帖已关闭评论')
          if (res.success) {
            this.$EventBus.$emit('resetItem', {
              index: this.index,
              item: this.item,
            })
          }
        })
      } else {
        api.enableComment({ postId: this.item.postId }).then((res) => {
          this.$toast('该帖已开启评论')
          this.item.disableComment = false
          if (res.success) {
            this.$EventBus.$emit('resetItem', {
              index: this.index,
              item: this.item,
            })
          }
        })
      }
    },
    toForum(item) {
      localStorage.removeItem('storedata')
      localStorage.removeItem('spage')
      this.toUrls(item, { url: '/f/' + item.forumId, routeType: 1 })
    },
    transPost(item, index) {
      // if (this.)
      this.displayTrans = true
    },

    handleAddSelect(item) {
      this.forumToTrans = item
    },

    cancelSet() {
      this.displayTrans = false
    },

    transPostRequest() {
      api
        .getByPath('/api/v0/post/transForum', {
          postId: this.item.postId,
          forumId: this.forumToTrans.forumId,
        })
        .then((res) => {
          if (res.success) {
            this.displayTrans = false
            this.$toast('转移成功')
          } else {
            this.$toast(res.errorMessage)
          }
        })
    },
    deletePost(item, index) {
      if (this.ISPHONE) {
        Dialog.confirm({
          title: '删除确认',
          message: `是否确定删除帖子 【${item.title}】？`,
          messageAlign: 'left',
        })
          .then(() => {
            api.deletePost({ postId: item.postId }).then((res) => {
              if (res.success) {
                this.$message.success('已删除')
                // this.lists.splice(index,1)
                this.$emit('deletePost', index)
              }
            })
          })
          .catch(() => {
            // on cancel
          })
      } else {
        this.$confirm(`是否确定删除帖子 【${item.title}】？`, '提示', {
          type: 'warning',
          // center: true,
          position: 'top',
        }).then(() => {
          api.deletePost({ postId: item.postId }).then((res) => {
            if (res.success) {
              this.$message.success('已删除')
              // this.lists.splice(index,1)
              this.$emit('deletePost', index)
            }
          })
        })
      }
    },
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
    postBehavior(postId, action) {
      api.postBehavior({ postId, action }).then((res) => {})
    },
    toAttention(bool, id, item) {
      if (bool) {
        api.toUnfocus({ focusId: id }).then((res) => {
          if (res.success) {
            // item.focused = !bool;
          }
        })
      } else {
        api.toFocus({ focusId: id }).then((res) => {
          if (res.success) {
            // item.focused = !bool;
          }
        })
      }
      this.$emit('doFocued', bool, id)
    },
    // 修改时间格式
    changeTimeFormat() {
      this.humanizeTimeFormat = !this.humanizeTimeFormat
    },

    querySearchAsync(queryString, cb) {
      api.searchForum({ keyword: queryString, pageNum: 1 }).then((res) => {
        console.log(res.data)

        let result = res.data.map((value) => {
          value.value = value.title
          return value
        })
        clearTimeout(this.timeout)
        console.log(result)
        this.timeout = setTimeout(() => {
          cb(result)
        }, 3000 * Math.random())
      })
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.ycontainer {
  background: #fff;
  padding-left: 20px;
  max-width: 90%;
  //height: 350px;
  //box-sizing: border-box;
  //padding: 30px;
  border-radius: 10px;
  position: relative;
  //min-height: 200px;
  //pointer-events: none;
}
h1 {
  font-size: 13px;
  color: #666;
  line-height: 20px;
  // min-height: 50px;
  font-weight: normal;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  position: relative;
  .delete {
    font-size: 12px;
    float: right;
    position: absolute;
    right: 0;
    top: 0;
    color: #999;
    &:hover {
      color: $linkcolor;
    }
  }
  span {
    padding: 0 4px;
  }
  .module_name {
    // color: $linkcolor;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    padding: 6px 0;
    font-size: 13px;
    &:hover .hovercon {
      display: block;
    }
  }
  .username_toHover {
    font-weight: bold;
    cursor: pointer;
    position: relative;
    padding: 6px 2px;
    font-size: 13px;
    &:hover .hovercon {
      display: block;
      .shu {
        text-align: left;
        color: #999;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        height: 54px;
        overflow: hidden;
        margin-bottom: 4px;
      }
    }
    .hovercon2 {
      height: 110px;
      .shu {
        margin-top: 20px;
        height: 20px;
      }
    }
  }
  .hovercon {
    font-weight: normal;
    position: absolute;
    z-index: 10;
    border: 1px solid #f1f1f1;
    width: 210px;
    height: 150px;
    padding: 12px !important;
    left: 0;
    top: 24px;
    background: #fff;
    display: none;
    box-shadow: 0 0 4px #f1f1f1;
    border-radius: 4px;
    .shu {
      color: #666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
      div {
        flex: 1;
      }
    }
    i {
      font-style: normal;
    }
    span {
      color: #666;
    }
    .imgs {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  .icon {
    width: 20px;
    height: 20px;
    vertical-align: top;
  }
}
.zhiding {
  background: #ff9300;
  color: #fff;
  font-size: 12px;
  padding: 0px 4px;
  border-radius: 4px;
  display: none;
}
.addTag {
  color: #606266;
  -moz-user-select: none; /*火狐*/

  -webkit-user-select: none; /*webkit浏览器*/

  -ms-user-select: none; /*IE10*/

  -khtml-user-select: none; /*早期浏览器*/

  user-select: none;
}
.showTags {
  padding: 10px 10px;
  background: #f7f7f7;
  line-height: 30px;
  text-align: left;
  -moz-user-select: none; /*火狐*/

  -webkit-user-select: none; /*webkit浏览器*/

  -ms-user-select: none; /*IE10*/

  -khtml-user-select: none; /*早期浏览器*/

  user-select: none;
  .k {
    padding-left: 8px;
    width: 100%;
    box-sizing: border-box;
    &:hover {
      background: #fff;
      cursor: pointer;
    }
  }
}
.el-radio-group {
  width: 100%;
}

.showCol {
  padding: 20px 10px;
  font-size: 13px;
  .k {
    width: 100%;
    &:hover {
      background: #fff;
      cursor: pointer;
      color: #ff9300;
    }
  }
}
.k {
  line-height: 40px;
}
.el-radio:last-child {
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.add_collect {
  font-size: 14px;
  color: #666;
  border-radius: 4px;
  width: 60px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background: #1890ff;
  color: #fff;
  margin: 10px auto 4px;
}
.addrows {
  display: flex;
  span {
    flex: 0 0 40px;
    text-align: center;
    font-size: 13px;
    background: #ff9300;
    color: #fff;
    line-height: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
  }
}
/deep/ .el-input__inner {
  padding: 0 4px;
  height: 30px;
}
</style>
