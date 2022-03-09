<template>
  <div class="container">
    <div style="position: fixed; top: 0; z-index: 30">
      <div @click="toLive" class="fixed_top_live">直播地址</div>
    </div>
    <div class="rank_rule" style="z-index: 20">
      <div class="rank_line">
        <div
          @click="toRank"
          class="rank rank1"
          style="
            cursor: pointer;
            width: 100px;
            position: fixed;
            left: 0;
            top: 0;
            border: 1px solid #f1f1f1;
            padding: 10px 20px;
            border-radius: 10px;
          "
        >
          排行榜
        </div>
      </div>

      <div style="position: fixed; right: 0">
        <div @click="toHome" class="fixed_top">炒饭首页</div>
        <div
          @click="showRule"
          style="margin-top: 40px; padding: 0px 10px; cursor: pointer"
        >
          <img src="./assets/images/rule.png" alt="" />游戏规则
        </div>
        <div
          @click.stop="showClickRecordDrawer = true"
          style="margin-top: 10px; padding: 0px 10px; cursor: pointer"
        >
          <el-icon style="font-size: 20px; width: 20px; height: 20px"
            ><el-icon-s-unfold /></el-icon
          >点击记录
        </div>
      </div>
    </div>
    <div class="infoShow">
      <div class="info" style="margin-top: 40px">
        <!--            <p>当前时间：{{moment(now_timestamp).format("HH:mm:ss")}}</p>-->
        <!--            <p>获奖时间：{{moment(lastGetPriceTimestamp).format("HH:mm:ss")}}</p>-->
        <!--            <p>距离上次：{{moment(now_timestamp-lastGetPriceTimestamp-28800000).format("HH:mm:ss")}}</p>-->
        <!--            <br />-->
        <p>上次获奖：</p>
        <p @click="toUser(lastGetPriceUserId)" style="cursor: pointer">
          {{ lastGetPriceUserName }}
        </p>
        <br />
        <p>获奖时间：</p>
        <p>{{ moment(lastGetPriceTimestamp).format('HH:mm:ss') }}</p>
        <br />
        <p>距离上次：</p>
        <p>
          {{
            moment(now_timestamp - lastGetPriceTimestamp - 28800000).format(
              'HH:mm:ss'
            )
          }}
        </p>
        <br />
        <p>参与人数：</p>
        <p>{{ participants_text }}</p>
        <br />
        <p>点击次数：</p>
        <p>{{ clickTimes }}</p>
        <br />
        <p>在线人数：</p>
        <p>{{ onlineNums }}</p>
      </div>
    </div>
    <div class="content" style="z-index: 10">
      <div class="main">
        <div
          @click="toUser(lastClickUserId)"
          class="lastClickUserName"
          style="z-index: 9"
        >
          {{
            lastClickUserName
              ? lastClickUserName + '点击了Button'
              : '未登录用户点击了Button'
          }}
        </div>
        <div class="time">
          <div v-if="canvas.speed < 6000" class="time_con">
            <span
              v-for="(item, index) in ('000' + (6000 - canvas.speed))
                .slice(-4)
                .split('')"
              :key="index"
              class="s"
              >{{ item }}</span
            >
          </div>
          <div v-else class="time_con">
            <span
              v-for="(item, index) in '0000'.split('')"
              :key="index"
              class="s"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="cans">
          <canvas
            id="canvas"
            width="150"
            height="150"
            style="background: #666; border-radius: 50%"
          ></canvas>
        </div>

        <div class="reset" @click="reset">
          <span class="btn">PLAY</span>
        </div>
        <div v-if="selfInfo.leftFBi" class="reward">
          剩余FBi：{{ selfInfo.leftFBi }}
        </div>
        <div v-if="selfInfo.alreadyClick" class="reward">
          点击次数：{{ selfInfo.alreadyClick }}
        </div>
        <div v-if="selfInfo.getFBi" class="reward">
          获得奖励：{{ selfInfo.getFBi }} FBi
        </div>
        <div v-if="selfInfo.rank" class="reward">
          排名：第 {{ selfInfo.rank }}
        </div>

        <!--            <div class="reward">剩余FBi：{{selfInfo.leftFBi}} </div>-->
        <!--            <div class="reward">点击次数：{{selfInfo.alreadClick}} </div>-->
        <!--            <div  class="reward">获得奖励：{{selfInfo.getFBi}} FBi</div>-->
      </div>
    </div>
    <div class="lastComment" @click="toIndex" style="cursor: pointer">
      <p>最新讨论:</p>
      <p>{{ newCommentUserName }} 说：{{ newCommet }}</p>
    </div>
    <div class="fixed_bottom">
      <div @click="toIndex" class="left_b">讨论区</div>
      <div
        v-clipboard:copy="'https://chao.fun/webview/buttonGame'"
        v-clipboard:success="onCopy"
        class="left_b"
      >
        复制游戏链接
      </div>
    </div>
    <van-dialog v-model="showR" confirmButtonText="我知道了">
      <div class="rtitle">游戏规则</div>
      <div class="rs">
        <p>1. 注册并且登陆用户参与</p>
        <p>2. 倒计时60秒，到 00:00 结束, 结束后停止在 00:00</p>
        <p>3. 所有用户共享全局倒计时</p>
        <p>
          4. 每点击按钮一次，消耗 1 FBi,
          并重置全局倒计时（其他用户也会同步更新）到60秒
        </p>
        <p>
          5. 游戏期间(截止2月6日23:59:59)，每次在 00:00 点击的用户，获得奖励 10
          FBi
        </p>
        <p>6. 禁止使用脚本，一经发现，FBi清零</p>
        <div>
          7.
          <el-button @click="toFbi">什么是 FBi</el-button>
        </div>
        <p>* 致敬 Reddit</p>
      </div>
    </van-dialog>
    <van-dialog
      v-model="showLogin"
      @confirm="confirms"
      :confirmButtonText="islogin ? '登陆' : '注册'"
      showCancelButton
      cancelButtonText="取消"
    >
      <div class="rtitle">用户登陆</div>
      <div v-if="islogin" class="rs login">
        <input type="text" v-model="baseForm.userName" placeholder="用户名" />
        <input type="password" v-model="baseForm.password" placeholder="密码" />
        <div @click="islogin = false" class="toto">去注册</div>
      </div>
      <div v-if="!islogin" class="rs login">
        <input type="text" v-model="baseForm.userName" placeholder="用户名" />
        <input
          type="password"
          v-model="baseForm.repassword"
          placeholder="密码"
        />
        <input
          type="password"
          v-model="baseForm.password"
          placeholder="确认密码"
        />
        <div @click="islogin = true" class="toto">去登陆</div>
      </div>
    </van-dialog>
    <el-drawer
      title="近期点击记录"
      :destroy-on-close="true"
      :visible.sync="showClickRecordDrawer"
      size="260px"
      :append-to-body="true"
      :modal-append-to-body="false"
    >
      <buttonGameClickRecord :clickRecordArray="clickRecordArray" />
    </el-drawer>
  </div>
