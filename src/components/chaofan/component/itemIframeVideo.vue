<template>
  <div>
    <div class="item_video">
      <!-- <div class="title">
              {{item.title}}
          </div> -->
      <div @click.stop="" class="video">
        <img
          v-if="!item.play && item.cover"
          class="coverss"
          @click="playVideo(index, item, 0)"
          :src="
            imgOrigin +
            item.cover +
            '?x-oss-process=image/resize,h_256/format,webp/quality,q_75'
          "
          alt=""
        />
        <img
          v-if="!item.play && !item.cover"
          class="coverss"
          @click="playVideo(index, item, 0)"
          src="../../../assets/images/bg/videocover.jpg"
          alt=""
        />
        <img
          v-if="!item.play"
          class="btn_play"
          @click="playVideo(index, item, 0)"
          src="../../../assets/images/bg/play.png"
          alt=""
        />
        <iframe
          v-if="!ISPHONE && item.play"
          style="width: 100%; min-height: 370px"
          :src="
            item.video +
            (item.link.includes('www.acfun.cn') ? '?' : '') +
            '&autoplay=true'
          "
          allow="autoplay"
          id="ACPlayer-re"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
        ></iframe>
        <iframe
          v-if="ISPHONE && item.play"
          style="width: 100%; height: 230px"
          :src="
            item.video +
            (item.link.includes('www.acfun.cn') ? '?' : '') +
            '&autoplay=true'
          "
          allow="autoplay"
          id="ACPlayer-re"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
        ></iframe>
      </div>
    </div>
    <!-- <div v-if="item.type == 'video'&&item.videoType == 'ifram'&&(!ISPHONE||!item.link.includes('www.acfun.cn'))" class="item_video">
          <div class="title">
          {{item.title}}
          </div>
          <div class="video">
          <iframe v-if="!ISPHONE" style="width: 100%; height: 500px"   :src="item.video" id="ACPlayer-re"  scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
          <iframe v-if="ISPHONE" style="width: 100%;height: 230px"   :src="item.video" id="ACPlayer-re"  scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
          </div>
      </div> -->
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
    lists: {
      type: Array,
      default() {
        return []
      },
    },
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    index: {
      type: Number,
      default: 1,
    },
    isindex: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
    playVideo(index, item, t) {
      this.lists.forEach((i) => {
        i.play = false
      })
      item.play = true
      var i = this.lists[index]
      if (t) {
        i.sourcePost = item
      } else {
        i = item
      }
      this.lists.splice(index, 1, i)
      if (item.type == 'video') {
        //  document.getElementById('ACPlayer-re').click();
      }
    },
    doImgStyle(w, h, type) {
      if (document.body.clientWidth < 700) {
        // 适配移动端, 这里后续尽量封装成组件
        const temp = Math.ceil(document.body.clientWidth * 0.85)
        if (type == 'video') {
          return {
            height: '235px',
          }
        } else {
          if (w < h && h > temp) {
            return {
              height: this.imgMaxWidth + 'px',
            }
          } else {
            return {}
          }
        }
      } else {
        if (w < h && h > 512) {
          return {
            height: '512px',
          }
        } else {
          return {}
        }
      }
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
</style>
