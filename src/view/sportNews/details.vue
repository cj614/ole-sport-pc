<template>
  <module-self>
    <div class="m_sport_news_details">
      <div style="width: 80px;height: 29px; display: flex; align-items: center; cursor: pointer;" @click="back">
        <v-icon size="18" style="color: #E4CAAB !important;">mdi-arrow-left</v-icon>
        <span style="color: #E4CAAB;margin-left: 10px;">{{ $t(`Module['返回']`) }}</span>
      </div>

      <div class="news_content">
        <div class="news_title">
          <div class="_title">{{ news.title }}</div>
          <div class="_date">{{ $t(`Module['发布于']`) + day(news.created_utc_timestamp || '') }}</div>
        </div>
        <MyDplayer class="news_video" :movie="videoInfo" v-if="videoInfo.video"></MyDplayer>
        <div class="html_content" v-html="news.content"></div>
        <div class="ellipsisread" @click="likeNews">
          <span>{{ $t(`Module['阅读']`) }} {{ news.read_num }}</span>
          <div style="display: flex; align-items: center;">
            <v-img class="img" :src="news.is_nice ? Img.ThumbUped : Img.ThumbUp"></v-img>
            <span> {{ news.like_num }} </span>
          </div>
        </div>
      </div>
      <div style="width: 80px;height:1px;"></div>
    </div>


    <!-- <view class="ellipsisread">
      <text>{{ $t('阅读') }} {{ news.read_num }}</text>
      <image style="width: 26rpx;height: 26rpx;margin-left: 35rpx;margin-right: 5rpx;" @click="likeNews"
        :src="news.is_nice ? Img.ThumbUped : Img.ThumbUp">
      </image>
      <text> {{ news.like_num }} </text>
    </view> -->
    <!-- <page-adv left="Pc-News detail left side banner" right="Pc-News detail right side banner"></page-adv>
    <page-footeradv footer="Pc-News detail footer banner"></page-footeradv> -->

  </module-self>

</template>

<script>
import dayjs from 'dayjs'
import {
  sportNewDetail,
  commentSportNews,
  niceNews,
  topSportNewList
} from '@/api/sportNews'
import MyDplayer from "_c/module/myDplayer.vue";

