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
        <div class="main_center">
          <div style="font-weight: bold; font-size: 28px">
            做国内最好的内容社区
          </div>
          <ul class="tabs">
            <li
              class="li-tab"
              v-for="(item, index) in tabsParam"
              @click="toggleTabs(index)"
              :class="{ active: index == nowIndex }"
            >
              {{ item }}
            </li>
          </ul>
          <div style="display: flex" v-show="nowIndex === 0">
            <div style="width: 500px">
              <div>
                <div style="margin-top: 20px">
                  <div style="font-weight: bold">统计信息</div>
                  <div>秘密花园队列: {{ this.websiteInfo.secretDelay }}</div>
                  <div>
                    24小时注册用户数: {{ this.websiteInfo.past24HRegisters }}
                  </div>
                  <div>24小时帖子数: {{ this.websiteInfo.past24HPosts }}</div>
                  <div>
                    24小时评论数: {{ this.websiteInfo.past24HComments }}
                  </div>
                  <div>
                    24小时登录点赞数:
                    {{ this.websiteInfo.past24HLoginVoteCount }}
                  </div>
                  <div>
                    24小时原创帖子数: {{ this.websiteInfo.past24HOriginPosts }}
                  </div>
                  <div>总注册用户: {{ this.websiteInfo.totalRegisters }}</div>
                  <div>百度收录数: {{ this.websiteInfo.baiduIncluded }}</div>
                </div>
              </div>
              <div style="font-weight: bold; margin-top: 20px">版主激励</div>
              <div style="max-width: 600px; margin-top: 10px">
                <el-input
                  type="textarea"
                  maxlength="56"
                  v-model="params.title"
                  style="resize: none; overflow: hidden"
                  placeholder="请设置推送标题"
                ></el-input>
              </div>
            </div>

            <div style="margin-left: 30px; max-width: 500px">
              <div style="font-size: 20px">评论列表</div>
              <div v-for="(item, index) in comments" :key="index">
                <pre>评论:<a :href="'/p/' + item.postId">{{item.text.replace('\n','')}}</a>     用户: <a :href="'/user/' + item.userInfo.userId">{{item.userInfo.userName}}</a></pre>
              </div>
            </div>
          </div>

          <div style="display: flex" v-show="nowIndex === 1">
            <div style="width: 500px">
              <div>设置推送内容</div>
              <div>
                <div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      maxlength="56"
                      v-model="params.title"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置推送标题"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      maxlength="56"
                      v-model="params.body"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置推送内容"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      maxlength="56"
                      v-model="params.url"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置推送链接"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="input"
                      maxlength="56"
                      v-model="params.platform"
                      style="resize: none; overflow: hidden"
                      placeholder="填写 'ios'、'android'、或 'all' (不用引号)"
                    ></el-input>
                  </div>
                  <el-button @click="push" block>推送消息</el-button>
                </div>
              </div>

              <div>设置 iOS 版本信息</div>
              <div>
                <div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="input"
                      maxlength="56"
                      v-model="iosVersion.version"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置iOS版本"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      v-model="iosVersion.content"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置iOS版本升级内容"
                    ></el-input>
                  </div>
                  <el-button @click="updateiOSVersion" block>更新</el-button>
                </div>
              </div>

              <div>设置 Android 版本信息</div>
              <div>
                <div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="input"
                      maxlength="56"
                      v-model="androidVersion.version"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置Android版本"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      v-model="androidVersion.content"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置Android版本升级内容"
                    ></el-input>
                  </div>
                  <el-button @click="updateAndroidVersion" block
                    >更新</el-button
                  >
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex" v-show="nowIndex === 2">
            <div style="width: 500px">
              <div style="margin-top: 20px">
                <div style="font-weight: bold">设置活动</div>
                <div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      maxlength="56"
                      v-model="activity.title"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置活动标题"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      maxlength="1000"
                      v-model="activity.url"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置活动链接（必填）"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      maxlength="56"
                      v-model="activity.imageName"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置活动图片"
                    ></el-input>
                  </div>
                  <div style="max-width: 600px; margin-top: 10px">
                    <el-input
                      type="textarea"
                      maxlength="56"
                      v-model="activity.status"
                      style="resize: none; overflow: hidden"
                      placeholder="请设置活动状态，如果为文字活动则是 'word', 如果是图片活动则是 'image' "
                    ></el-input>
                  </div>
                  <el-button @click="save_active" block>保存活动</el-button>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; width: 100%" v-show="nowIndex === 3">
            <div v-for="(item, lists) in notifyList" :key="index" class="item">
              <div>
                <div>标题: {{ item.title }}</div>
                <div>内容: {{ item.content }}</div>
                <div>链接: {{ item.link }}</div>
                <div>版块id: {{ item.forumId }}</div>
                <div>定时发送:</div>
              </div>
              <div style="justify-content: space-between">
                <el-button
                  @click="approveNotify(item.id)"
                  style="margin-top: 10px"
                  >通过</el-button
                >
                <el-button
                  @click="refuseNotify(item.id)"
                  style="margin-top: 10px"
                  >拒绝</el-button
                >
              </div>
            </div>
          </div>
          <div style="display: flex" v-show="nowIndex === 4">
            <div v-for="(item, lists) in applyList" :key="index" class="item">
              <div v-if="item.type == 'apply_mod'">
                <div>
                  用户 {{ item.userId }} 申请版块 {{ item.forumId }} 版主
                </div>
                <div>原因为 {{ item.arg1 }}</div>
              </div>
              <div v-if="item.type == 'apply_forum'">
                <div>用户 {{ item.userId }} 申请创建版块 {{ item.arg1 }}</div>
                <div>原因为 {{ item.arg2 }}</div>
              </div>
              <div style="justify-content: space-between">
                <el-button
                  @click="approveApply(item.id)"
                  style="margin-top: 10px"
                  >通过</el-button
                >
                <el-button
                  @click="refuseApply(item.id)"
                  style="margin-top: 10px"
                  >拒绝</el-button
                >
              </div>
            </div>
          </div>
          <div style="display: flex" v-show="nowIndex === 5">
            <iframe
              style="width: 100%; height: 500px"
              src="https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=42d951bd-d813-44f0-9984-71ae3d89f0f4&accessToken=a1a2cff6ee74dd1ebf0c45b694778389"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import { Dialog } from 'vant'

