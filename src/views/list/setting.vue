<template>
  <div
    id="container"
    class="dashboard-container container infinite-list"
    ref="container"
    :style="{ height: scrollHeight + 'px' }"
  >
    <div>
      <div style="height: 50px"></div>
      <div>
        <div class="main_content">
          <div class="main_center">
            <div class="title">设置头像</div>
            <div>
              <el-upload
                class="avatar-uploader"
                action="/api/upload_image"
                name="file"
                :data="filedata"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon class="avatar-uploader-icon"><el-icon-plus /></el-icon>
              </el-upload>
            </div>

            <div class="title">设置个性签名</div>
            <div style="max-width: 600px; margin-top: 0px; margin-bottom: 10px">
              <el-input
                type="textarea"
                @blur="toSign"
                maxlength="200"
                v-model="desc"
                style="resize: none; overflow: hidden"
                placeholder="个性签名，展示优秀的自我~"
              ></el-input>
            </div>
            <div class="title">修改用户名</div>
            <div>
              <el-input
                style="width: 210px"
                maxlength="20"
                v-model="userInfo.userName"
              ></el-input>
              <el-button
                style="margin-left: 10px"
                :type="userInfo.phone ? 'primary' : 'info'"
                :icon="ElIconEdit"
                @click="handleUserName"
                :disabled="userInfo.phone ? false : true"
                size="small"
              >
                确定修改
              </el-button>
              <div
                v-if="!userInfo.phone"
                style="display: inline-block; padding-left: 10px"
              >
                <span style="color: red">未绑定手机号？</span>
                <span
                  @click="toBindPhone"
                  style="
                    color: #409eff;
                    text-decoration: underline;
                    cursor: pointer;
                  "
                  >去绑定</span
                >
              </div>
            </div>
            <div class="title" style="display: flex">
              本地设置
              <div class="checkboxTooltip">
                <el-tooltip placement="right">
                  <div slot="content">
                    该设置仅保存在本地浏览器，<br />更换设备或浏览器需重新设置该项。
                  </div>
                  <el-icon style="font-size: 20px; color: #1890ff"
                    ><el-icon-question
                  /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div class="localSetting" style="display: flex">
              <div>
                <el-checkbox
                  v-model="isStoragePostOwnerCommentHighlight"
                  @change="storagePostOwnerCommentHighlightCheckboxChange"
                  >保持 “高亮楼主评论” 的状态
                </el-checkbox>
              </div>
              <div class="checkboxTooltip">
                <el-tooltip placement="right">
                  <div slot="content">
                    未选中时：<br />不同帖子的 “高亮楼主评论”
                    的状态是独立的，<br />即每次打开帖子默认为不选中
                    “高亮楼主评论”<br /><br />
                    选中时：<br />不同帖子将同步“高亮楼主评论”的状态<br />即：本帖子设置为选中，下次打开其它帖子也为选中
                  </div>
                  <el-icon style="font-size: 20px; color: #1890ff"
                    ><el-icon-question
                  /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div
              class="localSetting"
              style="display: flex; align-items: center"
            >
              <span>帖子评论排序方式：</span>
              <el-radio-group
                v-model="commentOrderType"
                @change="commentOrderTypeChange"
                size="small"
              >
                <el-radio-button label="hot">热评</el-radio-button>
                <el-radio-button label="new">新评</el-radio-button>
                <el-radio-button label="old">时间</el-radio-button>
              </el-radio-group>
              <!--              <el-switch style="display: block" v-model="commentOrderType" active-color="#13ce66" inactive-color="#1890ff" active-text="新评" inactive-text="热评"-->
              <!--              @change="commentOrderTypeChange"></el-switch>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="logStatus" class="ycovers">
      <div class="ycontainer">
        <img
          @click="logStatus = false"
          class="cancel"
          src="../../assets/images/icon/cancel1.png"
        />
        <h1>{{ title }}</h1>
        <div style="">
          <input
            type="text"
            :disabled="type == 'edit' ? true : false"
            v-model="params.phone"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            maxlength="11"
            placeholder="手机号"
          />
          <div class="code_con">
            <input class="code" v-model="params.code" type="text" />
            <span @click="toSendCode">{{
              time ? time + 's' : '发送验证码'
            }}</span>
          </div>
        </div>
        <div class="remPassword"></div>
        <div :class="['ylogin', { disabled: sss }]" @click="toBind(1)">
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Plus as ElIconPlus,
  Question as ElIconQuestion,
  Edit as ElIconEdit,
} from '@element-plus/icons'
import { mapGetters } from 'vuex'
import * as api from '../../api/api'

import ListItem from '../../components/chaofan/ListItem.vue'
import RightCom from '@/components/chaofan/RightCom'
import loadText from '@/components/chaofan/loadText'

