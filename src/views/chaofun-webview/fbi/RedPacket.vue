<template>
  <div>
    <div style="position: fixed; top: 0; right: 0; text-align: right">
      <div>
        <el-button @click="create"> 创建口令红包</el-button>
      </div>
      <div>
        <el-button style="right: 0" @click="history"> 红包历史</el-button>
      </div>
    </div>

    <div style="align-items: center; text-align: center">
      <div style="padding-top: 100px; font-size: 20px">
        输入口令领取 FBi 红包
      </div>
      <div style="margin-top: 10px">
        <el-input
          v-model="password"
          :maxlength="20"
          style="width: 200px"
        ></el-input>
      </div>
      <div style="margin-top: 10px">
        <el-button @click="inputEnter">确定</el-button>
      </div>
    </div>

    <!-- dialog -->
    <el-dialog
      v-if="showDialog"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="showDialog"
      center
      custom-class="el-dialog-custom"
      top="10px"
      width="300px"
      @close="dialogClosed"
    >
      <!-- title -->
      <div slot="title" style="font-size: 20px; color: #fff">FBi 红包</div>

      <!-- body -->
      <div style="width: 300px; height: 500px; background: #808080">
        <div style="width: 300px; height: 100px; position: absolute; top: 60px">
          <transition name="el-zoom-in-bottom">
            <div
              v-show="redPacket.isOpened"
              class="transition-box"
              style="
                width: 300px;
                height: 100px;
                background: #b64340;
                border-radius: 50% / 100% 100% 0 0;
              "
            />
          </transition>
        </div>

        <!-- 用户信息 -->
        <div
          style="
            width: 300px;
            height: 400px;
            background: #be4645;
            border-radius: 0px 0px 10px 10px;
            margin: 0px;
            position: absolute;
            top: 160px;
          "
        >
          <div
            style="
              width: 300px;
              height: 100px;
              background: #b64340;
              border-radius: 50% / 0 0 100% 100%;
            "
          />
          <div
            style="width: 300px; height: 150px; position: relative; top: 0px"
          >
            <div
              style="
                width: 40px;
                height: 40px;
                border-radius: 60px;
                margin: 20px auto 10px auto;
                background: #fff;
              "
            >
              <img
                :src="
                  imgOrigin +
                  redPacket.sendUser.icon +
                  '?x-oss-process=image/resize,h_40/format,webp/quality,q_75'
                "
                alt=""
                style="width: 40px; height: 40px; border-radius: 60px"
              />
            </div>
            <div
              style="font-size: 20px; color: #fce5b9; cursor: pointer"
              @click.stop="toUser(redPacket.sendUser.userId)"
            >
              {{ redPacket.sendUser.userName }}
            </div>
            <div
              style="
                font-size: 30px;
                color: #fff;
                margin-top: 30px;
                margin-left: 10px;
                margin-right: 10px;
              "
            >
              {{ redPacket.blessing }}
            </div>
          </div>
        </div>

        <!-- 标记本人红包 -->
        <div
          v-if="redPacket.isOwner"
          style="
            width: 20px;
            height: 20px;
            background: #cba345;
            color: #fff;
            font-size: 14px;
            border-radius: 5px;
            align-items: center;
            text-align: center;
            position: absolute;
            top: 162px;
            right: 2px;
          "
        >
          我
        </div>

        <!-- 动态信息 -->
        <div
          v-if="redPacket.isOpened"
          style="
            width: 300px;
            font-weight: bold;
            font-size: 40px;
            color: #fce5b9;
            position: absolute;
            top: 150px;
          "
        >
          {{ redPacket.got }} Fbi
        </div>
        <div
          v-else-if="redPacket.isEnd"
          style="
            width: 300px;
            font-weight: lighter;
            font-size: 28px;
            color: #fce5b9;
            position: absolute;
            top: 180px;
          "
        >
          来晚一步，领完啦~
        </div>
        <div
          v-else
          style="width: 300px; height: 80px; position: absolute; top: 180px"
        >
          <div
            style="
              width: 80px;
              height: 80px;
              background: #e6cea0;
              border-radius: 300px;
              position: relative;
              left: 110px;
              font-size: 58px;
              cursor: pointer;
            "
            @click.stop="openRedPacket"
          >
            開
          </div>
        </div>

        <!-- 领取详情 -->
        <div
          v-if="0 != redPacket.userTotal"
          style="width: 300px; height: 20px; position: absolute; top: 520px"
        >
          <div style="width: 300px; height: 20px; font-size: 16px; color: #fff">
            已领取 {{ redPacket.userGot }} / {{ redPacket.userTotal }} 个，共
            {{ redPacket.fbiTotal - redPacket.fbiRemain }} /
            {{ redPacket.fbiTotal }} FBi
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/api'

export default {
  name: 'RedPacket',
  components: {},

  data() {
    return {
      password: '',
      redPacket: null,
      showDialog: false,
    }
  },
  created() {},
  mounted() {
    if (!this.$store.state.user.islogin) {
      this.showLogin()
      return
    }

    let passwd = this.$route.query.password
    if (!passwd) {
      return
    }
    if (passwd.length > 20) {
      passwd = passwd.substr(0, 20)
    }
    this.password = passwd
    if (this.password) {
      this.getRedPacket()
    }
  },

  methods: {
    reinitData() {
      this.showDialog = false
      this.redPacket = null
    },

    dialogClosed() {
      this.reinitData()
    },

    toUser(userId) {
      if (userId) {
        try {
          window.flutter_inappwebview.callHandler('toAppUser', {
            userId: userId + '',
          })
        } catch (e) {
          window.open(location.origin + '/user/' + userId, '_blank')
        }
      }
    },

    getRedPacket() {
      api
        .getByPath('/api/v0/red_packet/get', {
          password: this.password,
          type: 'password',
        })
        .then((res) => {
          // this.handleRedPacketData(res);
          if (res.success && res.data != null) {
            this.redPacket = res.data

            // 兼容祝福语长度
            if (
              this.redPacket.blessing &&
              this.redPacket.blessing.length > 14
            ) {
              this.redPacket.blessing = this.redPacket.blessing.substr(0, 14)
            }

            //
            this.showDialog = true
          } else {
            this.reinitData()

            if (res.errorMessage) {
              this.$toast(res.errorMessage)
            } else {
              this.$toast('没有这个红包')
            }
          }
        })
    },

    openRedPacket() {
      api
        .getByPath('/api/v0/red_packet/open', {
          password: this.password,
          type: 'password',
        })
        .then((res) => {
          // this.handleRedPacketData(res);
          if (res.success && res.data != null) {
            this.redPacket = res.data

            // 兼容祝福语长度
            if (
              this.redPacket.blessing &&
              this.redPacket.blessing.length > 14
            ) {
              this.redPacket.blessing = this.redPacket.blessing.substr(0, 14)
            }

            //
            this.showDialog = true
          } else {
            // 先这样处理
            this.getRedPacket()
          }
        })
    },

    handleRedPacketData(res) {},

    inputEnter() {
      if (!this.$store.state.user.islogin) {
        this.showLogin()
        return
      }
      this.getRedPacket()
    },

    history() {
      this.$toast('暂不支持')
    },

    create() {
      window.open('/webview/fbi/redPacket/create', '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog-custom {
  box-shadow: unset;
  border: none;

  .el-dialog__header {
    background: #808080;
    height: 60px;

    .el-dialog__close {
      color: #aaa;
      font-size: 28px;
    }
  }

  .el-dialog__body {
    padding: 0px;
    align-items: center;
    text-align: center;
  }
}
</style>