</template>

<script>
import { SUnfold as ElIconSUnfold } from '@element-plus/icons'
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import Vue from 'vue'
import * as api from '@/api/api'
import { Circle } from 'vant'
import moment from 'moment'
import buttonGameClickRecord from '@/views/chaofun-webview/buttonGameClickRecord'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Vue.use(Circle)
CanvasRenderingContext2D.prototype.sector = function (
  x,
  y,
  radius,
  sAngle,
  eAngle,
  counterclockwise
) {
  this.beginPath()
  this.translate(x, y)
  this.moveTo(0, 0)
  this.arc(0, 0, radius, sAngle, eAngle, counterclockwise)
  this.closePath()

  return this
}
export default {
  components: {
    buttonGameClickRecord,
    ElIconSUnfold,
  },
  name: 'Home',
  data() {
    return {
      clickRecordArrayMaxLength: 256,
      clickRecordArray: [],
      showClickRecordDrawer: false,
      moment: moment,
      lastGetPriceTimestamp: 0,
      now_timestamp: 0,
      islogin: true,
      baseForm: {},
      showLogin: false,
      newCommet: '',
      newCommentUserName: '',
      lastClickUserId: '',
      lastGetPriceUserId: '',
      lastClickUserName: '',
      lastGetPriceUserName: '',
      selfInfo: {},
      showR: false,
      participants_text: 0,
      clickTimes: 0,
      onlineNums: 0,
      timer: null,
      canvas: {
        canvas: '', //获取canvas元素
        context: '', //获取画图环境，指明为2d
        centerX: '', //Canvas中心点x轴坐标
        centerY: '', //Canvas中心点y轴坐标
        rad: '', //将360度分成100份，那么每一份就是rad度
        speed: '', //加载的快慢就靠它了
      },
    }
  },
  computed: {
    //   value(){
    //       var t = 60-(this.data.seconds_left*1+this.time2/1000).toFixed(2);
    //       return (t*100)/60;
    //   }
  },
  watch: {
    'data.seconds_left'(n, o) {
      //   console.log(2,n);
      //   this.time = n*10000;
      //     this.doTime()
    },
  },
  created() {
    this.initWebSocket()
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  mounted() {
    document.title = '炒饭春节游戏'

    var cons = document.getElementById('canvas')
    this.canvas = {
      canvas: cons,
      context: cons.getContext('2d'),
      centerX: canvas.width / 2, //Canvas中心点x轴坐标
      centerY: canvas.height / 2, //Canvas中心点y轴坐标
      rad: (Math.PI * 2) / 6000, //将360度分成100份，那么每一份就是rad度
      speed: 0, //加载的快慢就靠它了
    }

    function text(n) {
      context.save() //save和restore可以保证样式属性只运用于该段canvas元素
      context.strokeStyle = '#fff' //设置描边样式
      context.font = '40px Arial' //设置字体大小和字体
      //绘制字体，并且指定位置
      context.strokeText(n.toFixed(0) + '%', centerX - 25, centerY + 10)
      context.stroke() //执行绘制
      context.restore()
    }
  },
  methods: {
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
    onCopy(e) {
      this.$toast('链接复制成功！')
    },
    toIndex() {
      try {
        window.flutter_inappwebview.callHandler('toAppPost', {
          postId: '1081032',
        })
      } catch (e) {
        window.open('https://chao.fun/p/1081032', '_blank')
      }
    },
    toHome() {
      try {
        // window.flutter_inappwebview.callHandler('toAppIndex', {})
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://chao.fun/all',
          title: '炒饭网页首页',
          showHeader: true,
        })
      } catch (e) {
        window.open('https://chao.fun/all', '_blank')
      }
    },

    toLive() {
      try {
        // window.flutter_inappwebview.callHandler('toAppIndex', {})
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://live.bilibili.com/23919989',
          title: 'TheButtonB站直播',
          showHeader: true,
        })
      } catch (e) {
        window.open('https://live.bilibili.com/23919989', '_blank')
      }
    },
    toFbi() {
      try {
        // window.flutter_inappwebview.callHandler('toAppIndex', {})
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: 'https://chao.fun/webview/fbi',
          title: '饭币 (FBi)',
          showHeader: true,
        })
      } catch (e) {
        if (this.ISPHONE) {
          window.open('https://chao.fun/webview/fbi', '_blank')
        } else {
          window.open('https://chao.fun/my/fbi', '_blank')
        }
      }
    },
    confirms() {
      if (this.islogin) {
        let params = {
          userName: this.baseForm.userName,
          password: this.baseForm.password,
        }
        api.toLogin(params).then((res) => {
          if (res.success) {
            // debugger
            this.getUserInfo()
          } else {
            this.$toast('登录失败，用户名或密码错误')
          }
          // localStorage.setItem('userInfo',JSON.stringify(res.data))
        })
      } else {
        let params = {
          userName: this.baseForm.userName,
          password: this.baseForm.password,
        }

        api.toRegister(params).then((res) => {
          if (res.success) {
            this.getUserInfo()
          } else {
            this.$toast(res.errorMessage)
            console.log(123)
          }
        })
      }
    },
    getUserInfo() {
      this.$toast('登录成功')
      // debugger
      const res = this.$store.dispatch('user/getInfo')
      this.$store.dispatch('user/getInfo', '')
      setTimeout(() => {
        location.reload()
      }, 10)
    },
    toRank() {
      try {
        window.flutter_inappwebview.callHandler('toViewPage', {
          url: location.origin + '/webview/buttonGame/rank',
          title: '排行榜',
          showHeader: true,
        })
      } catch (e) {
        window.open(location.origin + '/webview/buttonGame/rank', '_blank')
      }
    },
    showRule() {
      this.showR = true
    },
    reset() {
      // if(this.selfInfo.timesLeft*1>0){
      this.init()
      let actions = { test: '12545' }
      this.toSend(JSON.stringify(actions))
      // }else{

      // }
    },
    init() {
      this.canvas.speed = 0
      this.blueCircle(0)
      clearInterval(this.timer)
      this.timer = null
    },
    initInterval() {
      this.timer = setInterval(() => {
        this.drawFrame()
        if (this.speed == 6000) {
          clearInterval(this.timer)
          this.timer = null
        }
      }, 10)
    },
    drawFrame() {
      var context = this.canvas.context
      // window.requestAnimationFrame(drawFrame);
      context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.whiteCircle()
      // text(speed);
      this.blueCircle(this.canvas.speed)
      // this.timeRect()
      // context.sector(50,50,50,-90*Math.PI/180,(Math.PI/180)*(speed-90),false).fill();
      // if(this.canvas.speed > 6000) this.canvas.speed = 0;
      this.canvas.speed += 1
    },
    //绘制5像素宽的运动外圈 灰原
    blueCircle(n) {
      var context = this.canvas.context
      context.save()
      context.strokeStyle = '#ddd' //设置描边样式
      context.lineWidth = 90 //设置线宽
      context.beginPath() //路径开始
      context.arc(
        this.canvas.centerX,
        this.canvas.centerY,
        45,
        -Math.PI / 2,
        -Math.PI / 2 + n * this.canvas.rad,
        false
      ) //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
      context.stroke() //绘制
      context.closePath() //路径结束
      context.restore()
    },
    whiteCircle() {
      // 黑圆
      var context = this.canvas.context
      context.save()
      context.beginPath()
      context.lineWidth = 90 //设置线宽
      context.strokeStyle = '#666'
      context.arc(
        this.canvas.centerX,
        this.canvas.centerY,
        45,
        0,
        Math.PI * 2,
        false
      )
      context.stroke()
      context.closePath()
      context.restore()
    },
    timeRect() {
      // 黑圆
      var context = this.canvas.context
      context.save()
      context.fillStyle = '#ddd'
      context.fillRect(this.canvas.centerX - 30, 40, 150, 80)
      context.restore()
    },
    toSend() {
      this.websocketsend('test')
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = 'wss://chao.fun/ws/v0/game/theButton'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen(e) {
      //连接建立之后执行send方法发送数据
      let actions = { test: '12545' }
      console.log('链接成功')
      console.log('1', e)
      // this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      //连接建立失败重连
      // setTimeout(()=>{
      //     this.initWebSocket()
      // },1000)
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data)
      if (redata.type == 'ticking') {
        if (redata.seconds_left == '0.0') {
          this.blueCircle(6000)
          this.canvas.speed = 6000
          clearInterval(this.timer)
          this.timer = null
        } else {
          this.canvas.speed =
            6000 - parseInt(redata.seconds_left.toFixed(2) * 100)
          if (!this.timer) {
            this.initInterval()
          }
        }
        this.lastClickUserName = redata.lastClickUserName
        this.lastClickUserId = redata.lastClickUserId
        this.lastGetPriceUserId = redata.lastGetPriceUserId
        this.participants_text = redata.participants_text
        this.onlineNums = redata.onlineNums
        // this.clickTimes = redata.clickTimes;
        this.lastGetPriceUserName = redata.lastGetPriceUserName
        this.newCommet = redata.lastComment
        this.newCommentUserName = redata.lastCommentUserName
        this.now_timestamp = redata.now_timestamp
        this.lastGetPriceTimestamp = redata.lastGetPriceTime

        this.showNotificationAndRecord(redata)
        this.clickTimes = redata.clickTimes
      } else if (redata.type == 'selfInfo') {
        this.selfInfo = redata
      } else if (redata.type == 'needLogin') {
        this.doLoginStatus().then((res) => {
          this.initWebSocket()
        })
      } else if (redata.type == 'getPrice') {
        this.$toast('太强了，你获得奖励了~')
      } else if (redata.type == 'gameOver') {
        this.$toast('春节游戏结束，感谢参与，可以访问炒饭首页到处逛逛')
      } else if (redata.type == 'hasNoFBi') {
        this.$toast('您没有FBi, 请查看游戏规则！')
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data)
      this.initInterval()
    },
    websocketclose(e) {
      //关闭
      setTimeout(() => {
        this.initWebSocket()
      }, 1000)
    },

    showNotificationAndRecord(redata) {
      if (!this.clickTimes || this.clickTimes == redata.clickTimes) {
        return
      }

      let typeStr = 'success'
      if (redata.lastClickSecondsLeft) {
        typeStr = 'error'
      }

      let item = {
        type: typeStr,
        userName: redata.lastClickUserName,
        timestamp: redata.now_timestamp,
        userId: redata.lastClickUserId,
      }

      if (this.clickRecordArray.length < this.clickRecordArrayMaxLength) {
        this.clickRecordArray.push(item)
      } else {
        let arr = [...this.clickRecordArray]
        arr.push(item)
        arr.splice(0, arr.length - this.clickRecordArrayMaxLength)
        this.clickRecordArray = arr
      }

      // 显示点击记录时不显示Notification
      if (this.showClickRecordDrawer) {
        return
      }

      this.$notify({
        title: redata.lastClickUserName,
        type: typeStr,
        showClose: false,
        offset: 100,
        customClass: this.ISPHONE ? 'notification' : null,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container {
  // height: ;
  padding-top: 0;
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
}

.content {
  // position: fixed;
  box-sizing: border-box;
  // height: 300px;
  // overflow: scroll;
  // background: #fff;
  padding-bottom: 30px;
  // width: 400px;
  // height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;

  .main {
    width: 400px;
    height: 500px;
    position: relative;
    display: flex;
    margin-top: 40px;
    margin-bottom: 40px;
    padding: 40px 0;
    flex-direction: column;
    justify-content: space-between;

    .cans {
      text-align: center;
    }
  }

  .cans {
    padding: 20px;
    background: #f1f1f1;
    border-radius: 100px;
    width: 190px;
    height: 190px;
    margin: 0 auto;
  }

  .reset {
    height: 68px;
    width: 240px;
    background: #ddd;
    text-align: center;
    padding: 10px;
    margin: 0 auto;
    border-radius: 10px;
    cursor: pointer;

    &:active {
      box-shadow: 3px 0px 20px rgba(0, 0, 0, 0.2);
    }

    &:hover {
      background: #ccc;
    }

    .btn {
      display: block;
      line-height: 48px;
      background: #fff;
      font-size: 28px;
      font-weight: bolder;

      &:hover {
        background: #eee;
      }
    }
  }

  .time {
    text-align: center;
    // position: absolute;
    top: 40px;
    left: 0;
    width: 100%;

    .time_con {
      width: 160px;
      height: 68px;
      background: #ddd;
      border-radius: 6px;
      margin: 0 auto;
      padding: 14px 20px;
      display: flex;
      justify-content: space-around;

      span {
        background: #fff;
        width: 24px;
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        font-weight: 600;
        display: inline-block;
      }
    }
  }

  .part {
    font-size: 16px;
    padding: 20px 20px;
    margin-bottom: 20px;
    text-align: center;
  }

  .btnm {
    width: 120px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    color: #fff;
    text-align: center;
    background: #ff9300;
    font-size: 20px;
    margin: 40px auto;
  }

  .desc {
    padding: 0 20px;
    font-size: 14px;
    color: #999;
  }

  .desc_title {
    padding: 4px 0;
    font-size: 14px;
    color: #999;
  }
}

.rank_rule {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  padding: 20px;
  font-size: 16px;
  z-index: 5;

  .rank {
    // line-height: 40px;
  }

  .rank1 {
    background: #ff9300;
    color: #fff;
    /*line-height: 28px;*/
    width: 80px;
    text-align: center;
    margin-bottom: 10px;
    /*border-radius: 4px;*/
  }

  .rank_line {
    display: flex;
    justify-content: space-between;
  }

  img {
    width: 20px;
    // height: 24px;
    vertical-align: middle;
  }
}

.infoShow {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  padding: 20px 5px;
  font-size: 16px;
  width: 40%;
  max-width: 150px;

  .info {
    width: 100%;
    max-width: 150px;
    font-size: 14px;
    color: #999;
  }
}

.rtitle {
  text-align: center;
  line-height: 40px;
  margin-top: 10px;
  font-size: 16px;
}

.rs {
  padding: 0px 20px 20px;

  p {
    font-size: 15px;
    color: #666;
    margin-bottom: 4px;
  }
}

.reward {
  text-align: center;
  /*position: absolute;*/
  bottom: 0px;
  width: 100%;
  line-height: 10px;
}

.lastClickUserName {
  position: absolute;
  top: 0;
  width: 100%;
  text-align: center;
  line-height: 20px;
  color: #999;
  cursor: pointer;
}

input {
  height: 34px;
  outline: none;
  border: 1px solid #ededed;
  background: #f6f7f8;
  font-size: 14px;
  margin-top: 16px;
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

.login {
  margin: 10px 10px;
}

.toto {
  text-align: right;
  padding-top: 12px;
  font-size: 12px;
}

.fixed_top {
  position: fixed;
  right: 0;
  top: 0;
  border: 2px solid #f1f1f1;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.fixed_top_live {
  top: 0;
  font-size: 16px;
  border: 2px solid #f1f1f1;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.fixed_bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 30;
  justify-content: space-between;

  .left_b {
    border: 1px solid #f1f1f1;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
  }
}

.lastComment {
  position: fixed;
  left: 20px;
  right: 0;
  bottom: 45px;
  width: 100%;
  max-width: 300px;
  z-index: 4;
  justify-content: space-between;

  p {
    font-size: 14px;
    color: #999;
  }
}
</style>

<style lang="scss">
.notification {
  width: 100px;
  padding: 2px 0px;

  .el-notification__icon {
    height: 10px;
    width: 10px;
    font-size: 14px;
  }

  .el-notification__title {
    font-size: 10px;
  }

  .el-notification__group {
    margin-left: 5px;
    margin-right: 1px;
  }
}

.el-notification.right {
  right: 5px;
}
</style>
