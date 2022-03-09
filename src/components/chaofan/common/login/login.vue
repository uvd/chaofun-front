<template>
  <div v-if="show" class="cover">
    <div @keyup="enters" v-if="logStatus == 'login'" class="ycovers">
      <div class="ycontainer">
        <img @click="cancelLogin" class="cancel" :src="cancelImg" />
        <div class="tnames">
          <div
            @click="checkoutLoginType('account')"
            :class="['tts', { tts_act: loginType == 'account' }]"
          >
            账号登录
          </div>
          <div
            @click="checkoutLoginType('phone')"
            :class="['tts', { tts_act: loginType == 'phone' }]"
          >
            短信登录
          </div>
          <div
            v-if="!ISPHONE"
            @click="checkoutLoginType('scan')"
            :class="['tts', { tts_act: loginType == 'scan' }]"
          >
            <img
              class="codes"
              :src="imgOrigin + 'biz/7303906d6ddbb39a3616ac81f9d9a46c.png'"
              alt=""
            />
            微信扫码
          </div>
        </div>
        <div v-if="loginType == 'account'" style="">
          <input
            type="text"
            v-model="params.userName"
            placeholder="用户名 / 手机号"
          />
          <input type="password" v-model="params.password" placeholder="密码" />
        </div>
        <div v-if="loginType == 'phone'" style="">
          <input type="text" v-model="params.phone" placeholder="手机号" />
          <div class="code_con">
            <input
              placeholder="验证码"
              maxlength="6"
              class="code"
              v-model="params.code"
              type="text"
            />
            <span @click="sendCode">{{
              time ? time + 's' : '发送验证码'
            }}</span>
          </div>
        </div>
        <div v-if="loginType == 'scan'" style="">
          <iframe
            class=""
            src="https://open.weixin.qq.com/connect/qrconnect?appid=wx758a87aa8b4a7eb0&redirect_uri=https%3A%2F%2Fchao.fun&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect"
            frameborder="0"
          ></iframe>
        </div>

        <div class="remPassword">
          <!-- <input  type="checkbox"/> -->
          <!-- <el-checkbox style="font-size:12px;" v-model="ifRemember">记住密码</el-checkbox> -->
        </div>
        <div v-if="loginType != 'scan'">
          <div class="ylogin" @click="logOrReg(1)">登录</div>
          <p>还未注册？ <span @click="toWhat('register')">去注册</span></p>
        </div>
      </div>
    </div>
    <div @keyup="enters" v-if="logStatus == 'register'" class="ycovers">
      <div class="ycontainer">
        <img @click="cancelLogin" class="cancel" :src="cancelImg" />
        <!-- <h1>快速注册</h1> -->
        <div class="tnames">
          <div class="tts_act">{{ isWxscan ? '绑定微信-' : '' }} 快速注册</div>
        </div>
        <div>
          <input type="text" v-model="params.userName" placeholder="用户名" />
          <!-- <input type="password" v-model="params.repassword"  placeholder="密码"/> -->
          <input type="password" v-model="params.password" placeholder="密码" />
        </div>
        <div class="phonever">
          <div class="title">手机号验证</div>
          <input type="text" v-model="params.phone" placeholder="手机号" />
          <div class="code_con">
            <input
              placeholder="验证码"
              maxlength="6"
              class="code"
              v-model="params.code"
              type="text"
            />
            <span @click="sendCode">{{
              time ? time + 's' : '发送验证码'
            }}</span>
          </div>
        </div>
        <div @click="logOrReg(2)" class="ylogin">注册</div>
        <p v-if="!isWxscan">
          已有账号？ <span @click="toWhat('login')">去登录</span>
        </p>
        <p v-if="isWxscan">
          已有账号？ <span @click="toWhat('bind')">去绑定</span>
        </p>
      </div>
    </div>

    <div @keyup="enters" v-if="logStatus == 'bind'" class="ycovers">
      <div class="ycontainer">
        <img @click="cancelLogin" class="cancel" :src="cancelImg" />
        <!-- <h1>快速注册</h1> -->
        <div class="tnames">
          <div class="tts_act">绑定已有的炒饭账号(无账号请先注册)</div>
        </div>
        <div>
          <input type="text" v-model="params.userName" placeholder="用户名" />
          <!-- <input type="password" v-model="params.repassword"  placeholder="密码"/> -->
          <input type="password" v-model="params.password" placeholder="密码" />
        </div>

        <div @click="logOrReg(3)" class="ylogin">确定</div>
        <p>还未注册？ <span @click="toWhat('register')">去注册</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import * as api from '@/api/api'