export default {
  data() {
    return {
      websiteInfo: '1',
      tabsParam: [
        '基础设置',
        'App设置',
        '活动设置',
        '通知审批',
        '版块申请',
        '统计信息',
      ], //（这个也可以用对象key，value来实现）
      notifyList: [],
      nowIndex: 0, //默认第一个tab为激活状态
      comments: [],
      applyList: [],
      params: {
        title: '',
        body: '',
        platform: '',
        url: '',
      },
      activity: {
        title: '',
        url: '',
        status: '',
        imageName: '',
      },

      iosVersion: {
        version: '',
        content: '',
        force: false,
        action: 'check',
        platform: 'ios',
      },

      forumAdminMoney: 0.0,
      androidVersion: {
        version: '',
        content: '',
        force: false,
        action: 'check',
        platform: 'android',
      },
    }
  },
  mounted() {
    api.getWebsiteInfo({}).then((res) => {
      this.websiteInfo = res.data
    })

    api.listAllComments({ pageSize: 40, pageNum: 1 }).then((res) => {
      this.comments = res.data
    })

    api.getActivity({}).then((res) => {
      if (res.success && res.data != null) {
        this.activity = res.data
      }
    })

    api.getVersion({ platform: 'ios' }).then((res) => {
      if (res.success && res.data != null) {
        this.iosVersion = res.data
      }
    })

    api.getVersion({ platform: 'android' }).then((res) => {
      if (res.success && res.data != null) {
        this.androidVersion = res.data
      }
    })

    api.listAllNotify({ status: 0 }).then((res) => {
      if (res.success && res.data != null) {
        this.notifyList = res.data
      }
    })

    api.listAllApply({ status: 0 }).then((res) => {
      if (res.success && res.data != null) {
        this.applyList = res.data
      }
    })
  },

  methods: {
    approveApply(applyId) {
      Dialog.confirm({
        title: '通过申请',
        messageAlign: 'left',
      })
        .then(() => {
          api.approveApply({ applyId: applyId }).then()((res) => {
            if (res.success) {
              location.reload()
            } else {
              this.$toast(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    refuseApply(applyId) {
      Dialog.confirm({
        title: '确认拒绝',
        messageAlign: 'left',
      })
        .then(() => {
          api.refuseApply({ applyId: applyId }).then()((res) => {
            if (res.success) {
              location.reload()
            } else {
              this.$toast(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },

    approveNotify(notifyId) {
      Dialog.confirm({
        title: '确认通知',
        messageAlign: 'left',
      })
        .then(() => {
          api.approveNotify({ notifyId: notifyId }).then()((res) => {
            if (res.success) {
              location.reload()
            } else {
              this.$toast(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    refuseNotify(notifyId) {
      Dialog.confirm({
        title: '确认拒绝',
        messageAlign: 'left',
      })
        .then(() => {
          api.refuseNotify({ notifyId: notifyId }).then()((res) => {
            if (res.success) {
              location.reload()
            } else {
              this.$toast(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    toggleTabs: function (index) {
      this.nowIndex = index
    },
    push() {
      Dialog.confirm({
        title: '确认推送',
        message: `是否确定推送 \n标题: ${this.params.title}\n内容: ${this.params.body}\n 平台：${this.params.platform} `,
        messageAlign: 'left',
      })
        .then(() => {
          api.push(this.params).then()((res) => {
            if (res.success) {
              location.reload()
            } else {
              this.$toast(res.errorMessage)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },

    updateiOSVersion() {
      api.setVersion(this.iosVersion).then()((res) => {})
    },

    updateAndroidVersion() {
      api.setVersion(this.androidVersion).then()((res) => {})
    },
    save_active() {
      api.save_activity(this.activity).then()((res) => {
        if (res.success) {
          location.reload()
        } else {
          this.$toast(res.errorMessage)
        }
      })
    },
  },
}
</script>

<style scoped>
.active {
  background: yellow;
}
.tabs {
  width: 600px;
  height: 40px;
}
.li-tab {
  padding: 10px;
  width: 100px;
  height: 100%;
  display: inline-block;
  text-align: center;
  font-size: 20px;
}
.divTab {
  width: 200px;
  height: 300px;
}
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
  overflow: hidden;
}
</style>
