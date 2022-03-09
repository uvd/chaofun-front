<template>
  <div @click.stop="" class="display prid">
    <div class="p_left">
      <div>
        <p v-if="item.predictionTotalTokens">
          总额：{{ item.predictionTotalTokens }}
        </p>
        <p>参与：{{ item.optionVoteCount }}人</p>
        <p>
          {{
            item.predictedTokens
              ? '我的：' + item.predictedTokens + ''
              : '未参与竞猜'
          }}
        </p>
        <p>
          {{
            item.predictedWins !== null
              ? ' 收益：' + item.predictedWins + ''
              : '收益：---'
          }}
        </p>
        <!-- <p>剩余积分：{{item.predictedTokens}}积分</p> -->
      </div>
    </div>

    <div v-if="!checkoutVote(item.options)" class="p_right">
      <div class="cent">
        {{ doState() }}
      </div>
      <div
        v-for="(its, ind) in item.options"
        :key="ind"
        @click.stop="chooseItem(its, ind)"
        :class="[
          'p_li',
          {
            acts:
              item.predictionStatus == 'end' &&
              item.predictionRightOption == ind + 1,
          },
        ]"
      >
        {{ its.optionName }}
      </div>
      <div v-if="!isPredictionPage" @click.stop="toMore" class="p_li p_li_btns">
        {{ item.predictionsTournament.name }}
      </div>
      <!-- <div class="icons">
              <img v-if="item.chooseOption==(ind+1)" src="../../../assets/images/icon/success.png" alt="">
            </div> -->
    </div>
    <div v-if="checkoutVote(item.options)" class="p_right p_right_2">
      <div class="cent">
        {{ doState() }}
      </div>
      <div
        v-for="(its, ind) in item.options"
        :key="ind"
        @click.stop="chooseItem(its, ind)"
        :class="[
          'p_li',
          {
            acts:
              item.predictionStatus == 'end' &&
              item.predictionRightOption == ind + 1,
          },
        ]"
      >
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
      <div v-if="!isPredictionPage" @click.stop="toMore" class="p_li p_li_btns">
        {{ item.predictionsTournament.name }}
      </div>
    </div>
    <new-dialog v-if="selectLine.optionName">
      <template v-slot:content>
        <div class="ts">
          <div @click="close" class="close el-icon-close"></div>
          <div class="tmain">
            <div class="t_title">
              <p>你选择了</p>
              <p>“ {{ selectLine.optionName }} ”</p>
            </div>
            <div class="desc">你的剩余积分：{{ userData.restTokens }}</div>
            <div class="counts">
              <div class="cc">
                <div
                  @click="dealNum('1')"
                  class="reduce el-icon-remove-outline"
                ></div>
                <input
                  @blur="blurs"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  onselectstart="return false;"
                  type="text"
                  class="nums"
                  v-model="nums"
                />
                <div
                  @click="dealNum('2')"
                  class="reduce el-icon-circle-plus-outline"
                ></div>
              </div>
            </div>
          </div>
          <div class="t_bottom">
            <div @click="sure" class="sure">确定</div>
          </div>
        </div>
      </template>
    </new-dialog>
  </div>
</template>

