<template>
  <div style="align-items: center; text-align: center">
    <div v-if="!result" style="padding-top: 100px">
      <div>请输入 FBi 红包总额</div>
      <el-input-number v-model="fbiTotal" :step="5" :min="5"> </el-input-number>

      <div style="padding-top: 20px">请输入 FBi 红包个数</div>
      <el-input-number v-model="userTotal" :step="1" :min="1">
      </el-input-number>

      <div style="padding-top: 20px">请输入寄语</div>
      <div>
        <el-input
          v-model="blessing"
          placeholder="可选"
          :maxlength="14"
          style="width: 240px"
        />
      </div>
      <div style="margin-top: 10px">
        <el-button @click="create"> 确认 </el-button>
      </div>
    </div>
    <div v-if="result" style="padding-top: 100px">
      {{ this.password }}
      <div style="margin-top: 20px">
        <el-button @click="pastePasswordAndUrl"> 复制口令和链接 </el-button>
      </div>

      <div style="margin-top: 20px">
        <el-button @click="pastePassword"> 复制口令 </el-button>
      </div>

      <div style="margin-top: 20px">
        <el-button @click="close"> 关闭页面 </el-button>
      </div>

      <div style="margin-top: 20px">
        <el-button @click="reloadPage"> 再发一个 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import { getUserInfo } from '../../../api/api'
import { Dialog } from 'vant'
export default {
  name: 'RedPacket',
  data() {
    return {
      fbiTotal: 0,
      userTotal: 0,
      blessing: '',
      creating: false,
      result: false,
      password: '',
    }
  },
  created() {},
  mounted() {},

  methods: {
    create() {
      if (this.creating) {
        this.$toast('红包创建中，请勿重复点击')
      } else {
        this.creating = true
        Dialog.confirm({
          title: '确认创建口令红包吗',
          // message: `暂时不支持 FBi 红包退回机制`,
          messageAlign: 'left',
        })
          .then(() => {
            api
              .getByPath('/api/v0/red_packet/create', {
                type: 'password',
                fbiTotal: this.fbiTotal,
                userTotal: this.userTotal,
                blessing: this.blessing,
              })
              .then((res) => {
                this.creating = false
                if (res.success) {
                  this.fbiTotal = 0
                  this.userTotal = 0
                  this.blessing = null
                  if (res.data.password) {
                    this.password = res.data.password
                    this.result = true
                  }
                } else {
                  this.$message.error(res.errorMessage)
                }
              })
          })
          .catch(() => {
            this.creating = false
            // on cancel
          })
      }
    },

    close() {
      window.opener = null
      window.open('about:blank', '_top').close()
    },

    pastePassword() {
      this.copy(this.password)
    },
    pastePasswordAndUrl() {
      let str =
        '炒饭红包口令：' +
        this.password +
        '    ' +
        '红包链接：https://chao.fun/webview/fbi/redPacket?password=' +
        this.password
      this.copy(str)
    },

    copy(content) {
      var input = document.createElement('input')
      input.setAttribute('value', content)
      document.body.appendChild(input)
      input.select()
      var result = document.execCommand('copy')
      document.body.removeChild(input)
      this.$toast('复制成功')
      return result
    },
    reloadPage() {
      this.$router.go(0)
    },
  },
}
</script>

<style scoped></style>
