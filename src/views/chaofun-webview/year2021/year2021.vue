<template>
  <div style="padding-left: 10px; padding-right: 10px">
    <!--头像-->
    <div v-if="userInfo">
      <div
        class="year_2021_title"
        style="font-weight: bold; font-size: 24px; color: #ff9300"
      >
        在炒饭
      </div>
      <div>
        你注册于
        {{ moment(year2021.register_time).format('YYYY年MM月DD日 HH:mm:ss') }}
      </div>
      <div>成为 {{ year2021.total_users }} 名饭友中的一员</div>
      <div>是炒饭第 {{ year2021.register_rank }} 位注册的用户</div>
      <div>
        炒饭已经陪伴了你
        {{
          parseInt((moment() - year2021.register_time) / 1000 / 60 / 60 / 24)
        }}
        天
      </div>
      <div
        class="year_2021_title"
        style="font-weight: bold; font-size: 24px; color: #ff9300"
      >
        你的 Fun 2021
      </div>
      <div>你使用了炒饭 {{ parseInt(year2021.minutes) }} 分钟</div>
      <div>
        你发布了 {{ year2021.posts != null ? year2021.posts : 0 }} 篇帖子
      </div>
      <div>
        你浏览了
        {{ year2021.total_shows != null ? year2021.total_shows : 0 }} 篇帖子
      </div>
      <div>
        你评论了 {{ year2021.comments != null ? year2021.comments : 0 }} 次
      </div>
      <div>
        你点赞了
        {{ year2021.total_upvotes != null ? year2021.total_upvotes : 0 }} 次
      </div>
      <div>
        你收藏了
        {{ year2021.total_saves != null ? year2021.total_saves : 0 }} 篇帖子
      </div>
      <div>新的一年，希望炒饭能让你找到更多乐趣，发现更大的世界.</div>
      <div
        class="year_2021_title"
        style="font-weight: bold; font-size: 24px; color: #ff9300"
      >
        你收获的
      </div>
      <div>
        2021年，你收获了
        {{ year2021.total_ups != null ? year2021.total_ups : 0 }} 个赞,
        全站排名第
        {{ year2021.total_ups_rank != null ? year2021.total_ups_rank : 0 }}
      </div>
      <div>请再接再厉</div>

      <div v-if="this.year2021.most_like_forum != null">
        <div
          class="year_2021_title"
          style="font-weight: bold; font-size: 24px; color: #ff9300"
        >
          你最喜欢的版块
        </div>
        <div style="height: 30px">
          <img
            style="display: inline-block; height: 100%"
            :src="imgOrigin + this.year2021.most_like_forum.imageName"
          />
          <div
            style="
              display: inline-block;
              height: 100%;
              width: 100px;
              vertical-align: top;
            "
          >
            <div
              style="
                display: table-cell;
                height: 30px;
                vertical-align: middle;
                padding-left: 10px;
              "
            >
              {{ year2021.most_like_forum.name }}
            </div>
          </div>
        </div>
        <div>
          在这里, 你发布了
          {{
            year2021.most_like_forum_posts != null
              ? year2021.most_like_forum_posts
              : 0
          }}
          篇帖子, 浏览了
          {{
            year2021.most_like_forum_shows != null
              ? year2021.most_like_forum_shows
              : 0
          }}
          篇帖子，点赞了
          {{
            year2021.most_like_forum_upvotes != null
              ? year2021.most_like_forum_upvotes
              : 0
          }}
          次，发出了
          {{
            year2021.most_like_forum_comments != null
              ? year2021.most_like_forum_comments
              : 0
          }}
          条评论，收藏了
          {{
            year2021.most_like_forum_saves != null
              ? year2021.most_like_forum_saves
              : 0
          }}
          篇帖子
        </div>
      </div>
      <div v-if="this.year2021.most_like_user != null">
        <div
          class="year_2021_title"
          style="font-weight: bold; font-size: 24px; color: #ff9300"
        >
          你最赞赏的用户
        </div>
        <div style="height: 30px">
          <img
            style="display: inline-block; height: 100%"
            :src="imgOrigin + this.year2021.most_like_user.icon"
          />
          <div
            style="
              display: inline-block;
              height: 100%;
              width: 100px;
              vertical-align: top;
            "
          >
            <div
              style="
                display: table-cell;
                height: 30px;
                vertical-align: middle;
                padding-left: 10px;
              "
            >
              {{ year2021.most_like_user.userName }}
            </div>
          </div>
        </div>
        <div>
          你看了TA发布的
          {{
            year2021.most_like_user_shows != null
              ? year2021.most_like_user_shows
              : 0
          }}
          篇帖子，点赞了TA
          {{
            year2021.most_like_user_upvotes != null
              ? year2021.most_like_user_upvotes
              : 0
          }}
          次，评论了TA
          {{
            year2021.most_like_user_comments != null
              ? year2021.most_like_user_comments
              : 0
          }}
          次，收藏了TA
          {{
            year2021.most_like_user_saves != null
              ? year2021.most_like_user_saves
              : 0
          }}
          篇帖子
        </div>
      </div>

      <div v-if="this.year2021.most_be_like_user != null">
        <div
          class="year_2021_title"
          style="font-weight: bold; font-size: 24px; color: #ff9300"
        >
          谁最关注你
        </div>
        <div style="height: 30px">
          <img
            style="display: inline-block; height: 100%"
            :src="imgOrigin + this.year2021.most_be_like_user.icon"
          />
          <div
            style="
              display: inline-block;
              height: 100%;
              width: 100px;
              vertical-align: top;
            "
          >
            <div
              style="
                display: table-cell;
                height: 30px;
                vertical-align: middle;
                padding-left: 10px;
              "
            >
              {{ year2021.most_be_like_user.userName }}
            </div>
          </div>
        </div>
        <div>
          TA看了你发布的
          {{
            year2021.most_be_like_user_shows != null
              ? year2021.most_be_like_user_shows
              : 0
          }}
          篇帖子, 点赞了你
          {{
            year2021.most_be_like_user_upvotes != null
              ? year2021.most_be_like_user_upvotes
              : 0
          }}
          次，评论了你
          {{
            year2021.most_be_like_user_comments != null
              ? year2021.most_be_like_user_comments
              : 0
          }}
          次，收藏了你
          {{
            year2021.most_be_like_user_saves
              ? year2021.most_be_like_user_saves
              : 0
          }}
          篇帖子
        </div>
      </div>
      <div
        class="year_2021_title"
        style="font-weight: bold; font-size: 24px; color: #ff9300; width: 100%"
      >
        你获得的年度徽章
        <div
          v-if="this.year2021.total_ups_rank <= 10"
          @click="toBadge(11)"
          style="width: 100%; text-align: center"
        >
          <img
            src="https://i.chao.fun/biz/c4b9870e41eb2d27c52370251765704c.png"
            style="display: inline-block; vertical-align: middle"
          />
          <div style="color: #4e7db8">炒饭2021白金</div>
        </div>
        <div
          v-else-if="this.year2021.total_ups_rank <= 50"
          @click="toBadge(10)"
          style="width: 100%; text-align: center"
        >
          <img
            src="https://i.chao.fun/biz/c01094eabfc82a18337f85a25de29b21.png"
            style="align-items: center"
          />
          <div style="color: #f35e23">炒饭2021黄金</div>
        </div>
        <div
          v-else-if="this.year2021.total_ups_rank <= 150"
          @click="toBadge(9)"
          style="width: 100%; text-align: center"
        >
          <img
            src="https://i.chao.fun/biz/7a49afb7f3c5478405759787a8ae45c6.png"
            style="align-items: center"
          />
          <div style="color: #677c94">炒饭2021白银</div>
        </div>
        <div
          v-else-if="this.year2021.total_ups_rank <= 350"
          @click="toBadge(8)"
          style="width: 100%; text-align: center"
        >
          <img
            src="https://i.chao.fun/biz/9cf8273f24cddf5b33bead625f7bcd79.png"
            style="align-items: center"
          />
          <div style="color: #6a9191">炒饭2021青铜</div>
        </div>
        <div v-else style="color: black">很遗憾，你未获得徽章，请再接再厉</div>
      </div>
    </div>
    <div v-else>请先登录</div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import moment from 'moment'
export default {
  name: 'Year2021.vue',

  data() {
    return {
      userInfo: {},
      year2021: {},
      moment: moment,
    }
  },
  created() {
    api.getUserInfo().then((res) => {
      if (res.success && res.data) {
        this.userInfo = res.data
      } else {
        this.$toast('请先登录')
      }
    })
    api.getByPath('/api/v0/getYear2021', null).then((res) => {
      if (res.success) {
        this.year2021 = res.data
      } else {
      }
    })
  },
  mounted() {},

  methods: {
    toBadge(badge) {
      window.open('https://chao.fun/webview/badge?badgeId=' + badge, '_blank')
    },
  },
}
</script>

<style scoped>
.year_2021_title {
}
</style>
