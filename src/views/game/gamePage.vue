<template>
  <div class="asd">
    <div class="aaa">
      <snake :datas="datas"></snake>
      <div class="right_content">
        <div class="rank">
          <div class="rank_title">
            <img src="../../assets/images/game/snake/rank.png" alt="" /> 排行榜
          </div>

          <div class="rank_items">
            <div
              v-for="(item, index) in gameRank"
              :key="index"
              class="rank_item"
            >
              <img
                v-if="index == 0"
                src="../../assets/images/game/snake/1.png"
                alt=""
              />
              <img
                v-if="index == 1"
                src="../../assets/images/game/snake/2.png"
                alt=""
              />
              <img
                v-if="index == 2"
                src="../../assets/images/game/snake/3.png"
                alt=""
              />
              <span class="mci" v-if="index > 2">{{ index + 1 }}</span>
              <div
                @click="
                  toUrl({ name: 'userhome', params: { id: item.userId } })
                "
                class="username"
              >
                {{ item.userName }}
              </div>
              <div class="score">{{ item.score }}分</div>
            </div>
          </div>
        </div>
        <div class="rules">
          <div style="color: #000; margin-bottom: 8px">活动说明：</div>
          <p>1、活动时间：2020/4/1 00:00-23:25;</p>
          <p>
            2、活动规则：活动当天，<span style="color: red">登录用户</span
            >玩游戏，取最高得分参与排名，前<span style="color: red">10</span
            >名可获得奖励哦~
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import snake from '@/components/game/snake/snake3.vue'
import * as api from '../../api/api'
export default {
  name: '',
  data() {
    return {
      gameRank: null,
      datas: {
        width: 780,
        height: 600,
        speeds: [150, 100, 70],
        data: {
          // 初始头位置
          x: 2,
          y: 2,
          size: 20, //大小
          timeout: 250, // 每隔多久刷新
        },
      },
    }
  },
  components: {
    snake,
  },
  created() {},
  mounted() {
    this.getGameTop()
  },
  methods: {
    getGameTop() {
      api.getGameTop({ top: 10 }).then((res) => {
        this.gameRank = res.data
      })
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.rank {
  padding: 10px;
  .rank_title {
    line-height: 38px;
    position: relative;
    img {
      width: 34px;
      vertical-align: middle;
    }
  }
  .rank_item {
    display: flex;
    padding: 8px 6px;
    border-bottom: 1px solid #f1f1f1;
    img {
      flex: 0 0 24px;
      width: 20px;
      height: 22px;
      vertical-align: middle;
      margin-right: 6px;
    }
    span.mci {
      width: 22px;
      height: 22px;
      display: inline-block;
      vertical-align: middle;
      background: #ccc;
      text-align: center;
      line-height: 22px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .username {
      flex: 1;
      cursor: pointer;
      &:hover {
        color: $linkcolor;
      }
    }
    .score {
      flex: 0 0 60px;
      text-align: right;
    }
  }
}
.rule {
  float: right;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    + .rules {
      display: block;
    }
  }
}
.rules {
  background: #fff;
  line-height: 20px;
  font-size: 14px;
  padding: 10px;
  margin-top: 10px;
  p {
    margin-bottom: 6px;
  }
}
.asd {
  width: 1070px;
  margin: 0 auto;
}
.aaa {
  display: flex;
  width: 800px;
  .right_content {
    background: #fff;
    flex: 0 0 270px;
  }
}
</style>