<script>
import * as api from '@/api/api'
import newDialog from '../../../layout/components/dialog/newDialog'
export default {
  name: '',
  data() {
    return {
      tokens: null,
      dialogVisible: false,
      nums: 10,
      userData: {},
      selectLine: {},
      ids: '',
    }
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
    isPredictionPage: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    newDialog,
  },
  created() {},
  mounted() {
    // this.getScore()
  },
  methods: {
    blurs() {
      if (this.nums > this.userData.restTokens) {
        this.nums = this.userData.restTokens
      }
    },
    doState() {
      switch (this.item.predictionStatus) {
        case 'live':
          return '竞猜进行中（下注中)'
          break
        case 'pause':
          return '比赛中（停止下注）'
          break
        case 'end':
          return '竞猜结束'
          break
      }
    },
    toMore() {
      this.$router.push('/f/' + this.item.forumId + '/predictions')
    },
    sure() {
      if (this.nums > 0) {
        let params = {
          postId: this.item.postId,
          option: this.ids + 1,
          tokens: this.nums,
        }
        api.toVote(params).then((res) => {
          if (res.success) {
            this.$toast('竞猜成功')
            this.selectLine = {}
            this.$EventBus.$emit('new-dialog', false)
            setTimeout(() => {
              api.getPostInfo({ postId: this.item.postId }).then((res) => {
                // this.item = res.data;
                this.$emit('callBack', this.index, res.data)
                this.$EventBus.$emit('eventRefresh')
              })
            }, 500)
          } else {
            this.$toast(res.errorMessage)
          }
        })
      }
    },
    getScore() {
      let params = {
        predictionsTournamentId: this.item.predictionsTournament.id,
      }
      api.checkJoin(params).then((res) => {
        if (!res.data) {
          this.$alert(
            '你确定要参加本次竞猜吗',
            '参加本次竞猜默认会给你本次竞猜1000积分，只作用于本次有奖竞猜活动',
            {
              confirmButtonText: '确定',
              callback: (action) => {
                if (action == 'confirm') {
                  // this.toSetTokens(item, index);
                  api.predictionsjoin(params).then((res) => {
                    this.getScore()
                  })
                }
              },
            }
          )
        } else {
          this.userData = res.data
          console.log(this.userData)
          console.log(this.selectLine)
          setTimeout(() => {
            this.$EventBus.$emit('new-dialog', true)
          })
        }
      })
    },
    dealNum(v) {
      if (v == 1) {
        if (this.nums - 10 > 0) {
          this.nums -= 10
        } else {
          this.nums = 0
        }
      } else {
        if (
          parseInt(this.nums) + 10 < this.userData.restTokens ||
          parseInt(this.nums) + 10 == this.userData.restTokens
        ) {
          this.nums = parseInt(this.nums) + 10
        } else {
          //  this.nums = 0;
        }
      }
    },
    chooseItem(v, vs) {
      if (this.item.predictionStatus === 'pause') {
        this.$confirm(`是否确定标记【${v.optionName}】正确 ？`, '提示', {
          type: 'warning',
          // position: center,
        }).then(() => {
          let params = { postId: this.item.postId, option: vs + 1 }
          api.markPredictionRight(params).then((r) => {
            api.getPostInfo({ postId: this.item.postId }).then((res) => {
              // this.item = res.data;
              this.$emit('callBack', this.index, res.data)
              this.$EventBus.$emit('eventRefresh')
            })
          })
        })
      } else if (
        !this.checkoutVote(this.item.options) &&
        this.item.predictionStatus !== 'end'
      ) {
        console.log(v, vs)
        this.ids = vs
        this.selectLine = v
        this.doLoginStatus().then((r) => {
          if (r) {
            if (this.item.predictionStatus == 'live') {
              setTimeout(() => {
                this.getScore()
              })
            }
          }
        })
      }
    },
    close() {
      this.selectLine = {}
      this.$EventBus.$emit('new-dialog', false)
    },
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
      console.log(it)
      //  var num = it.optionVote;
      //  var total = 0;
      //  its.forEach(item=>{
      //    //  if(item.optionVote){
      //    total += item.optionVote*1;
      //    //  }
      //  })
      return it.width.toFixed(2) + '%'
    },
    toPredictionsTournament(id) {
      this.$toast('还未支持跳转')
    },

    toPredict(item, index) {
      this.doLoginStatus().then((r) => {
        if (r) {
          this.checkJoin(item, index)
        }
      })
    },

    joinConfirm(item, index) {
      this.$alert(
        '默认会给你本次竞猜活动「1000」积分，只作用于本次有奖竞猜活动(一个活动有多个竞猜)，本次竞猜活动积分不能兑换任何实物,只用于排名。你确定要参加本次竞猜活动?',
        '参加本次竞猜活动？',
        {
          confirmButtonText: '确定',
          callback: (action) => {
            if (action == 'confirm') {
              api
                .joinPredictionsTournament({
                  predictionsTournamentId: item.predictionsTournament.id,
                })
                .then((res) => {
                  this.checkJoin(item, index)
                })
            }
          },
        }
      )
    },

    checkJoin(item, index) {
      api
        .checkJoinTournament({
          predictionsTournamentId: item.predictionsTournament.id,
        })
        .then((res) => {
          console.log('get checkJoinTournament')
          console.log(res)
          // 如果参加了，直接设置竞猜金额
          if (res.data !== null) {
            this.toSetTokens(item, index, res.data)
          } else {
            this.joinConfirm(item, index)
          }
        })
    },

    toSetTokens(item, index, data) {
      this.$prompt(
        '请输入下注积分, 本次活动剩余积分: ' + data.restTokens,
        '下注',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入',
          inputPattern: /[0-9]/,
          inputErrorMessage: '必须是数字',
        }
      )
        .then(({ value }) => {
          this.toToup(item, index, value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入',
          })
        })
    },

    toToup(item, index, value) {
      // 这里的 Tokens 就是竞猜积分
      api
        .toVote({
          postId: item.postId,
          option: item.chooseOption,
          tokens: value,
        })
        .then((res) => {
          api.getPostInfo({ postId: item.postId }).then((res) => {
            this.item = res.data
            this.$emit('callBack', index, res.data)
            this.$EventBus.$emit('eventRefresh')
            // this.lists.splice(index,1,res.data)
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.cent {
  text-align: center;
  color: #fff;
  margin-bottom: 30px;
}
.prid {
  background: #303030;
  min-height: 300px;
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .p_left {
    // display: flex;
    align-items: flex-start;
    justify-content: space-around;
    background: #666;
    width: 0 0 28%;
    max-width: 144px;
    min-width: 80px;
    box-sizing: border-box;
    // display: grid;
    padding: 6px;
    border-radius: 8px;
    // margin-right: 40px;
    color: #fff;
    // line-height: 40px;

    margin-right: 6%;
    div {
      width: 100%;
    }
    p {
      font-size: 14px;
      width: 100%;
      overflow: hidden;
      margin: 20px 0 20px;
      white-space: nowrap;
      overflow: hidden;
      // text-overflow:ellipsis;
    }
    .p_title {
      color: #fff;
      // line-height: 28px;

      font-size: 18px;
    }
  }
  .p_right {
    flex: 1;
    .p_li {
      line-height: 38px;
      border-radius: 20px;
      font-size: 16px;
      text-align: center;
      color: #fff;
      border: 1px solid #fff;
      margin-bottom: 16px;
      &:hover {
        background: rgba(102, 102, 102, 0.7);
      }
    }
  }
  .acts {
    border: 1px solid #46d160 !important;
    // background: #46d160;
    &:hover {
      // background: #46d160;
    }
  }
  .p_right_2 {
    .p_li {
      // text-align: left;
      display: flex;
      position: relative;
      .bg {
        position: absolute;
        background: #666;
        width: 50%;
        left: 1px;
        top: 1px;
        bottom: 1px;
        border-radius: 30px;
      }
      .b {
        position: relative;
        z-index: 1;
        // padding: 0 10px;
        display: flex;
        width: 100%;
        // padding: 4px 10px;
        // min-height: 40px;
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
      .icons {
        img {
          margin-right: 10px;
          vertical-align: middle;
        }
      }
    }
  }
}
.ts {
  width: 375px;
  height: 320px;
  background: #fff;
  position: relative;
  margin-top: -100px;
  border-radius: 8px;
  padding: 50px 30px 20px;
  box-sizing: border-box;
  .tmain {
    text-align: center;

    .t_title {
      font-size: 18px;
      line-height: 30px;
    }
    .desc {
      margin: 10px 0;
      color: #666;
      font-size: 15px;
    }
    .counts {
      padding: 20px 0;
    }
    .nums {
      display: inline-block;
      cursor: pointer;
      width: 80px;
      text-align: center;
      background: #f1f1f1;
      border-radius: 20px;
      line-height: 44px;
      margin: 0 10px;
      vertical-align: middle;
      text-align: center;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webKit 浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*低版本浏览器*/
      user-select: none;
    }
    .reduce {
      font-size: 44px;
      vertical-align: middle;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webKit 浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*低版本浏览器*/
      user-select: none;
    }
  }
  .sure {
    background: linear-gradient(90deg, #ec0623 0, #ff8717);
    line-height: 44px;
    text-align: center;
    border-radius: 24px;
    margin-top: 20px;
    font-size: 16px;
    color: #fff;
  }
  .close {
    font-size: 28px;
    color: #999;
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
.p_li_btns {
  background: #ff8717;
  margin-top: 30px;
  margin: 30px auto;
  text-align: center !important;
  display: block !important;
}
.el-dialog {
  z-index: 3000;
}
</style>

<style lang="scss">
.el-message-box {
  width: 90vw;
  max-width: 400px;
}
</style>
