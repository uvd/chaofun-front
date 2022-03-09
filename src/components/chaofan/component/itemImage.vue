<template>
  <div>
    <div
      v-if="item.type == 'image'"
      :class="['item_image', { item_image_de: isDetail }]"
    >
      <div
        @click.stop=""
        v-if="item.imageNums == 1"
        class="imgs"
        style="position: relative; overflow: hidden"
      >
        <viewer :images="[imgOrigin + item.imageName]">
          <img
            :data-src="imgOrigin + item.imageName"
            :data-source="imgOrigin + item.imageName"
            v-if="isDetail"
            :style="doImgStyle(item.width, item.height)"
            :alt="item.title"
            :title="item.title"
            class="lazyload"
          />
          <img
            :data-src="dealImageUrl(imgOrigin + item.imageName, item)"
            :data-source="imgOrigin + item.imageName"
            v-if="!isDetail"
            :style="doImgStyle(item.width, item.height)"
            :alt="item.title"
            :title="item.title"
            class="lazyload"
          />
        </viewer>
        <div
          @click="toPost(item)"
          v-if="!isDetail && isLongImage(item.width, item.height)"
          style="
            position: absolute;
            background-color: rgba(80, 85, 87, 0.8);
            color: white;
            transform: translateX(-50%);
            line-height: 32px;
            font-size: 12px;
            font-weight: 700;
            left: 50%;
            width: 320px;
            bottom: 16px;
          "
        >
          查看长图
        </div>
      </div>
      <div @click.stop="" v-if="item.imageNums != 1" class="imgLists">
        <viewer :images="item.o_imgs">
          <div
            v-for="(item2, index2) in item.images"
            :key="index2"
            :class="doImgClass(item.images)"
            :style="doMoreImgStyle(item, item2)"
            :alt="item.title.includes('/') ? '' : item.title"
            :title="item.title.includes('/') ? '' : item.title"
          >
            <img
              style="opacity: 0; width: 100%; height: 100%"
              :data-source="imgOrigin + item2"
              :data-src="
                imgOrigin +
                item2 +
                (item2.includes('.gif')
                  ? ''
                  : '?x-oss-process=image/resize,h_512/format,webp/quality,q_75')
              "
              :key="item2"
              :alt="item.title.includes('/') ? '' : item.title"
              :title="item.title.includes('/') ? '' : item.title"
              class="lazyload"
            />
          </div>
        </viewer>
      </div>
    </div>
  </div>
</template>

<script>
import 'lazysizes'
import * as api from '@/api/api'
export default {
  name: '',
  data() {
    return {
      longImage: null,
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
    isindex: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  created() {
    var o_imgs = []
    if (this.item.imageNums > 1) {
      this.item.images.forEach((item) => {
        if (!item.includes('.gif')) {
          o_imgs.push(
            this.imgOrigin +
              item +
              '?x-oss-process=image/resize,h_512/format,webp/quality,q_75'
          )
        }
      })
    }
    this.item.o_imgs = o_imgs
  },
  mounted() {},
  methods: {
    isLongImage(w, h) {
      if (this.longImage === null) {
        if (h && w && h / w > 2.5) {
          this.longImage = true
        } else {
          this.longImage = false
        }
      }
      return this.longImage
    },

    dealImageUrl(url, item) {
      if (this.isDetail) {
        return url
      }
      if (this.isLongImage(item.width, item.height)) {
        return (
          url +
          '?x-oss-process=image/crop,h_' +
          parseInt((512 * item.width) / 568)
        )
      }
      return url + '?x-oss-process=image/resize,h_512/format,webp/quality,q_75'
    },
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
    doImgClass(imgs) {
      if (imgs.length == 2 || imgs.length == 4) {
        return 'two_img'
      } else {
        return 'three_img'
      }
    },
    doMoreImgStyle(item, item2) {
      return {
        // 'width':
        height:
          parseInt(
            this.ISPHONE
              ? (231 * item.height) / (item.width * 2)
              : (231 * item.height) / item.width
          ) + 'px',
        'background-image': `url(${
          this.imgOrigin +
          item2 +
          (item2.includes('.gif')
            ? ''
            : '?x-oss-process=image/resize,h_' +
              (item.imageNums == 2 ? 750 : 400) +
              '/format,webp/quality,q_75')
        }) `, //parseInt((this.ISPHONE?(231*item.height/(item.width)):(231*item.height/item.width)))
      }
    },
    getImageHeight(w, h) {
      if (this.isDetail) {
        if (w < h && h > 512) {
          return '512'
        } else {
          return h == null ? '512' : Math.min(Math.ceil(h), 512).toString()
        }
      } else {
        if (w < h && h > 512) {
          let num
          if (this.ISPHONE) {
            num = '375'
          } else {
            num = '512'
          }
          return '512'
        } else {
          let num
          if (this.ISPHONE) {
            num = '375'
          } else {
            num = '512'
          }
          return h == null ? num : Math.min(Math.ceil(h), num).toString()
        }
      }
    },
    doImgStyle(w, h, type) {
      if (document.body.clientWidth < 700) {
        // 适配移动端, 这里后续尽量封装成组件
        const temp = Math.ceil(document.body.clientWidth * 0.85)
        if (w < h && h > temp) {
          return {
            height: this.imgMaxWidth + 'px',
          }
        } else {
          return {}
        }
      } else {
        if (this.isDetail) {
          if (!this.isLongImage(w, h)) {
            return {
              maxHeight: '700px',
            }
          } else {
            return {
              width: '350px',
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
      }
    },
    toPost(item) {
      if (!this.isDetail) {
        this.$emit('toDetail', item)
      }
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.item_image {
  // padding: 0 10px;
  width: 100%;
  .title {
    padding: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
  }
  .imgs {
    text-align: center;
    // width: 640px;
    //max-height: 512px;
    overflow-y: hidden;
    img {
      max-width: 100%;
      margin: 0 auto;
      // max-height: 100%;
      border-radius: 4px;
    }
  }
}
.item_image_de {
  width: 100%;
  .imgs {
    border-radius: 10px;
  }
}
.imgLists {
  display: flex;
  flex-flow: wrap;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .two_img {
    flex: 0 0 48%;
    margin: 1px;
    min-height: 120px;
    max-height: 450px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #f7f7f7;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 4px;
  }
  .three_img {
    flex: 0 0 33%;
    margin-top: 2px;
    margin-right: 0.5%;
    min-height: 120px;
    max-height: 300px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #f7f7f7;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 4px;
  }
}
.imgLists {
  display: flex;
  flex-flow: wrap;
  margin-bottom: 4px;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .two_img {
    flex: 0 0 48%;
    margin: 1px;
    max-height: 450px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #f7f7f7;
    height: 300px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .three_img {
    flex: 0 0 32.5%;
    margin-top: 2px;
    margin-right: 0.5%;
    max-height: 300px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #f7f7f7;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
}
.imgLists > div {
  width: 100%;
  display: flex;
  flex-flow: wrap;
}
</style>
