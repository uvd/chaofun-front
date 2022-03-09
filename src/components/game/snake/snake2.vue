<template>
  <div class="container">
    <div class="info" v-if="!failFlag">
      <button @click="start" v-if="!pauseButton">开始游戏</button>
      <button @click="pause" v-else>暂停</button>
      <span>长度: {{ score }}</span>
    </div>
    <div class="board" v-if="!failFlag">
      <div v-for="(i, index) in 20" :key="index">
        <div
          class="commonGrid"
          v-for="(j, index) in 20"
          ref="grid"
          :key="index"
        ></div>
      </div>
    </div>
    <div v-else class="failBox">
      <img
        src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2872222233,2453972241&fm=26&gp=0.jpg"
      />
      <button @click="again">再来一次</button>
    </div>
  </div>
</template>

<script>
import { ElMessage as Message } from 'element-plus'
import { setInterval, clearInterval } from 'timers'

export default {
  data() {
    return {
      pauseButton: false,
      //二维数组
      snake: [],
      egg: {
        row: Number,
        column: Number,
      },
      score: 4,
      //蛇前进的方向
      dir: String,
      moveTimer: null,
      dirTimer: null,
      failFlag: false,
    }
  },
  created() {
    //初始化蛇身,下标第一位是头，最后一位是尾
    for (let i = 4; i > 0; i--)
      this.snake = [
        ...this.snake,
        {
          row: 2,
          column: i + 1,
        },
      ]
    this.dir = 'right'
  },
  mounted() {
    this.mountSnake()
    this.createEgg()
  },
  methods: {
    mountSnake() {
      this.snake.forEach((body) => {
        this.$refs.grid[body.row * 20 + body.column].setAttribute(
          'class',
          'commonGrid snakeGrid'
        )
      })
    },

    start() {
      this.pauseButton = true
      this.moveTimer = this.setTimer()
      this.dirTimer = this.changeDir()
    },
    setTimer() {
      return setInterval(() => {
        let newRow = null
        let newColumn = null
        switch (this.dir) {
          case 'right':
            newRow = this.snake[0].row
            newColumn = this.snake[0].column + 1
            this.snake.unshift({
              row: newRow,
              column: newColumn,
            })
            break
          case 'up':
            newRow = this.snake[0].row - 1
            newColumn = this.snake[0].column
            this.snake.unshift({
              row: newRow,
              column: newColumn,
            })
            break
          case 'left':
            newRow = this.snake[0].row
            newColumn = this.snake[0].column - 1
            this.snake.unshift({
              row: newRow,
              column: newColumn,
            })
            break
          case 'down':
            newRow = this.snake[0].row + 1
            newColumn = this.snake[0].column
            this.snake.unshift({
              row: newRow,
              column: newColumn,
            })
            break
        }
        if (!this.judgeEgg()) {
          //判断是否吃到蛋
          const delItem = this.snake.pop()
          this.$refs.grid[delItem.row * 20 + delItem.column].setAttribute(
            'class',
            'commonGrid'
          )
        }
        this.judgeFail()
        this.mountSnake()
      }, 200)
    },
    changeDir() {
      return setInterval(() => {
        document.onkeydown = (event) => {
          const e =
            event || window.event || arguments.callee.caller.arguments[0]
          if (e && e.keyCode == 37 && this.dir != 'right') {
            // 按 左
            this.dir = 'left'
          } else if (e && e.keyCode == 38 && this.dir != 'down') {
            // 按 上键
            this.dir = 'up'
          } else if (e && e.keyCode == 39 && this.dir != 'left') {
            // 按 右键
            this.dir = 'right'
          } else if (e && e.keyCode == 40 && this.dir != 'up') {
            //按 下键
            this.dir = 'down'
          }
          this.mountSnake()
        }
      }, 10)
    },
    judgeEgg() {
      let flag = false
      this.snake.forEach((body) => {
        if (body.row === this.egg.row && body.column === this.egg.column) {
          flag = true
          this.createEgg()
          this.score++
        }
      })
      return flag
    },
    judgeFail() {
      // 判断是否吃到自己,只需判断新加入的那一块格子是否与身体重叠
      for (let i = 1; i < this.snake.length; i++) {
        if (
          this.snake[0].row === this.snake[i].row &&
          this.snake[0].column === this.snake[i].column
        ) {
          this.fail()
          return
        }
      }
      // 判断是否撞到墙，只需判断新加入的那一块格子是否越界
      if (
        this.snake[0].row > 19 ||
        this.snake[0].row < 0 ||
        this.snake[0].column > 19 ||
        this.snake[0].column < 0
      )
        this.fail()
    },
    notInSnake(row, column) {
      let flag = false
      this.snake.forEach((item) => {
        if (item.row != row && item.column != column) {
          flag = true
        }
      })
      return flag
    },
    createEgg() {
      let randrow = null
      let randcolumn = null
      while (true) {
        randrow = Math.floor(Math.random() * 20) //生成0-19的随机数
        randcolumn = Math.floor(Math.random() * 20)
        if (this.notInSnake(randrow, randcolumn)) break
      }
      this.egg = {
        row: randrow,
        column: randcolumn,
      }
      console.log(this.egg)
      this.$refs.grid[randrow * 20 + randcolumn].setAttribute(
        'class',
        'commonGrid eggGrid'
      )
    },
    pause() {
      this.pauseButton = false
      clearInterval(this.moveTimer)
      clearInterval(this.dirTimer)
      this.moveTimer = null
      this.dirTimer = null
    },
    fail() {
      this.pauseButton = false
      clearInterval(this.moveTimer)
      clearInterval(this.dirTimer)
      this.failFlag = true
    },
    again() {
      location.reload()
    },
  },
}
</script>

<style scoped>
.container {
  height: 80vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.board {
  width: 300px;
  height: 300px;
  flex-direction: row;
  border: 1px solid black;
}

button {
  cursor: pointer;
  width: 80px;
  height: 30px;
  margin: 10px 20px;
}

.commonGrid {
  float: left;
  width: 14px;
  height: 14px;
  border: 0.5px solid rgb(214, 125, 125);
}

.snakeGrid {
  background-color: red;
}

.eggGrid {
  background-color: yellow;
}

.failBox {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}
.container {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background: #fff;
}
</style>