import { mapState } from 'vuex'
import { deepClone, randomRange } from '@/utils'
import { ElCheckbox as Checkbox } from 'element-plus'
// import SlideVerify from 'vue-monoplasty-slide-verify';
// Vue.use(SlideVerify);
export default {
  name: '',
  data() {
    return {
      showSlider: false,
      cancelImg: require('@/assets/images/icon/cancel1.png'),
      show: false,
      params: {
        userName: '',
        password: '',
        phone: '',
        code: '',
      },
      ifRemember: false,
      registerSuccess: true,
      logStatus: 'login',
      msg: '123123',
      text: '向右滑',
      timer: null,
      time: null,
      loginType: 'account',
      phoneParams: {
        phone: '',
        code: '',
      },
      isWxscan: false,
    }
  },
  computed: {
    //  ...mapState({
    //   logStatus: state => state.user.logStatus,
    //   islogin: state => state.user.islogin,
    // }),
  },
  props: {
    //  callBack:{
    //    type: Function,
    //    default: (v)=>{
    //     //  this.$store.dispatch('user/SET_logStatus',v)
    //     console.log('aaa')
    //    }
    //  }
  },
  components: {
    'el-checkbox': Checkbox,
  },
  watch: {
    logStatus(v) {
      if (v == 'login') {
        if (localStorage.getItem('u')) {
          this.params = {
            userName: this.tils().decode(
              localStorage.getItem('u').split('||')[0]
            ),
            password: this.tils().decode(
              localStorage.getItem('u').split('||')[1]
            ),
          }
          this.ifRemember = true
        }
      }
      if (v) {
        let that = this
        document.onkeydown = function (event) {
          console.log('123123123')
          var e = event || window.event || arguments.callee.caller.arguments[0]
          if (e.keyCode == 13 && that.logStatus) {
            //上
            if (that.logStatus == 'login') {
              that.logOrReg(1)
            } else if (that.logStatus == 'register') {
              that.logOrReg(2)
            }
          }
        }
      } else {
        document.removeEventListener('keydown')
      }
    },
  },
  created() {
    if (this.callBack) {
      console.log('999')
      this.callBack()
    }

    if (location.href.includes('code=')) {
      this.isWxscan = true
    }
  },
  mounted() {
    let self = this
    if (document.getElementById('loginBox')) {
      document.getElementById('loginBox').addEventListener('keyup', (e) => {
        if (e.code.toLowerCase() == 'enter') {
          if (self.logStatus == 'login') {
            self.logOrReg(1)
          } else {
            self.logOrReg(1)
          }
        }
      })
    }
  },
  methods: {
    enters(e) {
      if (e.code.toLowerCase() == 'enter') {
        if (this.logStatus == 'login') {
          this.logOrReg(1)
        } else {
          this.logOrReg(1)
        }
      }
    },
    checkoutLoginType(v) {
      this.loginType = v
    },
    sendCode() {
      if (this.time) return
      if (this.params.phone && /^1[3456789]\d{9}$/.test(this.params.phone)) {
        // this.showSlider = true;
        this.onSuccess()
      } else {
        this.$toast('请正确输入手机号')
      }
    },
    onSuccess() {
      this.msg = 'login success'
      api.getCode({ phone: this.params.phone }).then((res) => {
        if (res.success) {
          this.$toast('发送验证码成功')
          this.showSlider = false
          this.time = 60
          this.timer = setInterval(() => {
            if (this.time > 1) {
              this.time -= 1
            } else {
              clearInterval(this.timer)
              this.time = null
              this.timer = null
            }
          }, 1000)
        } else {
          this.$toast(res.message)
        }
      })

      // getCode
    },
    onFail() {
      this.msg = ''
    },
    onRefresh() {
      this.msg = ''
    },
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
    showLogin(v) {
      debugger
      console.log('---------', v)
      this.logStatus = v || 'login'
      this.show = true
    },
    toWhat(v) {
      // this.$store.dispatch('user/SET_logStatus',v)
      // this.$store.commit('user/SET_logStatus', v)

      this.logStatus = v
    },
    cancelLogin() {
      // Vue.$store.dispatch('user/SET_logStatus','')
      this.logStatus = 'login'
      this.show = false
    },
    logOrReg(v) {
      let params = deepClone(this.params)
      if (v == 1 && this.ifNull(v)) {
        if (this.loginType == 'account') {
          api.toLogin(params).then((res) => {
            if (res.success) {
              if (this.ifRemember) {
                let random = randomRange(40)
                let a = this.tils().encode(params.userName)
                let p = this.tils().encode(params.password)
                localStorage.setItem('u', a + '||' + p)
              } else {
                localStorage.removeItem('u')
              }
              // debugger
              this.getUserInfo()
            } else {
              this.$toast(res.errorMessage)
            }
            // localStorage.setItem('userInfo',JSON.stringify(res.data))
          })
        } else {
          let par = {
            phone: params.phone,
            code: params.code,
          }
          api.phoneLogin(par).then((res) => {
            if (res.success) {
              if (this.ifRemember) {
                let random = randomRange(40)
                let a = this.tils().encode(params.userName)
                let p = this.tils().encode(params.password)
                localStorage.setItem('u', a + '||' + p)
              } else {
                localStorage.removeItem('u')
              }
              // debugger
              this.getUserInfo()
            } else {
              this.$toast(res.errorMessage)
            }
          })
        }
      } else if (v == 2 && this.ifNull(v)) {
        if (location.href.includes('code=')) {
          params.platform = 'wechat'
        }
        console.log('inviter ' + localStorage.getItem('inviter'))
        params.inviter = localStorage.getItem('inviter')
        api.toRegister(params).then((res) => {
          if (res.success) {
            history.replaceState({ page: 3 }, 'title 3', location.pathname)
            this.getUserInfo()
            this.registerSuccess = true
          } else {
            this.$toast(res.errorMessage)
            console.log(123)
          }
        })
      } else if (v == 3) {
        api.bindUserWithWeChatOAuthWithPassword(params).then((res) => {
          if (res.success) {
            history.replaceState({ page: 3 }, 'title 3', location.pathname)
            this.getUserInfo()
            this.registerSuccess = true
          } else {
            this.$toast(res.errorMessage)
            console.log(123)
          }
        })
      }
    },
    ifNull(v) {
      let params = deepClone(this.params)
      // let phoneParams = deepClone(this.phoneParams);
      if (v == 1) {
        if (this.loginType == 'account') {
          if (params.userName && params.password) {
            return true
          } else {
            this.$toast('请输入用户名和密码')
            return false
          }
        } else {
          if (params.phone && params.code) {
            return true
          } else {
            this.$toast('请输入手机号或验证码')
            return false
          }
        }
      } else {
        if (
          !params.phone ||
          !/^1[3456789]\d{9}$/.test(params.phone) ||
          !params.code
        ) {
          this.$toast('请完成手机号码验证')
          return false
        }
        if (params.userName && params.password) {
          return true
        } else {
          return false
        }
      }
    },
    getUserInfo() {
      this.$toast('登录成功')
      this.callBack()
      // Vue.$store.dispatch('user/SET_logStatus','')
      this.logStatus = 'login'
      setTimeout(() => {
        location.reload()
      }, 10)
    },
    tils() {
      const randStr = () => Math.random().toString(36).substr(2)
      const supplyFunc = (str, len) => {
        if (str.length > len) return str.substr(0, len)
        if (str.length < len) return supplyFunc(str + randStr(), len)
        return str
      }
      const str10 = () => supplyFunc(randStr(), 10)
      //加密函数
      const encode = (str) => str10() + escape(str) + str10()
      //解密函数
      const decode = (str) => unescape(str.substr(10, str.length - 20))
      return {
        encode,
        decode,
      }
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
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
    width: 400px;
    max-width: 90%;
    // height: 350px;
    box-sizing: border-box;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    min-height: 330px;
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
    .tnames {
      display: flex;
      font-size: 16px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      line-height: 24px;
      div {
        // margin-right: 20px;
        // padding: 4px 8px;
        // background: #f7f7f7;
        cursor: pointer;
      }
      .tts:nth-child(1) {
        padding-right: 20px;
        border-right: 1px solid #ddd;
      }
      .tts:nth-child(2) {
        padding-left: 20px;
        padding-right: 20px;
      }
      .tts:nth-child(3) {
        padding-left: 20px;
        border-left: 1px solid #ddd;
      }
      .tts_act {
        color: #e23d0e;
      }
    }
    input {
      height: 44px;
      outline: none;
      border: 1px solid #ededed;
      background: #f9f9f9;
      font-size: 15px;
      margin-top: 10px;
      width: 100%;
      padding-left: 10px;
      border-radius: 8px;
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
        flex: 1;
        margin-right: 20px;
      }
      span {
        line-height: 40px;
        margin-top: 10px;
        text-align: center;
        flex: 0 0 100px;
        border: 1px solid #ddd;
        cursor: pointer;
        color: #666;
        border-radius: 8px;
        moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }
    .ylogin {
      background: #e23d0e;
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 44px;
      border-radius: 10px;
      margin-top: 34px;
      margin-bottom: 24px;
      cursor: pointer;
      moz-user-select: -moz-none;
      -moz-user-select: none;
      -o-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
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
.phonever {
  .title {
    font-weight: bold;
    margin-top: 16px;
  }
}
.sliders {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  .title {
    padding: 8px 4px 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .slid {
    // border: 1px solid #f1f1f1;
    padding: 4px;
    padding-bottom: 40px;
    .tclose {
      text-align: center;
      margin-top: 20px;
      position: absolute;
      bottom: 30px;
      left: 140px;
      cursor: pointer;
      font-size: 13px;
      color: #999;
    }
  }
}
.codes {
  width: 22px;
  vertical-align: middle;
}
iframe {
  width: 350px;
  height: 400px;
}
</style>
