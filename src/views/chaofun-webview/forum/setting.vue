<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="container">
      <div class="title">设置版块 ICON</div>
      <div>
        <img
          v-if="forumInfo.imageName"
          @click="uploadImage"
          :src="imgOrigin + forumInfo.imageName"
          class="avatar"
        />
      </div>
      <div class="title">设置版块描述</div>
      <div style="max-width: 600px; margin-top: 10px">
        <el-input
          type="textarea"
          maxlength="56"
          v-model="desc"
          style="
            resize: none;
            height: 64px !important;
            overflow: hidden;
            margin-bottom: 20px;
          "
          placeholder="请设置版块介绍"
        ></el-input>
      </div>
      <div class="bottom">
        <div @click="toSave" class="btns">保存ICON和描述</div>
      </div>

      <div class="bottom">
        <div @click="toAnalytics" class="btns">版块统计</div>
      </div>

      <div class="bottom">
        <div @click="toManageTag" class="btns">版块标签</div>
      </div>

      <div class="bottom">
        <div @click="toManageRule" class="btns">版块规范</div>
      </div>

      <div class="bottom">
        <div @click="toManageUserTag" class="btns">用户标签</div>
      </div>

      <div class="bottom">
        <div @click="toNotify" class="btns">发送通知</div>
      </div>

      <div class="bottom">
        <div @click="toModManager" class="btns">管理版主</div>
      </div>

      <div class="bottom">
        <div @click="toBeContinue" class="btns">用户封禁</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as api from '@/api/api'

import ListItem from '@/components/chaofan/ListItem.vue'
import RightCom from '@/components/chaofan/RightCom'
import loadText from '@/components/chaofan/loadText'

export default {
  name: 'user',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      params: {
        forumId: '',
      },
      forumId: '',
      imageUrl: '',
      filedata: {},
      desc: '',
      forumInfo: '',
      modInfo: '',
    }
  },
  components: {
    ListItem,
    loadText,
  },
  watch: {},
  computed: {
    ...mapGetters(['roles', 'islogin']),
  },
  mounted() {
    try {
      let self = this
      window.setUploadImage = function (message) {
        self.$toast('ICON更新成功，点击保存生效')
        self.forumInfo.imageName = message
      }
    } catch {}
    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    this.toPosition()
  },
  created() {
    this.forumId = this.$route.query.forumId
    this.getForumInfo()
  },

  methods: {
    toBeContinue() {
      this.$toast('尽情期待：）')
    },
    toSave() {
      this.toSign()
    },

    toNotify() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url:
            'https://chao.fun/webview/forum/notify' +
            '?forumId=' +
            this.forumId,
          title: '发送通知',
          showHeader: true,
        })
      } catch (e) {
        window.open(
          location.origin + '/webview/forum/notify?forumId=' + this.forumId
        )
      }
    },
    toManageTag() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url:
            'https://chao.fun/webview/forum/tag' + '?forumId=' + this.forumId,
          title: '标签管理',
          showHeader: true,
        })
      } catch (e) {
        window.open(
          location.origin + '/webview/forum/tag?forumId=' + this.forumId
        )
      }
    },
    toManageUserTag() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url:
            'https://chao.fun/webview/forum/user_tag' +
            '?forumId=' +
            this.forumId,
          title: '标签管理',
          showHeader: true,
        })
      } catch (e) {
        window.open(
          location.origin + '/webview/forum/user_tag?forumId=' + this.forumId
        )
      }
    },

    toManageRule() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url:
            'https://chao.fun/webview/forum/rule' + '?forumId=' + this.forumId,
          title: '发帖规范管理',
          showHeader: true,
        })
      } catch (e) {
        window.open(
          location.origin + '/webview/forum/rule?forumId=' + this.forumId
        )
      }
    },

    toAnalytics() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url:
            'https://chao.fun/webview/forum/analytics' +
            '?forumId=' +
            this.forumId,
          title: '版块统计',
          showHeader: true,
        })
      } catch (e) {
        window.open(
          location.origin + '/webview/forum/analytics?forumId=' + this.forumId
        )
      }
    },

    toModManager() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url:
            'https://chao.fun/webview/forum/mod_manager' +
            '?forumId=' +
            this.forumId,
          title: '版主管理',
          showHeader: true,
        })
      } catch (e) {
        window.open(
          location.origin + '/webview/forum/mod_manager?forumId=' + this.forumId
        )
      }
    },

    uploadImage() {
      window.flutter_inappwebview
        .callHandler('uploadImage')
        .then(function (result) {})
    },
    getForumInfo() {
      api.getForumInfo({ forumId: this.forumId }).then((res) => {
        this.forumInfo = res.data
        this.desc = this.forumInfo.desc
      })

      api.getModInfo({ forumId: this.forumId }).then((res) => {
        this.modInfo = res.data
      })
    },

    toSign() {
      api
        .setForumDesc({ forumId: this.forumId, desc: this.desc })
        .then((res) => {
          api
            .setForumIcon({
              forumId: this.forumId,
              imageName: this.forumInfo.imageName,
            })
            .then((res) => {
              this.$toast('保存成功')
            })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  margin-bottom: 30px;
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
}
/deep/ .el-upload {
  border: 1px dashed #999;
  border-radius: 10px;
}
.container {
  padding: 20px;
  padding-bottom: 100px;
  background: #fff;
  .title {
    font-size: 16px;
    margin-bottom: 8px;
    margin-top: 14px;
  }
  .tips {
    font-size: 14px;
    color: #666;
    margin-bottom: 2px;
  }
}
.bottom {
  left: 0;
  right: 0;
  padding: 4px 10px 10px;
  .btns {
    width: 80%;
    margin: 0 auto;
    line-height: 44px;
    background: #ff9300;
    color: #fff;
    border-radius: 30px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
