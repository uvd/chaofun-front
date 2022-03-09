<template>
  <div>
    <div v-if="!isDetail" class="item_article">
      <!-- <div class="title">
          {{item.title}}
        </div> -->
      <div :class="['article', { article_phone: ISPHONE }]">
        <div
          v-html="filterContent(item.article.replace(/\n/g, ''))"
          v-if="/<[^>]+>/g.test(item.article)"
        ></div>
        <div v-for="(_item, ins) in item.article.split('\n')" v-else :key="ins">
          <p v-html="filterContent(_item)"></p>
        </div>
        <div class="show_more">查看全文</div>
      </div>
    </div>

    <div v-else class="item_article">
      <!-- <div class="title">
          {{item.title}}
        </div> -->
      <div
        @click.stop=""
        class="detail_line"
        id="detail_line"
        :style="{ width: ISPHONE ? clientWidth - 24 + 'px' : '100%' }"
      >
        <div
          v-html="item.article.replace(/\n/g, '')"
          v-if="/<[^>]+>/g.test(item.article)"
        ></div>

        <!-- <viewer :trigger="item.article"> -->
        <div v-for="(_item, ins) in item.article.split('\n')" v-else :key="ins">
          <p v-html="_item"></p>
        </div>
        <!-- </viewer> -->
      </div>
    </div>
    <viewer style="height: 0; display: none" :images="imgsArr">
      <img
        v-for="(src, index) in imgsArr"
        :data-source="src"
        :src="src"
        :id="'k' + index"
        :key="index"
      />
    </viewer>
  </div>
</template>

<script>
import 'lazysizes'
// import * as api from '@/api/api'
export default {
  name: '',
  data() {
    return {
      imgsArr: [],
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
    var el = document.getElementById('detail_line')
    if (el) {
      var imgs = el.getElementsByTagName('img')
      for (let index = 0; index < imgs.length; index++) {
        const element = imgs[index]
        this.imgsArr.push(element.src)

        element.addEventListener('click', function (e) {
          document.getElementById('k' + index).click()
        })
      }
    }
    //   console.log(imgs);
    //   let im = [];
    //   setTimeout(()=>{
    //     el.getElementsByTagName("img").forEach((item,index)=>{
    //       item.addEventListener('click',function(e){

    //         let src = e.target.currentSrc;
    //         document.getElementById('k'+index).click();
    //         console.log(src)
    //       })
    //       im.push(item.currentSrc);
    //     })
    //     this.imgsArr = im;
    //     console.log(this.imgsArr)
    //   },50)
    // }
  },
  methods: {
    toUrls(item, params) {
      this.postBehavior(item.postId, 'jump')
      this.toUrl(params)
    },
    // 过滤内容
    filterContent(content) {
      // 列表图片优化（GIF）
      try {
        if (
          content.indexOf('data:image') === -1 &&
          content.indexOf('.gif') === -1
        ) {
          content = content.replace(
            /<img src="([^"]*?)">/g,
            '<img class="lazyload" data-src="$1?x-oss-process=image/resize,h_512/format,webp/quality,q_75">'
          )
        }
      } catch (error) {
        // 出现错误不进行替换
        console.log(error)
      }
      return content
    },
  },
}
</script>

<style lang="scss" scoped type="text/scss">
.item_article {
  padding-bottom: 20px !important;
  .title {
    padding: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
  }
  .article {
    padding-bottom: 10px;
    max-height: 265px;
    overflow: hidden;
    position: relative;
    .show_more {
      position: absolute;
      top: 200px;
      left: 0;
      width: 100%;
      text-align: center;
      height: 70px;
      line-height: 90px;
      z-index: 1;
      background: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 50%);
    }
  }
  .article_phone {
    max-height: 160px;
    .show_more {
      top: 110px;
      height: 50px;
      line-height: 60px;
    }
  }
}
.item .item_article .article_phone {
  position: relative;
  // left: -50px;
}
.detail_line {
  width: 100% !important;
  overflow: hidden;
  word-break: break-all; /*支持IE，chrome，FF不支持*/
  word-wrap: break-word; /*支持IE，chrome，FF*/
  font-size: 16px;
}
/deep/ .detail_line p {
  line-height: 1.8em;
  margin-bottom: 8px;
  // margin: 1.4em 0;
}
/deep/ .detail_line img {
  max-width: 100%;
  vertical-align: middle;
  margin: 10px 0;
}
</style>

