var width = 260,
  height = 180
var data = {
  // 初始头位置
  x: 2,
  y: 2,
  size: 10, //大小
  timeout: 200, // 每隔多久刷新
}
var score = 0
var canvas,
  ctx,
  snake,
  food,
  isover = false,
  doScore,
  copyData,
  gameOver
/**
 * 初始化画布
 */
function init(datas = {}, doScores, gameOvers) {
  copyData = JSON.parse(JSON.stringify(datas))
  if (doScores) {
    doScore = doScores
  }
  if (gameOvers) {
    gameOver = gameOvers
  }
  width = datas.width ? datas.width : width
  height = datas.height ? datas.height : height
  data = datas.data ? datas.data : data
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  snake = new Snake(data.x, data.y)
  food = new Food()
  getKey()
  draw()
  document.getElementById('start').onclick = function () {
    // snake.stop()
    snake.move()
  }
  document.getElementById('stop').onclick = function () {
    snake.stop()
  }
  document.getElementById('restart').onclick = function () {
    isover = false
    data.timeout = copyData.data.timeout
    console.log('data', data)
    // debugger

    // init(copyData,doScores)
    snake.stop()
    snake = new Snake(data.x, data.y)
    food = new Food()
    score = 0
    snake.move()
  }
  // time = setInterval(function() {
  // draw();
  // snake.move()
  // }, data.timeout)
}

/**
 * 按键时间
 */
function getKey() {
  document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]

    if (e && (e.keyCode == 38 || e.keyCode == 87)) {
      //下
      if (snake.time) {
        e.preventDefault()
      }

      if (snake.direction !== 'top') snake.direction = 'bottom'
    }
    if ((e && e.keyCode == 37) || e.keyCode == 65) {
      //左
      if (snake.direction !== 'right') snake.direction = 'left'
    }

    if ((e && e.keyCode == 39) || e.keyCode == 68) {
      //右
      if (snake.direction !== 'left') snake.direction = 'right'
    }

    if ((e && e.keyCode == 40) || e.keyCode == 83) {
      //上
      if (snake.time) {
        e.preventDefault()
      }
      if (snake.direction !== 'bottom') snake.direction = 'top'
    }
    if (e.keyCode == 13) {
      //上
      if (snake.play) {
        snake.stop()
      } else {
        snake.move()
      }
    }
  }
}

/**
 * 绘图
 */