//operateComment
import { makeComment, likeComment, operateComment } from '@/api/sport'
export default {
  components: { MyDplayer },

  data() {
    return {
      news: {},
      videoInfo: {
        img: '',
        video: '',
        videType: '',
      },
      content: '',
      loading: false,
      headerBanner: false,
      Img: {
        ThumbUp: require(`@/${this.$img.Page.News.ThumbUp}`),
        ThumbUped: require(`@/${this.$img.Page.News.ThumbUped}`),
      },
      commentList: [],
      matchList: [],
      shareInfo: {
        url: '',
        title: '',
        description: '',
        quote: '',
        hashtags: '',
        twitterUser: ''
      },
      page: {
        page: 1,
        limit: 5,
      },

    }
  },

  watch: {
    '$route.params': {
      handler() {
        this.sportNewDetail()
        this.getCommentSportNews()
        this.topSportNewList()
      }
    }
  },

  computed: {
    prefix() {
      return JSON.parse(this.$store.state.app.localConfig).prefix || ''
    },
    showTitle() {
      const { prefix } = this
      return !['TH', 'ID'].includes(prefix)
    },

    id() {
      return this.$route.params.id || 0
    },

    userInfo() {
      return JSON.parse(this.$store.state.user.userInfo) || {}
    },

    user() {
      return JSON.parse(this.$store.state.user.userInfo).user || {}
    },

    token() {
      let { token } = this.userInfo
      return token || ''
    },

    otherList() {
      return [
        {
          text: this.$t(`Module['删除']`),
          label: this.$t(`Module['删除']`),
          value: 1
        },
        {
          text: this.$t(`Module['禁言']`),
          label: this.$t(`Module['禁言']`),
          value: 2
        },
        {
          text: this.$t(`Module['拉黑']`),
          label: this.$t(`Module['拉黑']`),
          value: 3
        }
      ]
    }
  },

  mounted() {
    this.sportNewDetail()
    this.getCommentSportNews()
    this.topSportNewList()
  },

  methods: {
    back() {
      this.$router.go(-1);
    },
    day(date) {
      return dayjs(date * 1000).format('YYYY-MM-DD HH:mm')
    },
    async likeNews() {
      let status = 1
      if (this.news.is_nice) {
        status = 0
      }
      let result = await niceNews({
        news_id: this.news.id * 1,
        status: status
      })
      console.log('result', result)
      if (result.Code === 200) {
        this.news.is_nice = !this.news.is_nice
        if (result.Data.status == 1) {
          this.news.like_num += 1
        }
      }
    },
    async getCommentSportNews() {
      const { Code, Data } = await commentSportNews({ id: this.id })
      if (Code === 200) {
        const { Data: List } = Data
        this.commentList = List
      }
    },

    async activeMenuItem(row, item, index) {
      const { value } = row
      const { user_id, id } = item
      const params = {}
      switch (value) {
        case 1:
          params.del_comment_id = id
          break
        case 2:
          params.shutup_user_id = user_id
          break
        case 3:
          params.block_user_id = user_id

          break
      }
      const { Code } = await operateComment(params)
      if (Code === 200) {
        this.$toast.success(this.$t(`Module['操作成功']`))
        this.getCommentSportNews()
      }
    },

    handleClickItem(item) {
      this.$router.push({ name: 'sportNewsDetails', params: { id: item.id } })
    },

    async topSportNewList() {
      const {
        page: { page, limit }
      } = this
      const { Code, Data } = await topSportNewList({ page, limit })
      if (Code === 200) {
        this.matchList = Data.Data
      }
    },

    async handleContent() {
      try {
        if (!this.token) {
          this.$bus.$emit('login/on', 'login')
          return
        }
        this.loading = true
        if (!this.content) {
          this.$bus.$emit('snackbar/on', this.$t(`Module['请输入评论']`))
          return
        }
        const { Code } = await makeComment({
          sport_news_id: this.id,
          comment: this.content
        })
        if (Code === 200) {
          this.$bus.$emit('snackbar/on', this.$t(`Module['评论成功']`))
          this.content = ''
          this.page.page = 1
          this.getCommentSportNews()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async handleLike(item) {
      if (!this.token) {
        this.$bus.$emit('login/on', 'login')
        return
      }
      const { Code, Data } = await likeComment({
        comment_id: item.id,
        status: !item.is_nice
      })
      if (Code === 200) {
        this.$set(item, 'nice_count', Data.nice_count)
        this.$set(item, 'is_nice', Data.status)
      }
    },

    async sportNewDetail() {
      const { Code, Data } = await sportNewDetail({ id: this.id })
      if (Code === 200) {
        let newsData = Data.data
        this.news = newsData
        this.videoInfo.video = newsData.video_url
        this.videoInfo.img = newsData.img_url
        this.shareInfo.url = window.location.href
        this.shareInfo.title = `${newsData.title}`
        this.shareInfo.description = `${newsData.competition}`
        this.shareInfo.quote = `${newsData.competition}`
        this.shareInfo.hashtags = `${newsData.competition}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsisread {
  display: flex;
  align-items: center;
  justify-content: baseline;
  color: var(--Color-, #A5A9B3);
  font-size: 12px;
  margin-top: 10px;

  .img {
    width: 13px;
    height: 13px;

    margin-left: 30px;
    margin-right: 3px;
  }
}

.m_sport_news_details {
  @apply flex;
  justify-content: center;
  padding-top: 40px;

  .news_content {
    @apply w-955px min-h-825px p-20px mb-10px;

    .news_title {
      @apply w-full;
      color: #fff;
      text-align: center;

      ._title {
        @apply text-40px font-bold;
      }

      ._date {
        @apply text-14px text-info mt-16px;
        color: #999999;
      }
    }

    .news_video {
      #dplayer_video {
        width: 915px !important;
      }

    }

    .html_content {
      color: #fff;
      margin-top: 40px;

      .img_wrapper {
        @apply w-full flex flex-col justify-center items-center;

        img {
          width: 610px !important;
          height: 342px !important;
          border-radius: 10px;
        }

        p {
          margin-bottom: 0px;
          font-size: 16px;
          color: #000;
          line-height: 24px;
          font-family: Kanit;
        }

        a {
          color: #1862c8;
          font-size: 16px;
          line-height: 24px;
        }
      }
    }

    .html_source {
      @apply w-full flex justify-center text-24px font-700 leading-24px;
    }
  }
}
</style>
