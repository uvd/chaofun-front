<template>
  <div>
    <div class="background">
      <!-- <img src="../../assets/images/bg/bg.jpg" alt=""> -->
      <canvas v-show="show"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      show: false,
    }
  },
  components: {},
  created() {},
  mounted() {
    var ctx = document.querySelector('canvas').getContext('2d')
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight

    var sparks = []
    var fireworks = []
    var i = 20
    while (i--) {
      fireworks.push(
        new Firework(
          Math.random() * window.innerWidth,
          window.innerHeight * Math.random()
        )
      )
    }

    render()
    function render() {
      setTimeout(render, 1000 / 60)
      ctx.fillStyle = 'rgba(247, 247, 247, 1)'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      for (var firework of fireworks) {
        if (firework.dead) continue
        firework.move()
        firework.draw()
      }
      for (var spark of sparks) {
        if (spark.dead) continue
        spark.move()
        spark.draw()
      }

      if (Math.random() < 0.05) {
        fireworks.push(new Firework())
      }
    }

    function Spark(x, y, color) {
      this.x = x
      this.y = y
      this.dir = Math.random() * (Math.PI * 2)
      this.dead = false
      this.color = color
      this.speed = Math.random() * 3 + 3
      this.walker = new Walker({ radius: 20, speed: 0.25 })
      this.gravity = 0.25
      this.dur = this.speed / 0.1
      this.move = function () {
        this.dur--
        if (this.dur < 0) this.dead = true

        if (this.speed < 0) return
        if (this.speed > 0) this.speed -= 0.1
        var walk = this.walker.step()
        this.x += Math.cos(this.dir + walk) * this.speed
        this.y += Math.sin(this.dir + walk) * this.speed
        this.y += this.gravity
        this.gravity += 0.05
      }
      this.draw = function () {
        drawCircle(this.x, this.y, 3, this.color)
      }
    }

    function Firework(x, y) {
      this.xmove = new Walker({ radius: 10, speed: 0.5 })
      this.x = x || Math.random() * ctx.canvas.width
      this.y = y || ctx.canvas.height
      this.height = (Math.random() * ctx.canvas.height) / 2
      this.dead = false
      this.color = randomColor()

      this.move = function () {
        this.x += this.xmove.step()
        if (this.y > this.height) this.y -= 1
        else this.burst()
      }
      this.draw = function () {
        drawCircle(this.x, this.y, 1, this.color)
      }
      this.burst = function () {
        this.dead = true
        var i = 100
        while (i--) sparks.push(new Spark(this.x, this.y, this.color))
      }
    }

    function drawCircle(x, y, radius, color) {
      color = color || '#FFF'
      ctx.fillStyle = color
      ctx.fillRect(x - radius / 2, y - radius / 2, radius, radius)
    }

    function randomColor() {
      //  return ['#6ae5ab','#88e3b2','#36b89b','#7bd7ec','#66cbe1'][Math.floor(Math.random() * 5)];
      return ['#ff6633', '#cc0000', '#ff3366', '#ff3366', '#cc3366'][
        Math.floor(Math.random() * 5)
      ]
    }

    function Walker(options) {
      this.step = function () {
        this.direction = Math.sign(this.target) * this.speed
        this.value += this.direction
        this.target
          ? (this.target -= this.direction)
          : this.value
          ? this.wander
            ? (this.target = this.newTarget())
            : (this.target = -this.value)
          : (this.target = this.newTarget())
        return this.direction
      }

      this.newTarget = function () {
        return Math.round(Math.random() * (this.radius * 2) - this.radius)
      }

      this.start = 0
      this.value = 0
      this.radius = options.radius
      this.target = this.newTarget()
      this.direction = Math.sign(this.target)
      this.wander = options.wander
      this.speed = options.speed || 1
    }
    if (new Date().getDate() > 21 && new Date().getDate() < 31) {
      this.show = true
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped type="text/scss">
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: pink;
  img {
    width: 100%;
    height: 100%;
  }
}

html,
body {
  padding: 0px;
  margin: 0px;
  background: #222;
  font-family: 'Karla', sans-serif;
  color: #fff;
  height: 100%;
  overflow: hidden;
}
h1 {
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  font-size: 58px;
  border: 2px solid #fff;
  padding: 7.5px 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  overflow: hidden;
}
span {
  position: relative;
  display: inline-block;
  animation: drop 0.75s;
}
canvas {
  width: 100%;
  height: 100%;
}

@keyframes drop {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }

  90% {
    opacity: 1;
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
