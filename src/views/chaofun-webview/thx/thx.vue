<template>
  <div style="padding-left: 10px; padding-right: 10px">
    <div style="font-size: 20px">贡献过代码的饭友</div>
    <div
      style="padding-top: 4px; border-bottom-width: 1px; border-color: black"
      @click="toUser(59155)"
    >
      <p style="font-size: 16px">感谢 @aolihui</p>
      在网页搜索上做出的贡献
    </div>
    <div style="height: 1px; width: 100%; background-color: black"></div>
    <div
      style="padding-top: 4px; border-bottom-width: 1px; border-color: black"
      @click="toUser(53573)"
    >
      <p style="font-size: 16px">感谢 @jlin</p>
      在小程序样式上做的贡献
    </div>
    <div style="height: 1px; width: 100%; background-color: black"></div>
    <div
      style="padding-top: 4px; border-bottom-width: 1px; border-color: black"
      @click="toUser(50777)"
    >
      <p style="font-size: 16px">感谢 @匿名用户cf</p>
      在漏洞发现, Web 帖子评论交互，发帖，管理页面上做出的贡献
    </div>
    <div style="height: 1px; width: 100%; background-color: black"></div>
    <div style="padding-top: 4px" @click="toUser(53906)">
      <p style="font-size: 16px">感谢 @猫</p>
      在导航栏样式、发帖，评论&工程结构上做的优化
    </div>
    <div style="height: 1px; width: 100%; background-color: black"></div>
    <div style="padding-top: 4px" @click="toUser(56018)">
      <p style="font-size: 16px">感谢 @阿鲤</p>
      在图片处理，水印处理上做的贡献
    </div>
    <div style="height: 1px; width: 100%; background-color: black"></div>

    <el-button @click="toGithub()">
      关注炒饭Github(需网络优化才能访问)
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'thx',
  methods: {
    toUser(userId) {
      try {
        window.flutter_inappwebview.callHandler('toAppUser', {
          userId: userId + '',
        })
      } catch (e) {
        window.open(location.origin + '/user/' + userId, '_blank')
      }
    },

    toGithub() {
      window.open('https://github.com/www-chao-fun/', '_blank')
    },
  },
}
</script>

<style scoped></style>
