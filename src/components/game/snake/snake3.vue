<template>
  <div class="">
    <div id="wrap" class="wrap" :style="{ width: width + 10 + 'px' }">
      <div class="content">
        <canvas
          id="canvas"
          :width="width"
          :height="height"
          style="border: 5px solid #2f0606"
        ></canvas>
        <div style="display: none" class="cover" id="cover">
          <img
            src="https://i.chao.fun/cde965f71165184148f3be3343b7e5df.png"
            alt=""
          />
        </div>
        <div class="cover" id="cover2">
          <img src="../../../assets/images/game/snake/snake.jpg" alt="" />
        </div>
      </div>
      <div class="controller">
        <div class="display">
          <div>
            <el-icon class="icon"><el-icon-video-play /></el-icon>
            <el-icon class="icon" style="display: none"
              ><el-icon-video-pause
            /></el-icon>
            <el-icon class="icon"><el-icon-refresh-right /></el-icon>
          </div>
          <div class="beishu">
            <span @click="speed(1)" :class="[{ active: level == 1 }]">1倍</span>
            <span @click="speed(2)" :class="[{ active: level == 2 }]">2倍</span>
            <span @click="speed(3)" :class="[{ active: level == 3 }]">3倍</span>
          </div>
          <div class="scoress">当前：<span class="score">0</span> 分</div>
        </div>
      </div>
      <div class="display" style="line-height: 40px; font-size: 13px">
        <div>↑ ↓ ← →（W S A D）控制方向</div>
        <div>
          <span
            @click="bigModel"
            style="padding: 4px 6px; background: #ddd; cursor: pointer"
            >大屏模式</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  VideoPlay as ElIconVideoPlay,
  VideoPause as ElIconVideoPause,
  RefreshRight as ElIconRefreshRight,
} from '@element-plus/icons'
import snake from './snake3.js'
const width = 260,
  height = 180
import * as api from '@/api/api'
import { randomRange } from '@/utils'
var data = {
  // 初始头位置
  x: 2,
  y: 2,
  size: 10, //大小
  timeout: 200, // 每隔多久刷新
}
// var score = 0;
// var canvas,ctx,snake,food,isover = false;
export default {
  components: {
    ElIconVideoPlay,
    ElIconVideoPause,
    ElIconRefreshRight,
  },
  name: '',
  data() {
    return {
      snake: {},
      width: '',
      height: '',
      lavelScore: [20, 30, 50, 60, 80],
      level: 1,
      //  speeds: [200,150,100],
      copyDatas: {},
      score: 0,
    }
  },
  props: {
    datas: {
      type: Object,
      default() {
        return {
          width: 260,
          height: 180,
          speeds: [200, 150, 100],
          data: {
            // 初始头位置
            x: 2,
            y: 2,
            size: 10, //大小
            timeout: 200, // 每隔多久刷新
          },
        }
      },
    },
  },
  created() {
    this.width = this.datas.width
    this.height = this.datas.height
    this.copyDatas = JSON.parse(JSON.stringify(this.datas))
  },
  mounted() {
    snake.init(this.datas, this.doBackScore, this.gameOver)
    console.log(randomRange(40))
  },
  methods: {
    gameOver(score) {
      console.log('本次得分：', this.score)
      let randomStr = randomRange(40)

      randomStr = Array.from(randomStr)
      console.log(randomStr)
      randomStr[8] = parseInt(this.score / 1000)
      randomStr[18] = parseInt((this.score % 1000) / 100)
      randomStr[28] = parseInt(((this.score % 1000) % 100) / 10)
      randomStr[38] = parseInt(((this.score % 1000) % 100) % 10)
      randomStr[6] = 'x'
      randomStr[16] = 'y'
      randomStr[26] = 'z'
      console.log(
        randomStr[7],
        randomStr[17],
        randomStr[27],
        randomStr[37],
        randomStr.join('')
      )
      randomStr = randomStr.join('')
      api.submitScore({ score: randomStr }).then((res) => {})
    },
    bigModel() {
      this.$router.push({ name: 'gamePage' })
    },
    speed(v) {
      this.level = v
      snake.changeLevel(this.datas.speeds[v - 1])
    },
    doBackScore(v) {
      this.score = v
      console.log(v)
    },
    doScore(v) {
      console.log(v)
      if (v == this.lavelScore[this.level]) {
        console.log('this.datas.timeout', this.datas.data.timeout)
        this.level += 1
        this.datas.data.timeout -= 100
        snake.changeLevel(this.datas.data.timeout)
      }
    },
    restart() {
      this.datas = this.copyDatas
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.container {
  // position: fixed;
  // width: 100%;
  // left: 0;
  // top: 0;
  // bottom: 0;
  // right: 0;
  // z-index: 10;
  // background: #fff;
  // padding: 300px;
}
.wrap {
  width: 270px;
  height: 100%;
  margin: 0 auto;
  // margin-top: 20px;
  canvas {
    vertical-align: bottom;
  }
  .content {
    position: relative;
    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // width: 500px;
  height: 60px;
}
button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}
.footer {
  padding: 10px 0;
  display: flex;
}
.controller {
  background: #000;
  color: #fff;
  padding: 8px 0px;
}
.display {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  padding: 0 6px;
}
.icon {
  font-size: 28px;
  color: #fff;
  vertical-align: middle;
  margin-right: 6px;
}
.beishu {
  span {
    background: #fff;
    color: #999;
    padding: 4px 4px;
    cursor: pointer;
  }
  .active {
    color: orange;
  }
}
.scoress {
  flex: 0 0 95px;
  text-align: right;
}
</style>