<style lang="scss">
.item_article {
  h1 {
    font-size: 24px;
    line-height: 28px;
    border-bottom: 3px double #999;
    margin: 52px 0 15px;
    padding-bottom: 7px;
  }
  > div:first-of-type h1,
  > h1:first-of-type {
    margin-top: 14px;
  }

  h2 {
    min-height: 23px;
    font-size: 22px;
    line-height: 23px;
    border-bottom: 1px solid #dbdbdb;
    margin: 20px 0 13px;
    padding-bottom: 7px;
  }

  h3 {
    font-size: 20px;
    margin: 18px 0 2px;
  }

  h4 {
    font-size: 18px;
    margin: 10px 0 2px;
  }

  h3,
  h4 {
    line-height: 18px;
  }
  h5 {
    font-size: 16px;
  }
  h6 {
    font-size: 14px;
  }
  h5,
  h6 {
    line-height: 17px;
    margin: 9px 0 -4px;
  }

  del {
    color: #999;
    text-decoration: line-through;
  }

  li {
    min-height: 22px;
  }

  blockquote {
    margin: 14px 0;
    border-left: 4px solid #e5e5e5;
    padding: 0 16px;
    color: #999;
    min-height: 20px;

    > :first-child {
      margin-top: 0;
    }
    blockquote > :last-child {
      margin-bottom: 0;
    }
  }
  code,
  pre {
    font-family: Consolas, Courier, 'Apple SD \C0B0\B3CC\ACE0\B515   Neo',
      -apple-system, Lucida Grande, Apple SD Gothic Neo,
      '\B9D1\C740   \ACE0\B515', Malgun Gothic, Segoe UI, '\B3CB\C6C0', dotum,
      sans-serif;
    border: 0;
    border-radius: 0;
  }

  code {
    color: #c1798b;
    background-color: #f9f2f4;
    padding: 2px 3px;
    letter-spacing: -0.3px;
    border-radius: 2px;
  }

  pre {
    margin: 2px 0 8px;
    padding: 18px;
    background-color: #f4f7f8;
    code {
      padding: 0;
      color: inherit;
      white-space: pre-wrap;
      background-color: transparent;
    }
  }

  table {
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: 12px 0 14px;
    color: #222;
    width: auto;
    border-collapse: collapse;
    box-sizing: border-box;
    td,
    th {
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 5px 14px 5px 12px;
      height: 32px;
    }
    th {
      background-color: #555;
      font-weight: 300;
      color: #fff;
      padding-top: 6px;
      p {
        margin: 0;
        color: #fff;
      }
    }
  }
  dir,
  menu,
  ol,
  ul {
    display: block;
    list-style-type: none;
    padding-left: 24px;
    margin: 6px 0 10px;
    color: #222;
  }
  ol {
    list-style-type: none;
    counter-reset: li;
    li {
      counter-increment: li;
    }
  }

  ol > li:before,
  ul > li:before {
    display: inline-block;
    position: absolute;
  }
  ul > li:before {
    content: '';
    margin-top: 11px;
    margin-left: -17px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #ccc;
  }
  ol > li:before {
    content: '.' counter(li);
    margin-left: -28px;
    width: 24px;
    line-height: 28px;
    text-align: right;
    direction: rtl;
    color: #aaa;
  }
  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  ol li,
  ul li {
    position: relative;
  }
  ol p,
  ul p {
    margin: 0;
  }
  hr {
    border-top: 1px solid #eee;
    margin: 16px 0;
  }
  .task-list-item {
    border: 0;
    list-style: none;
    padding-left: 24px;
    margin-left: -24px;
    &:before {
      background-repeat: no-repeat;
      background-size: 18px 18px;
      background-position: 50%;
      content: '';
      margin-left: 0;
      margin-top: 0;
      border-radius: 2px;
      height: 18px;
      width: 18px;
      position: absolute;
      left: 0;
      top: 6px;
      cursor: pointer;
      background: transparent
        url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIHN0cm9rZT0iI0NDQyI+PGc+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMzAgLTI5NikgdHJhbnNsYXRlKDc4OCAxOTIpIHRyYW5zbGF0ZSgyNDIgMTA0KSI+PHJlY3Qgd2lkdGg9IjE3IiBoZWlnaHQ9IjE3IiB4PSIuNSIgeT0iLjUiIHJ4PSIyIi8+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==');
    }
    &.checked:before {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0Qjk2RTYiPjxnPjxnPjxwYXRoIGQ9Ik0xNiAwYzEuMTA1IDAgMiAuODk1IDIgMnYxNGMwIDEuMTA1LS44OTUgMi0yIDJIMmMtMS4xMDUgMC0yLS44OTUtMi0yVjJDMCAuODk1Ljg5NSAwIDIgMGgxNHptLTEuNzkzIDUuMjkzYy0uMzktLjM5LTEuMDI0LS4zOS0xLjQxNCAwTDcuNSAxMC41ODUgNS4yMDcgOC4yOTNsLS4wOTQtLjA4M2MtLjM5Mi0uMzA1LS45Ni0uMjc4LTEuMzIuMDgzLS4zOS4zOS0uMzkgMS4wMjQgMCAxLjQxNGwzIDMgLjA5NC4wODNjLjM5Mi4zMDUuOTYuMjc4IDEuMzItLjA4M2w2LTYgLjA4My0uMDk0Yy4zMDUtLjM5Mi4yNzgtLjk2LS4wODMtMS4zMnoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDUwIC0yOTYpIHRyYW5zbGF0ZSg3ODggMTkyKSB0cmFuc2xhdGUoMjYyIDEwNCkiLz48L2c+PC9nPjwvZz48L2c+PC9zdmc+');
    }
  }
}
</style>
