<template>
  <div class="view">
    <div class="title">炒饭版主介绍</div>
    <div>
      <div class="t_line"><a href="#a">什么是版主？</a></div>
      <div class="t_line"><a href="#b">如何当上版主？</a></div>
      <div class="t_line"><a href="#c">炒饭上有我想要的版块？</a></div>
      <div class="t_line"><a href="#d">版主有什么权利？</a></div>
      <div class="t_line"><a href="#e">版主的义务？</a></div>
      <div class="t_line"><a href="#f">版主功能入口？</a></div>
    </div>
    <div class="main">
      <a name="a"></a>
      <div class="c_title"># 什么是版主</div>
      <div class="c_content">一个版块的负责人，负责版块管理和运营的饭友</div>

      <a name="b"></a>
      <div class="c_title"># 如何当上版主</div>
      <div class="c_content">
        炒饭用户获赞达100赞以后添加 wwwchaofun 微信或者加入 QQ 群 784495660 申请
      </div>

      <a name="c"></a>
      <div class="c_title"># 炒饭上有我想要的版块</div>
      <div class="c_content">
        目前炒饭已有的版块：
        <ul class="flex_ul">
          <li v-for="(item, index) in listsData" :key="index">
            {{ item.name }}
          </li>
        </ul>
        如果想添加新的版块，获赞达 100 赞以后最新App私聊 cijianzy 即可
      </div>

      <a name="d"></a>
      <div class="c_title"># 版主有什么权利</div>
      <div class="c_content">
        <!-- 版主的权利： -->
        <ul type="circle" class="common_ul">
          <li>版块数据查看</li>
          <li>管理版块 样式、图标和描述</li>
          <li>删除版块内帖子</li>
          <li>炒饭分润: 根据每天版块活跃有少部分资金奖励</li>
          <li>推送通知：对关注版块的用户发送通知</li>
          <li>置顶帖子</li>
          <li>增加其他版块管理用户</li>
          <li>封禁用户</li>
          <li>给用户添加标签</li>
        </ul>
      </div>

      <a name="e"></a>
      <div class="c_title"># 版主的义务</div>
      <div class="c_content">
        <!-- 版主的义务： -->
        <ul type="circle" class="common_ul">
          <li>维持版块活跃</li>
          <li>维护版块内容的监控，移除不符合版规和炒饭规范的帖子</li>
          <li>如果有违违背道德或者版块管理不当，可能会被移除。</li>
        </ul>
      </div>

      <a name="f"></a>
      <div class="c_title"># 版主功能入口</div>
      <div class="c_content">
        <div class="ls">Web端版主功能入库--Web 版块页面右上角</div>
        <div>
          <img
            src="https://i.chao.fun/biz/d48b9daf9b762918274afda6ef544cd5.png"
            alt=""
          />
        </div>
        <div class="ls">App端版主功能入口--App 版块首页右上角</div>
        <div>
          <img
            style="width: 50%"
            src="https://i.chao.fun/biz/3ecffcc7d085359d23979f105ff34a08.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'

export default {
  name: 'Help',
  components: {},
  data() {
    return {
      listsData: [],
    }
  },
  created() {
    this.getLists()
  },
  mounted() {},
  methods: {
    getLists() {
      api.listForumsByTag({ tagId: '0' }).then((res) => {
        console.log(res)
        this.listsData = res.data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './doc.scss';
.container {
  padding-top: 0;
  // background: #f1f1f1;
}
.view {
  padding: 10px;
  padding-bottom: 100px;
}
</style>
