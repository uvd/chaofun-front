<template>
  <div>
    <div :class="['item_video', { phone_v: ISPHONE }]">
      <!-- <div class="title">
          {{ item.title }}
        </div> -->
      <div :id="'video' + item.postId" class="video">
        <video
          :class="[doHeight()]"
          :autoplay="true"
          muted
          webkit-playsinline="true"
          x5-video-player-type="h5"
          playsinline="true"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
          controls
          :src="imgOrigin + item.video"
          alt=""
        ></video>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
export default {
  name: '',
  data() {
    return {
      handle: '',
    }
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  mounted() {
    if (document.getElementById('container')) {
      let self = this
      document
        .getElementById('container')
        .addEventListener('scroll', self.handlerScroll)
    }
  },
  destroyed() {
    let self = this
    if (document.getElementById('container')) {
      document
        .getElementById('container')
        .removeEventListener('scroll', self.handlerScroll, false)
    }
  },
  methods: {
    handlerScroll(e) {
      var el = document.getElementById('video' + this.item.postId)
      if (el) {
        var top = el.getBoundingClientRect().top
        if (top < -50) {
          if (!this.isDetail) {
            this.$emit('toPause', '', this.item, 0)
          }
        }
      } else {
        console.log('取消滚动监听------------------')
        let self = this
        document
          .getElementById('container')
          .removeEventListener('scroll', self.handlerScroll, false)
      }
    },
    unloadHandler(e) {},
    doHeight() {
      if (this.isDetail) {
        if (this.ISPHONE) {
          return 'video3'
        } else {
          return 'video2'
        }
      } else {
        return ''
      }
    },
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.item_video {
  .title {
    padding: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
  }
  .video {
    text-align: center;
    // width: 640px;
    max-height: 512px;
    overflow-y: hidden;
    video {
      width: 100%;
      height: 320px;
      background: #000;
      margin: 0 auto;
    }
    .video2 {
      height: 440px;
    }
    .video3 {
      height: 290px;
    }
  }
}
.phone_v {
  .video {
    video {
      height: 230px;
    }
  }
}
</style>