export default {
  data() {
    return {
      commentOrderType: 'hot',
      isStoragePostOwnerCommentHighlight: false,
      type: '',
      title: '',
      time: '',
      timer: null,
      params: {
        phone: '',
        code: '',
      },
      logStatus: false,
      imageUrl: '',
      filedata: {},
      desc: '',
      userInfo: {},
      ElIconEdit,
    }
  },
  components: {
    ListItem,
    loadText,
    ElIconPlus,
    ElIconQuestion,
  },
  name: 'user',
  watch: {},
  computed: {
    ...mapGetters(['roles', 'islogin']),
    sss() {
      // if((/^1[3456789]\d{9}$/.test(this.params.phone))){

      // }
      if (this.params.phone && this.params.code) {
        return false
      } else {
        return true
      }
    },
  },
  mounted() {
    this.isStoragePostOwnerCommentHighlight =
      'true' ==
      localStorage.getItem(
        'chao.fun.localSetting.isStoragePostOwnerCommentHighlight'
      )
    localStorage.setItem(
      'chao.fun.localSetting.isStoragePostOwnerCommentHighlight',
      this.isStoragePostOwnerCommentHighlight
    )

    this.commentOrderType =
      'new' == localStorage.getItem('chao.fun.localSetting.commentOrderType')
        ? 'new'
        : 'old' ==
          localStorage.getItem('chao.fun.localSetting.commentOrderType')
        ? 'old'
        : 'hot'
    localStorage.setItem(
      'chao.fun.localSetting.commentOrderType',
      this.commentOrderType
    )

    if (document.body.clientWidth < 700) {
      this.isPhone = true
    }
    this.toPosition()
  },
  created() {
    console.log('a', this.$store.state.user.userInfo)
    this.userInfo = this.$store.state.user.userInfo
    this.desc = this.$store.state.user.userInfo.desc
    this.imageUrl = this.imgOrigin + this.$store.state.user.userInfo.icon
    // this.filedata.fileName = this.$store.state.user.userInfo.icon;
    // this.filedata.name = this.$store.state.user.userInfo.icon;
    // this.filedata.url = this.imgOrigin+this.$store.state.user.userInfo.icon;
  },
  methods: {
    commentOrderTypeChange(val) {
      localStorage.setItem('chao.fun.localSetting.commentOrderType', val)
      this.$toast('设置成功！')
    },

    storagePostOwnerCommentHighlightCheckboxChange(val) {
      localStorage.setItem(
        'chao.fun.localSetting.isStoragePostOwnerCommentHighlight',
        val
      )
      this.$toast('设置成功！')
    },

    toSendCode() {
      if (!this.time) {
        if (!/^1[3456789]\d{9}$/.test(this.params.phone)) {
          this.$toast('手机号码有误，请重填')
          return false
        } else {
          api.getCode({ phone: this.params.phone }).then((res) => {
            if (res.success) {
              this.time = 60
              this.timer = setInterval(() => {
                if (this.time > 1) {
                  this.time -= 1
                } else {
                  this.time = 0
                  clearInterval(this.timer)
                  this.timer = null
                }
              }, 1000)
            }
          })
        }
      }
    },
    toBind() {
      if (!this.sss) {
        api.setPhone(this.params).then((res) => {
          if (res.success) {
            this.$toast('绑定成功')
            this.logStatus = false
            this.userInfo.phone = this.params.phone
          }
        })
      }
    },
    toBindPhone() {
      // this.params.phone = this.userInfo.phone.splice(3,7,'xxxx');
      this.title = ''
      this.type = 'bind'
      this.logStatus = true
    },
    handleUserName() {
      console.log('123')
      // this.title = '验证手机号';
      // this.type = 'edit';
      // this.params.phone = (this.userInfo.phone.slice(0,3)+'****'+this.userInfo.phone.slice(7));
      // this.logStatus = true;
      if (this.userInfo.userName && this.userInfo.phone) {
        api.changeUserName({ userName: this.userInfo.userName }).then((res) => {
          if (res.success) {
            this.$toast('用户名修改成功')
            this.$store.dispatch('user/SET_userInfo', this.userInfo)
          }
        })
      }
    },
    toSign() {
      api.setDesc({ desc: this.desc }).then((res) => {
        if (res.success) {
          this.$toast('设置签名成功')
        }
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(this.filedata)
      console.log(res)
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw)
        api.setIcon({ imageName: res.data }).then((res) => {})
      } else if (res.errorCode == 'invalid_content') {
        // this.imageUrl = ''
        this.$toast(res.errorMessage)
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
        return false
      }
      this.filedata.fileName = file.name
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1079px) {
  .main_content {
    width: 800px;
  }
}

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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/deep/ .el-upload {
  border: 1px dashed #999;
  border-radius: 10px;
}

.container {
  padding: 40px;
  background: #fff;

  .title {
    font-size: 18px;
    margin-bottom: 4px;
    margin-top: 20px;
  }
}

.ycovers {
  position: fixed;
  z-index: 2012;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;

  .ycontainer {
    background: #fff;
    width: 320px;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;

    .cancel {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      z-index: 10;
    }

    h1 {
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      color: #e23d0e;
      margin-bottom: 10px;
    }

    input {
      height: 34px;
      outline: none;
      border: 1px solid #ededed;
      background: #fff;
      font-size: 14px;
      margin-top: 10px;
      width: 100%;
      padding-left: 10px;
    }

    .remPassword {
      line-height: 30px;
      margin-top: 14px;
      font-size: 12px;

      input[type='checkbox'] {
        width: 14px;
        height: 14px;
        margin-right: 6px;
        // vertical-align: baseline;
      }
    }

    .code_con {
      display: flex;
      justify-content: space-between;

      input {
        width: 150px;
      }

      span {
        line-height: 34px;
        margin-top: 10px;
        text-align: center;
        flex: 0 0 100px;
        border: 1px solid #ddd;
        cursor: pointer;
      }
    }

    .ylogin {
      background: #e23d0e;
      color: #fff;
      text-align: center;
      line-height: 40px;
      border-radius: 2px;
      margin-top: 44px;
      margin-bottom: 24px;
      cursor: pointer;
    }

    .disabled {
      background: #ddd !important;
    }

    p {
      font-size: 12px;
      text-align: center;

      span {
        color: #e23d0e;
        cursor: pointer;
      }
    }
  }
}

.checkboxTooltip {
  margin-left: 10px;

  img {
    width: 20px;
    height: 20px;
  }
}

/deep/ .el-checkbox {
  .el-checkbox__input {
    z-index: 0;
  }

  .el-checkbox__label {
    margin-left: -5px;
    font-size: 14px;
  }
}

.localSetting {
  margin: 10px 10px;
  display: flex;
}
</style>