function draw() {
  ctx.fillStyle = '#ddd'
  // var img = new Image()
  // img.src = 'http://img0.imgtn.bdimg.com/it/u=332248981,2934284699&fm=26&gp=0.jpg'
  // //图片加载完后，将其显示在canvas中
  // img.onload = function(){
  //     ctx.drawImage(this, 0, 0,width,height)
  //     // context.drawImage(this, 0, 0, 1080, 980)改变图片大小到1080*980
  // }
  ctx.fillRect(0, 0, width, height)
  for (var i = 0; i < snake.body.length; i++) {
    ctx.save()
    ctx.translate(snake.body[i][0] * data.size, snake.body[i][1] * data.size)
    if (i === 0) {
      ctx.fillStyle = 'green'
    } else {
      ctx.fillStyle = '#1ce30d'
    }
    // ctx.fillRect(0, 0, data.size, data.size);
    ctx.beginPath()
    ctx.arc(data.size / 2, data.size / 2, data.size / 2, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.restore()
  }
  ctx.save()
  ctx.translate(food.x * data.size, food.y * data.size)
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(data.size / 2, data.size / 2, data.size / 2, 0, Math.PI * 2, false)
  ctx.fill()
  // ctx.fillRect(0, 0, data.size, data.size);
  // var img = new Image()
  // img.src = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1787375589,83343043&fm=26&gp=0.jpg'
  // //图片加载完后，将其显示在canvas中
  // img.onload = function(){
  //     ctx.drawImage(0, 0,data.size, data.size)
  //     // context.drawImage(this, 0, 0, 1080, 980)改变图片大小到1080*980
  // }
  ctx.restore()
  document.getElementsByClassName('score')[0].innerHTML = score

  requestAnimationFrame(draw)
}

/**
 * 创建蛇对象
 */
function Snake(x, y) {
  this.moving = true
  this.body = [[x, y]] // 蛇的身体
  this.direction = 'right' // 初始方向
  this.time = null
  this.play = false
  this.move = function () {
    document.getElementById('start').style.display = 'none'
    document.getElementById('stop').style.display = 'inline-block'
    document.getElementById('cover').style.display = 'none'
    document.getElementById('cover2').style.display = 'none'
    this.play = true
    console.log(1)
    var _this = this
    this.time = setInterval(function () {
      var last = [].concat(_this.body[_this.body.length - 1])
      for (var i = _this.body.length - 1; i >= 1; i--) {
        _this.body[i][0] = _this.body[i - 1][0]
        _this.body[i][1] = _this.body[i - 1][1]
      }
      switch (_this.direction) {
        case 'right':
          _this.body[0][0] += 1
          break
        case 'bottom':
          _this.body[0][1] -= 1
          break
        case 'left':
          _this.body[0][0] -= 1
          break
        case 'top':
          _this.body[0][1] += 1
          break
      }
      // 检查是否遇到食物
      if (_this.body[0][0] === food.x && _this.body[0][1] === food.y) {
        _this.eat(last)
      }
      // 检查是否遇到自己身体
      var index = _this.body.findIndex(function (e, i) {
        return i !== 0 && _this.body[0][0] === e[0] && _this.body[0][1] === e[1]
      })
      // var promise = new Promise(function (resolve, reject) {
      //     var index = _this.body.findIndex(function(e, i) {
      //         return i !== 0 && (_this.body[0][0] === e[0] && _this.body[0][1] === e[1])
      //     })
      //     resolve(index);
      //     // if (执行某些操作成功了) {
      //     //     resolve({
      //     //       name:'resolve'
      //     //     });
      //     // }else {
      //     //    //执行失败
      //     //     reject({
      //     //       name:'err'
      //     //     });
      //     // }
      // })
      if (
        index !== -1 ||
        (_this.body[0][0] === last[0] && _this.body[0][1] === last[1])
      ) {
        // debugger
        isover = true
        document.getElementById('cover').style.display = 'block'
        document.getElementById('start').style.display = 'none'
        document.getElementById('stop').style.display = 'none'
        clearInterval(_this.time)
        _this.time = null
        _this.stop()
        gameOver()
      }
      // 检查是否撞墙
      if (
        _this.body[0][0] < 0 ||
        _this.body[0][0] > width / data.size - 1 ||
        _this.body[0][1] < 0 ||
        _this.body[0][1] > height / data.size - 1
      ) {
        // alert('你撞墙了')
        // debugger
        isover = true
        document.getElementById('cover').style.display = 'block'
        document.getElementById('start').style.display = 'none'
        document.getElementById('stop').style.display = 'none'
        clearInterval(_this.time)
        _this.time = null
        _this.stop()
        gameOver()
      }
    }, data.timeout)
  }
  this.eat = function (last) {
    this.body.push(last)
    score += 10
    if (snake.time && doScore) {
      doScore(score)
    }
    food = new Food()
  }
  this.stop = function () {
    this.play = false
    if (!isover) {
      document.getElementById('start').style.display = 'inline-block'
      document.getElementById('cover2').style.display = 'block'
      document.getElementById('cover2').style.opacity = '0.2'
    } else {
    }
    document.getElementById('stop').style.display = 'none'
    clearInterval(this.time)
  }
}

/**
 * 食物
 */
function Food() {
  this.x = Math.floor(Math.random() * (width / data.size - 2) + 1)
  this.y = Math.floor(Math.random() * (height / data.size - 2) + 1)
}
function changeLevel(timeout) {
  console.log('timeout', timeout)
  data.timeout = timeout

  // 非等级模式
  copyData.data.timeout = timeout

  clearInterval(snake.time)
  snake.time = null
  if (!isover) {
    snake.move()
  }

  console.log('data', data)
}
module.exports = {
  Snake,
  init,
  changeLevel,
}
