<template>
  <div class="nkl">
    <div class="c_top_nav">
      <div
        v-for="(item, index) in options"
        @click="chooseNav(index, item)"
        :key="index"
        :class="[
          'c_nav_item',
          { c_nav_item_active: params.order == item.value },
        ]"
      >
        <img
          v-show="index == 0"
          class="img1"
          src="../../../assets/newicon/new.png"
          alt=""
        />
        <img
          v-show="index == 0"
          class="img2"
          src="../../../assets/newicon/new_a.png"
          alt=""
        />

        <img
          v-show="index == 1"
          class="img1"
          src="../../../assets/newicon/hot.png"
          alt=""
        />
        <img
          v-show="index == 1"
          class="img2"
          src="../../../assets/newicon/hot_a.png"
          alt=""
        />

        <img
          v-show="index == 2"
          class="img1"
          src="../../../assets/newicon/comment.png"
          alt=""
        />
        <img
          v-show="index == 2"
          class="img2"
          src="../../../assets/newicon/comment_a.png"
          alt=""
        />

        <img
          v-show="index == 3"
          class="img1"
          src="../../../assets/newicon/up.png"
          alt=""
        />
        <img
          v-show="index == 3"
          class="img2"
          src="../../../assets/newicon/up_a.png"
          alt=""
        />
        {{ item.label }}
      </div>
      <div v-if="!ISPHONE && params.order === 'ups'" class="ups">
        <div class="curs">{{ doRange() }}</div>
        <div class="curs_list">
          <div
            v-for="item in ranges"
            :key="item.value"
            class="curs_item"
            @click="chooseRange(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <!-- <el-select v-if="!ISPHONE&&params.order ==='ups'" v-model="params.range" placeholder="请选择"
                      @change="changes" style="padding: 0px 20px; ">
              <el-option
                  v-for="item in ranges"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select> -->

      <div style="flex: 1; text-align: right">
        <div
          v-if="!ISPHONE"
          @click="checkoutOk"
          :class="['c_nav_item_t', params.onlyNew ? 'oks' : '']"
        >
          没看过
        </div>
        <img
          v-show="$store.state.user.listMode == 'normal'"
          title="扩展视图"
          @click="checkoutMode('simple')"
          class="mode_icon"
          src="../../../assets/images/icon/mode_2.png"
          alt=""
        />
        <!-- <img v-show="$store.state.user.listMode=='simple'" title="缩略视图" @click="checkoutMode('simple')" class="mode_icon" src="../../../assets/images/icon/mode_list2.png" alt=""> -->
        <img
          v-show="$store.state.user.listMode == 'simple'"
          title="缩略视图"
          @click="checkoutMode('normal')"
          class="mode_icon"
          src="../../../assets/images/icon/mode_1.png"
          alt=""
        />
        <!-- <img v-show="$store.state.user.listMode=='normal'" title="扩展视图" @click="checkoutMode('normal')" class="mode_icon" src="../../../assets/images/icon/mode_normal2.png" alt=""> -->
      </div>
    </div>
    <div v-if="ISPHONE" style="padding: 0px; display: flex" class="phones">
      <div v-if="params.order === 'ups'" style="width: 120px">
        <el-select
          v-model="params.range"
          placeholder="请选择"
          @change="changes"
          style="padding: 0px; width: 100%"
        >
          <el-option
            v-for="item in ranges"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div
        @click="checkoutOk"
        :class="['c_nav_item_t', params.onlyNew ? 'oks' : '']"
      >
        没看过
      </div>
      <div class="search_icon">
        <el-icon><el-icon-search /></el-icon>
        <el-input
          class="search_input"
          placeholder="搜索"
          :prefix-icon="ElIconSearch"
          @change="toSearch(keyword)"
          v-model="keyword"
        >
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { Search as ElIconSearch } from '@element-plus/icons'
export default {
  data() {
    return {
      upsData: {},
      options: [
        {
          label: '最新',
          value: 'new',
          choose: true,
        },
        {
          label: '最热',
          value: 'hot',
          choose: false,
        },
        {
          label: '新评',
          value: 'comment',
          choose: false,
        },
        {
          label: '最赞',
          value: 'ups',
          choose: false,
        },
      ],
      ranges: [
        {
          label: '现在',
          value: '1hour',
        },
        {
          label: '一天',
          value: '1day',
        },
        {
          label: '一周',
          value: '1week',
        },
        {
          label: '一个月',
          value: '1month',
        },
        {
          label: '一年',
          value: '1year',
        },
        {
          label: '全部',
          value: 'all',
        },
      ],
      keyword: '',
      ElIconSearch,
    }
  },
  components: {
    ElIconSearch,
  },
  name: '',
  props: {
    params: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  created() {},
  mounted() {
    this.keyword = this.$route.query.q
  },
  methods: {
    doRange() {
      let range = this.ranges.find((item) => item.value == this.params.range)
      return range.label
    },
    checkoutMode(v) {
      this.$store.dispatch('user/SET_listMode', v)
    },
    changes() {
      localStorage.setItem('chao.fun.timeline.order', this.params.order)
      localStorage.setItem('chao.fun.timeline.range', this.params.range)
      delete this.params.marker
      delete this.params.key
      this.$emit('updateList', this.params)
    },
    chooseRange(item) {
      this.params.range = item.value
      localStorage.setItem('chao.fun.timeline.order', this.params.order)
      localStorage.setItem('chao.fun.timeline.range', this.params.range)
      delete this.params.marker
      delete this.params.key
      this.$emit('updateList', this.params)
    },
    checkoutOk() {
      this.doLoginStatus().then((res) => {
        if (res) {
          delete this.params.marker
          delete this.params.key
          this.params.onlyNew = !this.params.onlyNew
          localStorage.setItem('onlyNew', this.params.onlyNew)
          console.log(this.params)
          this.$emit('updateList', this.params)
        }
      })
    },
    chooseNav(index, item) {
      this.options.forEach((i) => {
        i.choose = false
      })
      item.choose = true
      this.options.splice(index, 1, item)
      localStorage.setItem('chao.fun.timeline.order', item.value)
      localStorage.setItem('chao.fun.timeline.range', this.params.range)
      delete this.params.marker
      delete this.params.key
      this.params.order = item.value
      this.$emit('updateList', this.params)
      // this.lists = []
      // this.getLists();
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.phones {
  height: 34px;
  text-align: left;
  margin: 10px;
  .search_icon {
    flex: auto;
    font-size: 24px;
    // margin-right: 10px;
    position: relative;
    z-index: 1;
    width: 100px;
    /*margin-left: 40px;*/

    .search_input {
      position: absolute;
      top: 0;
      width: 100%;
      right: 0;
    }
  }
}
.mode_icon {
  width: 26px;
  margin-right: 10px;
  cursor: pointer;
  vertical-align: middle;
}
@media (max-width: 374px) {
  .c_top_nav .c_nav_item {
    // padding: 4px 8px;
    padding: 4px 2px;
    background: none;
    // flex: 1;
  }
}
.c_nav_item_t {
  display: inline-block;
  margin-left: 10px;
  background: #eeeff1;
  border-radius: 4px;
  line-height: 34px;
  width: 60px;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  margin-right: 10px;
}
.oks {
  background: rgba(22, 103, 159, 1);
  color: #fff;
}
.ups {
  position: relative;
  margin-left: 10px;
  .curs {
    line-height: 34px;
    width: 100px;
    text-align: center;
    border: 1px solid #eee;
    border-radius: 4px;
    cursor: pointer;
  }
  .curs_list {
    display: none;
    position: absolute;
    left: 0px;
    top: 34px;
    width: 100px;
    // height: 180px;
    background: #fff;
    z-index: 10;
    border-radius: 4px;
    border: 1px solid #f1f1f1;
    padding: 4px 0;
    .curs_item {
      cursor: pointer;
      line-height: 34px;
      text-align: center;
      &:hover {
        color: #16679f;
        font-weight: bold;
      }
    }
  }
  &:hover {
    .curs_list {
      display: block;
    }
  }
}
/deep/ .el-select-dropdown__item {
  text-align: center;
}
</style>
