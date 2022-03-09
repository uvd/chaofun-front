<template>
  <div>
    <div class="item_article">
      <!-- <div class="title">
          {{item.title}}
          </div> -->
      <div @click.stop="" :class="['vote']">
        <div class="vote_header">
          <div>投票：{{ item.optionVoteCount }}人</div>
          <div>围观：{{ item.circuseeCount }}人</div>
        </div>
        <div v-if="!checkoutVote(item.options)">
          <el-radio-group style="width: 100%" v-model="item.chooseOption">
            <el-radio
              v-for="(its, ind) in item.options"
              :key="ind"
              class="radio_item"
              :label="ind + 1"
              >{{ its.optionName }}</el-radio
            >
          </el-radio-group>
        </div>
        <div v-if="checkoutVote(item.options)" class="has_choose">
          <div v-for="(its, ind) in item.options" :key="ind" class="a">
            <div class="bg" :style="{ width: doBg(its, item.options) }"></div>
            <div class="b">
              <div class="c">
                <span>{{ its.optionVote }}</span> {{ its.optionName }}
              </div>
              <div class="icons">
                <img
                  v-if="item.chooseOption == ind + 1"
                  src="../../../assets/images/icon/success.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="!checkoutVote(item.options)" class="vote_bottom">
          <div @click="toToup(item, index)" class="toup">投票</div>
          <div @click="circusee(item, index)" class="weig">围观</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    checkoutVote(list) {
      var a = false
      list.forEach((item) => {
        if (item.optionVote) {
          a = true
        }
      })
      return a
    },
    doBg(it, its) {
      var num = it.optionVote
      var total = 0
      its.forEach((item) => {
        //  if(item.optionVote){
        total += item.optionVote * 1
        //  }
      })
      return ((num * 100) / total).toFixed(2) + '%'
    },
    toToup(item, index) {
      this.doLoginStatus().then((r) => {
        if (r) {
          console.log(item.chooseOption)
          api
            .toVote({ postId: item.postId, option: item.chooseOption })
            .then((res) => {
              api.getPostInfo({ postId: item.postId }).then((res) => {
                this.item = res.data
                this.$emit('callBack', index, res.data)
                this.$EventBus.$emit('eventRefresh')
                // this.lists.splice(index,1,res.data)
              })
            })
        }
      })
    },
    circusee(item, index) {
      this.doLoginStatus().then((r) => {
        if (r) {
          api.circusee({ postId: item.postId }).then((res) => {
            api.getPostInfo({ postId: item.postId }).then((res) => {
              this.item = res.data
              this.$emit('callBack', index, res.data)
              // this.lists.splice(index,1,res.data)
            })
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.title {
  padding: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
}
.vote {
  padding-bottom: 12px !important;
}
.vote_header {
  display: flex;
  div {
    flex: 0 0 150px;
    line-height: 34px;
    // background: #ddd;
    font-size: 14px;
    color: #999;
  }
}
.radio_item {
  padding: 10px 0 8px !important;
  width: 100%;
  box-sizing: border-box;
  display: block;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 22px;
  // background: #f1f1f1;
  // border-bottom: 1px solid #f1f1f1;
}
.el-radio {
  width: 100%;
}
.vote_bottom {
  display: flex;
  margin-top: 20px !important;
  .toup,
  .weig {
    flex: 0 0 100px;
    line-height: 34px;
    margin-right: 20px;
    border: 1px solid #ddd;
    text-align: center;
    border-radius: 4px;
  }
  .toup {
    background: #07c160;
    color: #fff;
  }
}
.has_choose {
  .a {
    width: 100%;
    // line-height: 40px;
    border: 1px solid #f1f1f1;
    margin-bottom: 8px;
    position: relative;
    border-radius: 4px;
    .bg {
      position: absolute;
      background: #ffbc5d;
      width: 50%;
      left: 0;
      top: 0;
      bottom: 0;
    }
    .b {
      position: relative;
      z-index: 1;
      padding: 0 10px;
      display: flex;
      width: 100%;
      padding: 4px 10px;
      min-height: 40px;
      .c {
        align-items: center;
        flex: 1;
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          width: 30px;
          font-weight: bold;
          text-align: center;
        }
      }
      .img {
        flex: 0 0 40px;
        text-align: center;
        vertical-align: middle;
      }
    }
  }
}
.icons {
  img {
    vertical-align: middle;
  }
}
</style>
