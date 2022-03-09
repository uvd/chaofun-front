<template>
  <div>
    <div class="item_video">
      <!-- <div @click="toDetail" class="title">
              {{item.title}}
          </div> -->
      <div :id="'video' + item.postId" class="video">
        <video
          :class="['compatibleStyle', isDetail ? 'video2' : '']"
          webkit-playsinline="true"
          x-webkit-airplay="true"
          playsinline="true"
          x5-video-player-type="h5"
          x5-video-orientation="h5"
          x5-video-player-fullscreen="true"
          controls
          autoplay
          loop
          muted
          :src="imgOrigin + item.imageName"
          alt=""
        ></video>
        <!-- <img v-if="showCover" :class="[isDetail?'video2':'']" :src="item.cover" alt=""> -->
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
      showCover: false,
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
  created() {},
  mounted() {
    if (this.ISPHONE && document.getElementById('container')) {
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
      let that = this
      var el = document.getElementById('video' + this.item.postId)
      if (el) {
        var top = el.getBoundingClientRect().top

        if (top < -50) {
          if (!this.isDetail) {
            this.$emit('toPause', '', this.item, 0)
            // that.showCover = true;
            // this.showCover = true;
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
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
    toDetail() {
      if (!this.isDetail) {
        this.$emit('toDetail', this.item)
      }
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.item_video {
  position: relative;
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
    position: relative;
    video {
      width: 100%;
      height: 300px;
      background: #000;
      margin: 0 auto;
    }
    .video2 {
      height: 512px;
    }
  }
}

@media screen and (max-width: 700px) {
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
      height: 230px;
      overflow-y: hidden;
      video {
        width: 100%;
        height: 230px;
        background: #000;
        margin: 0 auto;
        display: inline-block;
      }
      .video2 {
        height: 230px;
      }
    }
  }
}
.compatibleStyle {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Chrome 和 Safari */
  -moz-backface-visibility: hidden; /* Firefox */
  -ms-backface-visibility: hidden; /* Internet Explorer */
  -webkit-perspective: 0;
  -webkit-transform: translate3d(0, 0, 0);
  visibility: visible;
}
</style>
